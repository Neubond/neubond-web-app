"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon } from "lucide-react";

// ---------------------------------------------------------------------------
// Validators — mirrors Validators class in validators.dart
// ---------------------------------------------------------------------------

const PASSWORD_UPPERCASE = /[A-Z]/;
const PASSWORD_LOWERCASE = /[a-z]/;
const PASSWORD_DIGIT = /[0-9]/;
const PASSWORD_SYMBOL = /[!@#$%^&*(),.?":{}|<>]/;

function isValidPassword(password: string): boolean {
  if (password.length < 8 || password.length > 128) return false;
  if (!PASSWORD_UPPERCASE.test(password)) return false;
  if (!PASSWORD_LOWERCASE.test(password)) return false;
  if (!PASSWORD_DIGIT.test(password)) return false;
  if (!PASSWORD_SYMBOL.test(password)) return false;
  return true;
}

// mirrors Validators.missingPasswordRequirementLabels
function missingPasswordRequirements(password: string): string[] {
  const missing: string[] = [];
  if (password.length < 8) {
    missing.push("At least 8 characters");
  } else if (password.length > 128) {
    missing.push("At most 128 characters");
  }
  if (!PASSWORD_UPPERCASE.test(password)) missing.push("One uppercase letter");
  if (!PASSWORD_LOWERCASE.test(password)) missing.push("One lowercase letter");
  if (!PASSWORD_DIGIT.test(password)) missing.push("One number");
  if (!PASSWORD_SYMBOL.test(password)) missing.push("One symbol (!@#$%^&*…)");
  return missing;
}

// ---------------------------------------------------------------------------
// Feedback helpers — mirrors PasswordFieldFeedback in auth_form_widgets.dart
// ---------------------------------------------------------------------------

type FeedbackVariant = "hint" | "valid" | "invalid" | "neutral";

interface Feedback {
  lines: string[]; // first item is the main message, rest are bullet items
  variant: FeedbackVariant;
}

// mirrors PasswordFieldFeedback.forSignUpPassword
function passwordFeedbackFor(password: string, touched: boolean): Feedback {
  if (!touched || password.length === 0) {
    return { lines: ["Create a strong password."], variant: "hint" };
  }
  if (isValidPassword(password)) {
    return { lines: ["Password strength looks good."], variant: "valid" };
  }
  const missing = missingPasswordRequirements(password);
  return {
    lines: ["Still needed:", ...missing.map((r) => `• ${r}`)],
    variant: "invalid",
  };
}

// mirrors PasswordFieldFeedback.forSignUpConfirmPassword
function confirmFeedbackFor(
  password: string,
  confirm: string,
  touched: boolean,
): Feedback {
  if (!touched || confirm.length === 0) {
    return {
      lines: [
        password.length === 0
          ? "Re-enter your password."
          : "Re-enter your password.",
      ],
      variant: "hint",
    };
  }
  if (confirm !== password) {
    return { lines: ["Passwords do not match."], variant: "invalid" };
  }
  // matches but password itself may still be invalid — show neutral "match" not green
  if (!isValidPassword(password)) {
    return { lines: ["Passwords match."], variant: "neutral" };
  }
  return { lines: ["Passwords match."], variant: "valid" };
}

const variantClass: Record<FeedbackVariant, string> = {
  hint: "text-muted-foreground",
  valid: "text-green-600",
  invalid: "text-red-500",
  neutral: "text-muted-foreground",
};

// ---------------------------------------------------------------------------
// Breached-password check — mirrors Supabase's leaked-password protection,
// which uses the HaveIBeenPwned Pwned Passwords range API. k-anonymity: only
// the first 5 chars of the SHA-1 hash ever leave the browser, never the
// password. Doing it here lets us warn in realtime instead of failing
// server-side after the recovery token has already been spent.
// ---------------------------------------------------------------------------

type PwnedStatus = "idle" | "checking" | "safe" | "pwned" | "error";

async function countPwnedOccurrences(password: string): Promise<number> {
  const digest = await crypto.subtle.digest(
    "SHA-1",
    new TextEncoder().encode(password),
  );
  const hashHex = Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
  const prefix = hashHex.slice(0, 5);
  const suffix = hashHex.slice(5);

  const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
  if (!res.ok) throw new Error(`HIBP request failed: ${res.status}`);
  const body = await res.text();

  for (const line of body.split("\n")) {
    const [lineSuffix, count] = line.split(":");
    if (lineSuffix.trim() === suffix) {
      return parseInt(count, 10) || 0;
    }
  }
  return 0;
}

// ---------------------------------------------------------------------------
// Form
// ---------------------------------------------------------------------------

export function UpdatePasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  // Memoized so the effects below don't re-run on every render.
  const supabase = useMemo(() => createClient(), []);

  // Recovery token forwarded (unconsumed) from /auth/confirm. We verify it only
  // when the user saves, so merely opening this page never burns the token.
  const searchParams = useSearchParams();
  const tokenHash = searchParams.get("token_hash");

  // Once the token has been exchanged for a session it must never be verified
  // again (it is single-use). A failed updateUser keeps the session alive, so
  // the user can fix the password and retry via the live session — no re-verify
  // of a now-spent token. Mount check below also flips this true if a session
  // already exists (e.g. after a page reload or a re-click of the email link).
  const sessionEstablishedRef = useRef(false);

  const [pwnedStatus, setPwnedStatus] = useState<PwnedStatus>("idle");

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Touched — set true on first keystroke, mirrors Flutter controller.addListener
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmTouched, setConfirmTouched] = useState(false);

  // Submit-time gate for red border on password field, mirrors Flutter _showPasswordFieldValidation
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const passwordValid = isValidPassword(password);
  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword;

  useEffect(() => {
    if (password.length > 0) setPasswordTouched(true);
  }, [password]);

  useEffect(() => {
    if (confirmPassword.length > 0) setConfirmTouched(true);
  }, [confirmPassword]);

  // If a session already exists when the page loads (the token was exchanged on
  // a prior attempt, or a reload), skip re-verifying — we'll update via that
  // live session instead of a spent token.
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) sessionEstablishedRef.current = true;
    });
  }, [supabase]);

  // Realtime breach check, debounced ~500ms. Only runs once the password meets
  // the basic requirements — a short/invalid one is already flagged elsewhere.
  useEffect(() => {
    if (!isValidPassword(password)) {
      setPwnedStatus("idle");
      return;
    }

    let cancelled = false;
    setPwnedStatus("checking");
    const handle = setTimeout(async () => {
      try {
        const count = await countPwnedOccurrences(password);
        if (!cancelled) setPwnedStatus(count > 0 ? "pwned" : "safe");
      } catch {
        // HIBP unreachable: don't block the user — Supabase still enforces its
        // own leaked-password check on save as a backstop.
        if (!cancelled) setPwnedStatus("error");
      }
    }, 500);

    return () => {
      cancelled = true;
      clearTimeout(handle);
    };
  }, [password]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitAttempted(true);
    setError(null);

    if (!passwordValid) {
      setError("Please fix the password requirements before continuing.");
      return;
    }

    if (!passwordsMatch) {
      setError("Passwords do not match.");
      return;
    }

    // Catch the "easy to guess" case before spending the token — mirrors
    // Supabase's leaked-password protection, so this never fails server-side
    // after the link has already been consumed.
    if (pwnedStatus === "pwned") {
      setError(
        "This password has appeared in known data breaches. Please choose a different one.",
      );
      return;
    }
    if (pwnedStatus === "checking") {
      setError("Still checking this password — one moment, then try again.");
      return;
    }

    setIsLoading(true);

    try {
      // Exchange the recovery token for a session exactly once. If a later step
      // fails (e.g. the server rejects the password because it matches the old
      // one), the session stays valid, so a retry skips this block and updates
      // via the live session — the spent, single-use token is never re-verified.
      if (tokenHash && !sessionEstablishedRef.current) {
        const { error: otpError } = await supabase.auth.verifyOtp({
          type: "recovery",
          token_hash: tokenHash,
        });
        if (otpError) throw otpError;
        sessionEstablishedRef.current = true;
      }

      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      // Only after a genuine success do we finalise and drop the session.
      setSuccess(true);
      await supabase.auth.signOut();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  // Base requirement feedback, then overlay the realtime breach status once the
  // password already satisfies the requirements.
  const requirementFeedback = passwordFeedbackFor(password, passwordTouched);
  const passwordFeedback: Feedback =
    passwordTouched && isValidPassword(password)
      ? pwnedStatus === "checking"
        ? { lines: ["Checking if this password is safe…"], variant: "neutral" }
        : pwnedStatus === "pwned"
          ? {
              lines: [
                "This password has appeared in data breaches. Please choose another.",
              ],
              variant: "invalid",
            }
          : pwnedStatus === "safe"
            ? { lines: ["Password strength looks good."], variant: "valid" }
            : requirementFeedback // "idle"/"error" → keep requirement feedback
      : requirementFeedback;

  const confirmFeedback = confirmFeedbackFor(
    password,
    confirmPassword,
    confirmTouched,
  );

  if (success) {
    return (
      <div className="flex flex-col items-center text-center gap-3 p-4">
        <h1 className="text-2xl font-bold">Password updated</h1>
        <p className="text-muted-foreground text-sm max-w-xs">
          Thank you — your password has been reset. You can now log in to the
          app with your new password.
        </p>
      </div>
    );
  }

  return (
    <form
      className={cn("flex flex-col gap-3", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <FieldGroup className="gap-3">
        {error && (
          <div className="text-sm text-red-500 text-center mb-1">{error}</div>
        )}

        <div className="flex flex-col items-center gap-1.5 text-center">
          <h1 className="text-2xl font-bold">Reset your password</h1>
          <p className="text-sm text-muted-foreground text-balance mb-3.5">
            Choose a new password to secure your account.
          </p>
        </div>

        {/* New Password */}
        <Field className="gap-1">
          <FieldLabel htmlFor="password">New Password</FieldLabel>

          <div className="relative">
            <Input
              id="password"
              type={passwordVisible ? "text" : "password"}
              placeholder="Create a strong password"
              className={cn(
                "pr-10 transition-colors",
                passwordTouched &&
                  passwordValid &&
                  pwnedStatus === "safe" &&
                  "border-green-600",
                // Red border after a submit attempt on an invalid password, or
                // anytime the realtime breach check flags it.
                ((submitAttempted && !passwordValid) ||
                  pwnedStatus === "pwned") &&
                  "border-red-500",
              )}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="button"
              variant="ghost"
              tabIndex={-1}
              size="icon"
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent text-muted-foreground"
            >
              {passwordVisible ? <EyeOffIcon /> : <EyeIcon />}
            </Button>
          </div>

          {/* Multi-line bullet feedback, mirrors forSignUpPassword bullet list */}
          <div
            className={cn(
              "text-sm mt-0.5 mb-2 min-h-5",
              variantClass[passwordFeedback.variant],
            )}
          >
            {passwordFeedback.lines.map((line, i) => (
              <p key={i} className="leading-snug">
                {line}
              </p>
            ))}
          </div>
        </Field>

        {/* Confirm Password */}
        <Field className="gap-1">
          <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>

          <div className="relative">
            <Input
              id="confirmPassword"
              type={confirmVisible ? "text" : "password"}
              placeholder="Type it again to confirm"
              className={cn(
                "pr-10 transition-colors",
                confirmFeedback.variant === "valid" && "border-green-600",
                confirmFeedback.variant === "invalid" && "border-red-500",
              )}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button
              type="button"
              variant="ghost"
              tabIndex={-1}
              size="icon"
              onClick={() => setConfirmVisible(!confirmVisible)}
              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent text-muted-foreground"
            >
              {confirmVisible ? <EyeOffIcon /> : <EyeIcon />}
            </Button>
          </div>

          <div
            className={cn(
              "text-sm mt-0.5 mb-4 min-h-5",
              variantClass[confirmFeedback.variant],
            )}
          >
            {confirmFeedback.lines.map((line, i) => (
              <p key={i} className="leading-snug">
                {line}
              </p>
            ))}
          </div>
        </Field>

        <Field>
          <Button
            type="submit"
            className="w-full"
            disabled={
              isLoading ||
              !password ||
              !confirmPassword ||
              pwnedStatus === "checking" ||
              pwnedStatus === "pwned"
            }
          >
            {isLoading ? "Saving..." : "Save new password"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
