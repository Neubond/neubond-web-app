"use client";

import { UpdatePasswordForm } from "@/components/update-password-form";
import { AppPreview } from "@/components/app-preview";
import Image from "next/image";

export default function UpdatePasswordPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Left column */}
      <div className="flex flex-col gap-4 p-6 md:p-10">
        {/* Branding */}
        <div className="flex justify-center gap-2 md:justify-start">
          <a
            href="https://neubond.co.uk/"
            className="flex items-center gap-2 font-medium"
          >
            <Image
              src="/neubond_logo.png"
              alt="Neubond logo"
              width={180} // choose the width you want
              height={0} // required to allow auto height
              sizes="100vw" // ensures correct responsive behaviour
              style={{ height: "auto" }} // keeps aspect ratio
            />
          </a>
        </div>

        {/* Form container */}
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <UpdatePasswordForm />
          </div>
        </div>
      </div>

      {/* Right column: message + preview */}
      <div className="relative hidden lg:flex flex-col items-center justify-center bg-[#8A65BA] p-10 text-white">
        {/* Friendly message */}
        <div className="max-w-md text-center mb-8">
          <h2 className="text-2xl font-semibold">
            Create a new password to regain access to your account.
          </h2>
        </div>

        {/* App preview */}
        <AppPreview />
      </div>
    </div>
  );
}
