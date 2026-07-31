"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

type Status = "idle" | "uploading" | "success" | "error";

const LABEL_RE = /^[a-zA-Z0-9._-]*$/;

export function IFUPublishForm() {
  const [label, setLabel] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [resultPathname, setResultPathname] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function handleLabelChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    if (LABEL_RE.test(val)) setLabel(val);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!label || !file) return;

    setStatus("uploading");
    setProgress(0);
    setErrorMessage("");

    const body = new FormData();
    body.set("label", label);
    body.set("file", file);

    try {
      const { pathname } = await new Promise<{ pathname: string }>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/ifu/upload");
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
        };
        xhr.onload = () => {
          let json: { pathname?: string; error?: string } = {};
          try {
            json = JSON.parse(xhr.responseText);
          } catch {
            // ignore parse failure, handled by status check below
          }
          if (xhr.status >= 200 && xhr.status < 300 && json.pathname) {
            resolve({ pathname: json.pathname });
          } else {
            reject(new Error(json.error ?? "Upload failed."));
          }
        };
        xhr.onerror = () => reject(new Error("Upload failed."));
        xhr.send(body);
      });
      setResultPathname(pathname);
      setStatus("success");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Upload failed.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm font-medium text-green-700 dark:text-green-400">
          Published successfully.
        </p>
        <p className="text-xs text-neutral-500 font-mono break-all">{resultPathname}</p>
        <div className="flex gap-3 mt-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/ifu">View version history</Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setStatus("idle");
              setLabel("");
              setProgress(0);
              setResultPathname("");
              if (fileRef.current) fileRef.current.value = "";
            }}
          >
            Publish another
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="ifu-label">Version label</Label>
        <Input
          id="ifu-label"
          value={label}
          onChange={handleLabelChange}
          placeholder="e.g. v1.0 or Rev-02"
          required
          disabled={status === "uploading"}
          className="font-mono"
        />
        <p className="text-xs text-neutral-500">
          Letters, numbers, dots, hyphens, underscores only. Cannot be changed after publishing.
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="ifu-file">PDF file</Label>
        <input
          id="ifu-file"
          ref={fileRef}
          type="file"
          accept="application/pdf"
          required
          disabled={status === "uploading"}
          className="text-sm file:mr-3 file:rounded file:border-0 file:bg-neutral-100 file:px-3 file:py-1.5 file:text-sm file:font-medium dark:file:bg-neutral-800 dark:file:text-neutral-200"
        />
      </div>

      {status === "uploading" && (
        <div className="flex flex-col gap-1.5">
          <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
            <div
              className="h-full bg-green-600 transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-neutral-500 text-right">{progress}%</p>
        </div>
      )}

      {status === "error" && (
        <p className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
      )}

      <Button type="submit" disabled={status === "uploading" || !label}>
        {status === "uploading" ? "Uploading…" : "Publish"}
      </Button>
    </form>
  );
}
