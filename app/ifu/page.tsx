import { redirect } from "next/navigation";
import { Suspense } from "react";
import { connection } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const fmtDate = (d: Date | string) =>
  new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const labelFor = (pathname: string) =>
  pathname.replace(/^ifu\//, "").replace(/\.pdf$/, "");

async function IFUVersionList() {
  await connection();

  if (process.env.IFU_REQUIRE_AUTH === "true") {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getClaims();
    if (error || !data?.claims)
      redirect(`/auth/login?redirectTo=${encodeURIComponent("/ifu")}`);
  }

  const { env } = getCloudflareContext();
  const { objects } = await env.IFU_BUCKET.list({ prefix: "ifu/" });

  const versions = objects
    .filter((o) => o.key.endsWith(".pdf"))
    .map((o) => ({ pathname: o.key, uploadedAt: o.uploaded }))
    .sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());

  if (versions.length === 0) {
    return <p className="text-sm text-neutral-500">No versions published yet.</p>;
  }

  return (
    <ul className="divide-y divide-neutral-200 dark:divide-neutral-800">
      {versions.map((v, i) => {
        const href = `/ifu/download?file=${encodeURIComponent(v.pathname)}`;
        return (
          <li key={v.pathname} className="py-3 first:pt-0 last:pb-0">
            <a
              href={href}
              className="flex items-center justify-between gap-4 hover:underline"
            >
              <span className="flex items-center gap-2">
                {i === 0 && (
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/40 dark:text-green-400">
                    Current
                  </Badge>
                )}
                <span className="font-medium font-mono text-sm">
                  {labelFor(v.pathname)}
                </span>
              </span>
              <span className="text-sm text-neutral-500 shrink-0">
                {fmtDate(v.uploadedAt)}
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export default function IFUPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Instructions for Use</CardTitle>
          <CardDescription>
            All published versions are listed below. The most recent is always current.
          </CardDescription>
        </CardHeader>

        <Separator />

        <CardContent className="pt-6">
          <Suspense fallback={<p className="text-sm text-neutral-500">Loading…</p>}>
            <IFUVersionList />
          </Suspense>
        </CardContent>
      </Card>
    </main>
  );
}
