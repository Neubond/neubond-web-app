import { type NextRequest } from "next/server";
import { head } from "@vercel/blob";
import { createClient } from "@/lib/supabase/server";

const NOINDEX = "noindex, nofollow";

const labelFor = (pathname: string) =>
  pathname.replace(/^ifu\//, "").replace(/\.pdf$/, "");

export async function GET(request: NextRequest) {
  if (process.env.IFU_REQUIRE_AUTH === "true") {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getClaims();
    if (error || !data?.claims) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set(
        "redirectTo",
        request.nextUrl.pathname + request.nextUrl.search,
      );
      return Response.redirect(loginUrl);
    }
  }

  const file = request.nextUrl.searchParams.get("file");

  if (!file || !file.startsWith("ifu/") || !file.endsWith(".pdf")) {
    return new Response("Invalid file parameter.", {
      status: 400,
      headers: { "X-Robots-Tag": NOINDEX },
    });
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN;

  const blobMeta = await head(file, { token }).catch(() => null);

  if (!blobMeta) {
    return new Response("File not found.", {
      status: 404,
      headers: { "X-Robots-Tag": NOINDEX },
    });
  }

  const upstream = await fetch(blobMeta.url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!upstream.ok) {
    return new Response("File not found.", {
      status: 404,
      headers: { "X-Robots-Tag": NOINDEX },
    });
  }

  const buffer = await upstream.arrayBuffer();
  const label = labelFor(file);

  return new Response(buffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="IFU-${label}.pdf"`,
      "Content-Length": buffer.byteLength.toString(),
      "X-Robots-Tag": NOINDEX,
      "Cache-Control": "no-store",
    },
  });
}
