"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Mail, ShieldCheck } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const OTP_LENGTH = 6;

export default function VerifyEmailPage() {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(30);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Resend countdown
  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);

    const updatedOtp = [...otp];
    updatedOtp[index] = digit;

    setOtp(updatedOtp);
    setError("");

    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    if (!pasted) return;

    const updatedOtp = Array(OTP_LENGTH).fill("");

    pasted.split("").forEach((digit, index) => {
      updatedOtp[index] = digit;
    });

    setOtp(updatedOtp);
    setError("");

    const nextIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerify = async () => {
    const code = otp.join("");

    if (code.length !== OTP_LENGTH) {
      setError("Please enter all 6 digits.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otp: code }),
      });

      if (!response.ok) {
        throw new Error("Invalid or expired verification code.");
      }

      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Verification failed."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError("");

    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Unable to resend the verification code.");
      }

      setOtp(Array(OTP_LENGTH).fill(""));
      setCountdown(30);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to resend code."
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fafaf8] lg:grid lg:grid-cols-2">
      {/* Left branding panel */}
      <section className="relative hidden min-h-screen overflow-hidden bg-[#243d2a] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full border border-white/10" />
        <div className="absolute -left-24 -top-24 h-[350px] w-[350px] rounded-full border border-white/10" />
        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#557b54]/20 blur-3xl" />

        <Link
          href="/login"
          className="relative z-10 text-2xl font-bold tracking-tight"
        >
          atelier<span className="text-[#a8c9a0]">.</span>
        </Link>

        <div className="relative z-10 max-w-lg">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
            <ShieldCheck className="h-7 w-7 text-[#a8c9a0]" />
          </div>

          <h1 className="text-5xl font-semibold leading-tight tracking-tight">
            One last step
            <br />
            to get started<span className="text-[#a8c9a0]">.</span>
          </h1>

          <p className="mt-6 max-w-md text-base leading-7 text-white/60">
            Verify your email address to keep your account secure and unlock
            your Atelier experience.
          </p>
        </div>

        <p className="relative z-10 text-xs text-white/40">
          © {new Date().getFullYear()} atelier. All rights reserved.
        </p>
      </section>

      {/* Verification panel */}
      <section className="flex min-h-screen flex-col justify-center px-5 py-8 sm:px-10 lg:px-16">
        <div className="mx-auto w-full max-w-[400px]">
          <Link
            href="/login"
            className="mb-10 inline-flex items-center gap-2 text-sm text-[#667366] transition hover:text-[#243d2a]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Link>

          <Link
            href="/login"
            className="mb-8 block text-2xl font-bold tracking-tight text-[#243d2a] lg:hidden"
          >
            atelier<span className="text-[#557b54]">.</span>
          </Link>

          {!success ? (
            <>
              <div className="mb-8">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#eaf0e7] text-[#557b54]">
                  <Mail className="h-6 w-6" />
                </div>

                <h2 className="text-3xl font-semibold tracking-tight text-[#243d2a]">
                  Verify your email
                </h2>

                <p className="mt-3 text-sm leading-6 text-[#81877e]">
                  We&apos;ve sent a 6-digit verification code to your email
                  address. Enter the code below to verify your account.
                </p>
              </div>

              {/* OTP inputs */}
              <div className="mb-6 flex justify-between gap-2">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(element) => {
                      inputRefs.current[index] = element;
                    }}
                    type="text"
                    inputMode="numeric"
                    autoComplete={index === 0 ? "one-time-code" : "off"}
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    aria-label={`Verification digit ${index + 1}`}
                    className="h-12 w-12 rounded-lg border-[#e5e7df] bg-white p-0 text-center text-lg font-semibold text-[#243d2a] focus-visible:ring-[#557b54] sm:h-14 sm:w-14"
                  />
                ))}
              </div>

              {error && (
                <p className="mb-4 text-sm text-destructive">{error}</p>
              )}

              <Button
                onClick={handleVerify}
                disabled={loading || otp.join("").length !== OTP_LENGTH}
                className="h-11 w-full bg-[#243d2a] text-sm font-medium text-white hover:bg-[#345239]"
              >
                {loading ? (
                  "Verifying..."
                ) : (
                  <>
                    Verify email
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>

              <div className="mt-7 text-center">
                <p className="text-sm text-[#81877e]">
                  Did not receive the code?
                </p>

                <button
                  type="button"
                  onClick={handleResend}
                  disabled={countdown > 0 || resending}
                  className="mt-2 text-sm font-semibold text-[#557b54] transition hover:underline disabled:cursor-not-allowed disabled:text-[#a5aaa0] disabled:no-underline"
                >
                  {resending
                    ? "Sending..."
                    : countdown > 0
                      ? `Resend code in ${countdown}s`
                      : "Resend verification code"}
                </button>
              </div>
            </>
          ) : (
            <div className="text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#eaf0e7] text-[#557b54]">
                <ShieldCheck className="h-7 w-7" />
              </div>

              <h2 className="text-2xl font-semibold text-[#243d2a]">
                Email verified!
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#81877e]">
                Your email address has been successfully verified. You can now
                continue to your account.
              </p>

              <Button
                className="mt-7 h-11 w-full bg-[#243d2a] hover:bg-[#345239]"
              >
                <Link href="/login">
                  Continue to login
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}