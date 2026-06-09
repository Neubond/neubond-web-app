import { type NextRequest } from "next/server";
import { list } from "@vercel/blob";
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

  const token = process.env.BLOB_READ_WRITE_TOKEN;

  const { blobs } = await list({ prefix: "ifu/", token });

  const versions = blobs
    .filter((b) => b.pathname.endsWith(".pdf"))
    .sort(
      (a, b) =>
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
    );

  if (versions.length === 0) {
    return new Response("No IFU version has been published yet.", {
      status: 404,
      headers: { "X-Robots-Tag": NOINDEX },
    });
  }

  const current = versions[0];

  const upstream = await fetch(current.url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!upstream.ok) {
    return new Response("IFU file not found.", {
      status: 404,
      headers: { "X-Robots-Tag": NOINDEX },
    });
  }

  const buffer = await upstream.arrayBuffer();
  const label = labelFor(current.pathname);

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
