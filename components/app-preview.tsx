"use client";

import Image from "next/image";

export function AppPreview() {
  return (
    <div className="relative flex flex-col items-center justify-center bg-[#8A65BA] p-10">
      {/* iPad-style bezel */}
      <div className="bg-black rounded-4xl p-4 shadow-2xl border border-white/20 w-full max-w-[700px]">
        <div className="rounded-xl overflow-hidden">
          <Image
            src="/App-Screenshot.png"
            alt="Neubond app preview"
            width={700}
            height={500}
            className="w-full h-auto object-cover"
          />
        </div>
      </div>
    </div>
  );
}
