import { redirect } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { isAuthorizedPublisher } from "@/lib/ifu/auth";
import { IFUPublishForm } from "@/components/ifu-publish-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

async function PublishContent() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims)
    redirect(`/auth/login?redirectTo=${encodeURIComponent("/ifu/publish")}`);
  if (!isAuthorizedPublisher(data.claims.email)) redirect("/auth/login");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Publish IFU Version</CardTitle>
        <CardDescription>
          Upload a new PDF. Published versions are permanent and cannot be overwritten or deleted.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <IFUPublishForm />
      </CardContent>
    </Card>
  );
}

export default function IFUPublishPage() {
  return (
    <main className="mx-auto max-w-lg px-6 py-16">
      <Suspense>
        <PublishContent />
      </Suspense>
    </main>
  );
}
