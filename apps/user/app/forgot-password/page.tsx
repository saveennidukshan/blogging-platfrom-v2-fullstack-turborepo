"use client";

import { useState } from "react";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Mail,
  ShieldCheck,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const schema = z.object({
  email: z.string().trim().email("Please enter a valid email address."),
});

type FormValues = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Unable to process your request. Please try again.");
      }

      setSubmitted(true);
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

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
            A fresh start
            <br />
            begins here<span className="text-[#a8c9a0]">.</span>
          </h1>

          <p className="mt-6 max-w-md text-base leading-7 text-white/60">
            Forgot your password? No worries. We&apos;ll help you get back into
            your account securely.
          </p>
        </div>

        <p className="relative z-10 text-xs text-white/40">
          © {new Date().getFullYear()} atelier. All rights reserved.
        </p>
      </section>

      {/* Right form panel */}
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

          {!submitted ? (
            <>
              <div className="mb-7">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#eaf0e7] text-[#557b54]">
                  <Mail className="h-6 w-6" />
                </div>

                <h2 className="text-3xl font-semibold tracking-tight text-[#243d2a]">
                  Forgot password?
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#81877e]">
                  Enter the email address associated with your account. We&apos;ll
                  send you a link to reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-[#39483a]"
                  >
                    Email address
                  </label>

                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    aria-invalid={!!errors.email}
                    className="h-11 border-[#e5e7df] bg-white text-sm focus-visible:ring-[#557b54]"
                    {...register("email")}
                  />

                  {errors.email && (
                    <p className="text-sm text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="h-11 w-full bg-[#243d2a] text-sm font-medium text-white hover:bg-[#345239]"
                >
                  {loading ? (
                    "Sending..."
                  ) : (
                    <>
                      Send reset link
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#eaf0e7] text-[#557b54]">
                <CheckCircle2 className="h-7 w-7" />
              </div>

              <h2 className="text-2xl font-semibold text-[#243d2a]">
                Check your email
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#81877e]">
                If an account exists with that email address, you will receive
                a password reset link shortly.
              </p>

              <Button
                
                className="mt-7 h-11 w-full bg-[#243d2a] hover:bg-[#345239]"
              >
                <Link href="/login">
                  Back to login
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}

          <p className="mt-8 text-center text-xs text-[#9a9d95]">
            Remember your password?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#557b54] hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}