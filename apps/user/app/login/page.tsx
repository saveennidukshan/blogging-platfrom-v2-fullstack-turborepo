
"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

// ============================
// Google Icon
// ============================

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-5 w-5">
      <path
        fill="#EA4335"
        d="M24 9.5c3.5 0 6.7 1.2 9.2 3.6l6.8-6.8C35.9 2.4 30.5 0 24 0 14.6 0 6.5 5.4 2.6 13.2l8 6.2C12.4 13.7 17.7 9.5 24 9.5Z"
        transform="translate(0 4)"
      />
      <path
        fill="#4285F4"
        d="M47 24.5c0-1.6-.2-3.1-.4-4.5H24v9h12.9c-.6 3-2.3 5.5-4.7 7.2l7.7 6C44.4 37.9 47 31.7 47 24.5Z"
      />
      <path
        fill="#FBBC05"
        d="M10.5 28.6a14.4 14.4 0 0 1 0-9.2l-8-6.2a24 24 0 0 0 0 21.6l8-6.2Z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.7-6c-2.2 1.5-4.9 2.3-8.2 2.3-6.3 0-11.6-4.2-13.5-9.9l-8 6.2C6.5 42.6 14.6 48 24 48Z"
      />
    </svg>
  );
}

// ============================
// Validation
// ============================

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email address is required")
    .email("Enter a valid email address"),

  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must contain at least 8 characters"),

  rememberMe: z.boolean(),
});

type LoginFormData = z.infer<typeof loginSchema>;

// ============================
// Login Page
// ============================

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const rememberMe = watch("rememberMe");

  // ============================
  // Submit Handler
  // ============================

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          rememberMe: data.rememberMe,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Invalid email or password");
      }

      // Change this according to your application
      window.location.href = "/dashboard";

    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const fieldClass =
    "h-11 rounded-lg border-[#e5e5e0] bg-white px-3 text-sm text-[#20211f] placeholder:text-[#aaa9a2] shadow-none focus-visible:ring-2 focus-visible:ring-[#557b54]/20 focus-visible:border-[#557b54]";

  return (
    <main className="min-h-svh w-full grid lg:grid-cols-2 bg-white">

      {/* =================================
          LEFT PANEL - BRANDING
      ================================= */}

      <section className="relative hidden lg:flex min-h-svh flex-col justify-between overflow-hidden bg-[#243d2a] p-12 xl:p-16 text-white">

        {/* Decorative circles */}

        <div className="absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full border border-white/10" />

        <div className="absolute -right-20 -top-20 h-[370px] w-[370px] rounded-full border border-white/10" />

        <div className="absolute -bottom-48 -left-32 h-[500px] w-[500px] rounded-full bg-[#557b54]/20 blur-3xl" />

        {/* Brand */}

        <Link href="/" className="relative z-10 flex items-center gap-3 w-fit">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#243d2a]">
            <Sparkles size={22} />
          </div>

          <span className="text-2xl font-bold tracking-tight">
            atelier
          </span>

        </Link>

        {/* Main content */}

        <div className="relative z-10 max-w-xl">

          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs text-white/80">

            <span className="h-2 w-2 rounded-full bg-emerald-300" />

            Welcome back to atelier

          </div>

          <h1 className="text-5xl xl:text-6xl font-semibold leading-[1.12] tracking-tight">

            Good to
            <br />

            see you
            <br />

            <span className="text-[#a8c9a0]">
              again.
            </span>

          </h1>

          <p className="mt-8 max-w-md text-base leading-8 text-white/60">
            Sign in to continue where you left off.
            Your workspace is waiting for you.
          </p>

          {/* Features */}

          <div className="mt-12 space-y-5">

            {[
              "Access your personal workspace",
              "Your account stays protected",
              "Seamless experience across devices",
            ].map((item) => (

              <div key={item} className="flex items-center gap-3">

                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10">

                  <CheckCircle2
                    size={15}
                    className="text-[#a8c9a0]"
                  />

                </div>

                <span className="text-sm text-white/80">
                  {item}
                </span>

              </div>

            ))}

          </div>

        </div>

        {/* Footer */}

        <div className="relative z-10 flex items-center justify-between text-xs text-white/40">

          <span>© 2026 Atelier. All rights reserved.</span>

          <span className="flex items-center gap-2">
            <ShieldCheck size={14} />
            Secure authentication
          </span>

        </div>

      </section>

      {/* =================================
          RIGHT PANEL - LOGIN
      ================================= */}

      <section className="flex min-h-svh items-center justify-center bg-[#fafaf8] px-5 py-10 sm:px-10 lg:px-12 xl:px-20">

        <div className="w-full max-w-[440px]">

          {/* Mobile branding */}

          <Link
            href="/"
            className="mb-10 flex items-center gap-2 lg:hidden"
          >

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#243d2a] text-white">
              <Sparkles size={18} />
            </div>

            <span className="text-xl font-bold text-[#243d2a]">
              atelier
            </span>

          </Link>

          {/* Heading */}

          <div className="mb-8">

            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#557b54]">
              Welcome back
            </p>

            <h2 className="text-3xl font-bold tracking-tight text-[#20211f] sm:text-4xl">
              Sign in to your account.
            </h2>

            <p className="mt-3 text-sm text-[#85867e]">
              Enter your credentials to access your account.
            </p>

          </div>

          {/* Google Sign In */}

          <Button
            type="button"
            variant="outline"
            className="h-11 w-full rounded-lg border-[#e5e5e0] bg-white text-sm font-semibold text-[#33342f] hover:bg-[#f5f5f0]"
            onClick={() => {
              window.location.href = "/api/auth/google";
            }}
          >

            <GoogleIcon />

            <span className="ml-2">
              Continue with Google
            </span>

          </Button>

          {/* Divider */}

          <div className="relative my-6">

            <Separator className="bg-[#eaeae5]" />

            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#fafaf8] px-4 text-[10px] font-semibold uppercase tracking-widest text-[#aaa9a2]">
              Or sign in with email
            </span>

          </div>

          {/* Login Form */}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >

            {/* Email */}

            <div className="space-y-1.5">

              <label
                htmlFor="email"
                className="text-xs font-semibold text-[#44463f]"
              >
                Email address
              </label>

              <div className="relative">

                <Mail
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a4a59c]"
                />

                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  autoComplete="email"
                  {...register("email")}
                  className={`${fieldClass} pl-10`}
                />

              </div>

              {errors.email && (
                <p className="text-xs text-red-500">
                  {errors.email.message}
                </p>
              )}

            </div>

            {/* Password */}

            <div className="space-y-1.5">

              <div className="flex items-center justify-between">

                <label
                  htmlFor="password"
                  className="text-xs font-semibold text-[#44463f]"
                >
                  Password
                </label>

                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-[#557b54] hover:underline"
                >
                  Forgot password?
                </Link>

              </div>

              <div className="relative">

                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a4a59c]"
                />

                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  {...register("password")}
                  className={`${fieldClass} pl-10 pr-11`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a4a59c] hover:text-[#557b54]"
                  aria-label="Toggle password visibility"
                >

                  {showPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}

                </button>

              </div>

              {errors.password && (
                <p className="text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}

            </div>

            {/* Remember Me */}

            <div className="flex items-center gap-2">

              <Checkbox
                id="rememberMe"
                checked={!!rememberMe}
                onCheckedChange={(checked) =>
                  setValue("rememberMe", checked === true)
                }
                className="border-[#d8d9d0] data-[state=checked]:bg-[#557b54] data-[state=checked]:border-[#557b54]"
              />

              <label
                htmlFor="rememberMe"
                className="cursor-pointer text-xs text-[#85867e]"
              >
                Remember me
              </label>

            </div>

            {/* Submit */}

            <Button
              type="submit"
              disabled={loading}
              className="group h-11 w-full rounded-lg bg-[#243d2a] text-sm font-semibold text-white hover:bg-[#34563a]"
            >

              {loading ? (
                "Signing in..."
              ) : (
                <>
                  Sign in

                  <ArrowRight
                    size={16}
                    className="ml-2 transition-transform group-hover:translate-x-1"
                  />
                </>
              )}

            </Button>

          </form>

          {/* Signup */}

          <div className="mt-8 border-t border-[#eaeae5] pt-7 text-center">

            <p className="text-sm text-[#85867e]">

              Don't have an account?{" "}

              <Link
                href="/signup"
                className="font-bold text-[#557b54] hover:underline"
              >
                Create account
              </Link>

            </p>

          </div>

          {/* Security */}

          <div className="mt-10 flex justify-center gap-2 text-[11px] text-[#a4a59c]">

            <ShieldCheck size={14} />

            Secure and encrypted authentication

          </div>

        </div>

      </section>

    </main>
  );
}
