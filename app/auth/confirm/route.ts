import { createClient } from "@/lib/supabase/server";
import { type EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/";

  if (token_hash && type) {
    // For password recovery, don't consume the token here. Merely opening the
    // link (real clicks, refreshes, or email security scanners prefetching the
    // URL) would otherwise burn the single-use token before the user gets to
    // set a new password. Forward the token to the update-password page and let
    // it verify the OTP at save time instead.
    if (type === "recovery") {
      redirect(
        `/auth/update-password?token_hash=${encodeURIComponent(
          token_hash,
        )}&type=recovery`,
      );
    }

    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error) {
      // If this was a signup verification, sign them out immediately
      if (type === "signup") {
        await supabase.auth.signOut();
      }

      redirect(next);
    } else {        
      redirect(`/auth/error?error=${error.message}`);
    }
  }

  redirect(`/auth/error?error=No token hash or type`);
                                                                  }
