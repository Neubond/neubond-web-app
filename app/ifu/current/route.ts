import { type NextRequest } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { createClient } from "@/lib/supabase/server";

const NOINDEX = "noindex, nofollow";

const labelFor = (pathname: string) =>
  pathname.replace(/^ifu\//, "").replace(/\.pdf$/, "");

export async function GET(request: NextRequest) {
  let supabaseForSignOut: Awaited<ReturnType<typeof createClient>> | null = null;

  if (process.env.IFU_REQUIRE_AUTH === "true") {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getClaims();
    if (error || !data?.claims) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirectTo", request.nextUrl.pathname);
      return Response.redirect(loginUrl);
    }
    supabaseForSignOut = supabase;
  }

  const { env } = getCloudflareContext();

  const { objects } = await env.IFU_BUCKET.list({ prefix: "ifu/" });
  const versions = objects
    .filter((o) => o.key.endsWith(".pdf"))
    .sort((a, b) => b.uploaded.getTime() - a.uploaded.getTime());

  if (versions.length === 0) {
    return new Response("No IFU version has been published yet.", {
      status: 404,
      headers: { "X-Robots-Tag": NOINDEX },
    });
  }

  const current = versions[0];
  const object = await env.IFU_BUCKET.get(current.key);

  if (!object) {
    return new Response("IFU file not found.", {
      status: 404,
      headers: { "X-Robots-Tag": NOINDEX },
    });
  }

  const buffer = await object.arrayBuffer();
  const label = labelFor(current.key);

  if (supabaseForSignOut) {
    await supabaseForSignOut.auth.signOut();
  }

  return new Response(buffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="IFU-${label}.pdf"`,
      "Content-Length": buffer.byteLength.toString(),
      "X-Robots-Tag": NOINDEX,
      "Cache-Control": "no-store",
    },
  });
}
