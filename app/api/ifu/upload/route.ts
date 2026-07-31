import { getCloudflareContext } from "@opennextjs/cloudflare";
import { type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAuthorizedPublisher } from "@/lib/ifu/auth";

const LABEL_RE = /^[a-zA-Z0-9._-]+$/;

export async function POST(request: NextRequest): Promise<Response> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    return Response.json({ error: "Unauthorized: no valid session." }, { status: 401 });
  }
  if (!isAuthorizedPublisher(data.claims.email)) {
    return Response.json(
      { error: "Forbidden: your account is not authorized to publish IFU versions." },
      { status: 403 },
    );
  }

  const formData = await request.formData();
  const label = (formData.get("label") as string | null ?? "").trim();
  const file = formData.get("file") as File | null;

  if (!label || !LABEL_RE.test(label)) {
    return Response.json(
      {
        error:
          "Invalid version label. Use only letters, numbers, dots, hyphens, and underscores (e.g. v1.0, Rev-02).",
      },
      { status: 400 },
    );
  }
  if (!file || file.type !== "application/pdf") {
    return Response.json({ error: "A PDF file is required." }, { status: 400 });
  }

  const pathname = `ifu/${label}.pdf`;
  const { env } = getCloudflareContext();

  const existing = await env.IFU_BUCKET.head(pathname);
  if (existing) {
    return Response.json(
      {
        error: `Version "${label}" is already published. Published versions are permanent and cannot be overwritten.`,
      },
      { status: 409 },
    );
  }

  await env.IFU_BUCKET.put(pathname, await file.arrayBuffer(), {
    httpMetadata: { contentType: "application/pdf" },
  });

  console.log("[IFU] Published:", pathname, "at", new Date().toISOString());

  return Response.json({ pathname });
}
