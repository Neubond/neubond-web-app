// app/login-callback/page.tsx

import { AppPreview } from "@/components/app-preview";

export default function LoginCallbackPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#8A65BA] px-6 py-16 text-white">
      <div className="max-w-2xl text-center mb-12">
        <h1 className="text-3xl font-semibold mb-4">Open the Neubond app</h1>
        <p className="text-lg opacity-90">
          This link is meant to be opened in the Neubond app. If it did not open
          automatically, make sure the app is installed and try the link again
          from your device.
        </p>
      </div>

      <div className="w-full max-w-[700px]">
        <AppPreview />
      </div>
    </div>
  );
}
