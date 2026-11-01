"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Eye,
  EyeOff,
  UserRound,
  Mail,
  Lock,
  ShieldCheck,
  Check,
  Sparkles,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

const signupSchema = z.object({
  username: z
    .string()
    .min(3, "At least 3 characters required")
    .max(20, "Maximum 20 characters allowed")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Only letters, numbers and underscores allowed"
    ),

  email: z.string().min(1, "Email is required").email("Enter a valid email"),

  password: z
    .string()
    .min(8, "At least 8 characters required")
    .max(64, "Maximum 64 characters allowed")
    .regex(/[A-Z]/, "Add an uppercase letter")
    .regex(/[a-z]/, "Add a lowercase letter")
    .regex(/[0-9]/, "Add a number")
    .regex(/[^A-Za-z0-9]/, "Add a special character"),

  terms: z.boolean().refine((value) => value, {
    message: "Please accept the terms and conditions",
  }),
});

type SignupFormData = z.infer<typeof signupSchema>;

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

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onTouched",
    defaultValues: {
      username: "",
      email: "",
      password: "",
      terms: false,
    },
  });

  const termsAccepted = watch("terms");

  const passwordRules = [
    { label: "8+ characters", valid: passwordValue.length >= 8 },
    { label: "Uppercase", valid: /[A-Z]/.test(passwordValue) },
    { label: "Lowercase", valid: /[a-z]/.test(passwordValue) },
    { label: "Number", valid: /[0-9]/.test(passwordValue) },
    { label: "Special character", valid: /[^A-Za-z0-9]/.test(passwordValue) },
  ];

  const strength = passwordRules.filter((rule) => rule.valid).length;

  const onSubmit = async (data: SignupFormData) => {
    try {
      setLoading(true);

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Registration failed");
      }

      window.location.href = "/verify-email";
    } catch (error) {
      alert(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const fieldClass =
    "h-11 rounded-lg border-[#e5e5e0] bg-white px-3 text-sm text-[#20211f] placeholder:text-[#aaa9a2] shadow-none focus-visible:ring-2 focus-visible:ring-[#557b54]/20 focus-visible:border-[#557b54]";

  return (
    <main className="min-h-svh w-full grid lg:grid-cols-2 bg-white">
      {/* LEFT PANEL */}
      <section className="relative hidden lg:flex min-h-svh flex-col justify-between overflow-hidden bg-[#243d2a] p-12 xl:p-16 text-white">
        <div className="absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full border border-white/10" />
        <div className="absolute -right-20 -top-20 h-[370px] w-[370px] rounded-full border border-white/10" />
        <div className="absolute -bottom-48 -left-32 h-[500px] w-[500px] rounded-full bg-[#557b54]/20 blur-3xl" />

        {/* Brand */}
        <Link href="/" className="relative z-10 flex items-center gap-3 w-fit">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#243d2a]">
            <Sparkles size={22} />
          </div>
          <span className="text-2xl font-bold tracking-tight">atelier</span>
        </Link>

        {/* Main content */}
        <div className="relative z-10 max-w-xl">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs text-white/80">
            <span className="h-2 w-2 rounded-full bg-emerald-300" />
            A better way to get started
          </div>

          <h1 className="text-5xl xl:text-6xl font-semibold leading-[1.12] tracking-tight">
            Build your
            <br />
            future with
            <br />
            <span className="text-[#a8c9a0]">confidence.</span>
          </h1>

          <p className="mt-8 max-w-md text-base leading-8 text-white/60">
            Create your account and become part of a secure, seamless experience
            designed around you.
          </p>

          <div className="mt-12 space-y-5">
            {[
              "Simple and secure registration",
              "Your personal information stays protected",
              "Access your account anywhere",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10">
                  <Check size={15} className="text-[#a8c9a0]" />
                </div>
                <span className="text-sm text-white/80">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10 flex items-center justify-between text-xs text-white/40">
          <span>© 2026 Atelier. All rights reserved.</span>
          <span className="flex items-center gap-2">
            <ShieldCheck size={14} />
            Secure authentication
          </span>
        </div>
      </section>

      {/* RIGHT PANEL */}
      <section className="flex min-h-svh items-center justify-center bg-[#fafaf8] px-5 py-8 sm:px-10 lg:px-12 xl:px-20">
        <div className="w-full max-w-[440px]">
          {/* Mobile brand */}
          <Link href="/" className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#243d2a] text-white">
              <Sparkles size={18} />
            </div>
            <span className="text-xl font-bold text-[#243d2a]">atelier</span>
          </Link>

          {/* Heading */}
          <div className="mb-7">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#557b54]">
              Create your account
            </p>

            <h2 className="text-3xl font-bold tracking-tight text-[#20211f] sm:text-4xl">
              Welcome aboard.
            </h2>

            <p className="mt-3 text-sm text-[#85867e]">
              Fill in your details to create your account.
            </p>
          </div>

          {/* Google */}
          <Button
            type="button"
            variant="outline"
            className="h-11 w-full rounded-lg border-[#e5e5e0] bg-white text-sm font-semibold text-[#33342f] hover:bg-[#f5f5f0]"
            onClick={() => {
              window.location.href = "/api/auth/google";
            }}
          >
            <GoogleIcon />
            <span className="ml-2">Continue with Google</span>
          </Button>

          {/* Divider */}
          <div className="relative my-6">
            <Separator className="bg-[#eaeae5]" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#fafaf8] px-4 text-[10px] font-semibold uppercase tracking-widest text-[#aaa9a2]">
              Or register with email
            </span>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Username */}
            <div className="space-y-1.5">
              <label
                htmlFor="username"
                className="text-xs font-semibold text-[#44463f]"
              >
                Username
              </label>

              <div className="relative">
                <UserRound
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a4a59c]"
                />
                <Input
                  id="username"
                  placeholder="Choose a username"
                  autoComplete="username"
                  {...register("username")}
                  className={`${fieldClass} pl-10`}
                />
              </div>

              {errors.username && (
                <p className="text-xs text-red-500">
                  {errors.username.message}
                </p>
              )}
            </div>

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
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="text-xs font-semibold text-[#44463f]"
              >
                Password
              </label>

              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a4a59c]"
                />

                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  autoComplete="new-password"
                  {...register("password", {
                    onChange: (e) => setPasswordValue(e.target.value),
                  })}
                  className={`${fieldClass} pl-10 pr-11`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a4a59c] hover:text-[#557b54]"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {errors.password && (
                <p className="text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}

              {/* Password strength */}
              {passwordValue.length > 0 && (
                <div className="space-y-2 pt-1">
                  <div className="flex gap-1">
                    {passwordRules.map((rule) => (
                      <div
                        key={rule.label}
                        className={`h-1 flex-1 rounded-full ${
                          rule.valid
                            ? strength <= 2
                              ? "bg-red-400"
                              : strength <= 3
                                ? "bg-amber-400"
                                : "bg-[#557b54]"
                            : "bg-[#eaeae5]"
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-x-3 gap-y-1">
                    {passwordRules.map((rule) => (
                      <span
                        key={rule.label}
                        className={`flex items-center gap-1 text-[10px] ${
                          rule.valid ? "text-[#557b54]" : "text-[#aaa9a2]"
                        }`}
                      >
                        <Check size={10} />
                        {rule.label}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Terms */}
            <div className="space-y-1">
              <div className="flex items-start gap-2">
                <Checkbox
                  id="terms"
                  checked={!!termsAccepted}
                  onCheckedChange={(checked) =>
                    setValue("terms", checked === true, {
                      shouldValidate: true,
                    })
                  }
                  className="mt-0.5 border-[#d8d9d0] data-[state=checked]:bg-[#557b54] data-[state=checked]:border-[#557b54]"
                />

                <label
                  htmlFor="terms"
                  className="cursor-pointer text-xs leading-5 text-[#85867e]"
                >
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="font-semibold text-[#557b54] hover:underline"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="font-semibold text-[#557b54] hover:underline"
                  >
                    Privacy Policy
                  </Link>
                  .
                </label>
              </div>

              {errors.terms && (
                <p className="text-xs text-red-500">{errors.terms.message}</p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="group h-11 w-full rounded-lg bg-[#243d2a] text-sm font-semibold text-white hover:bg-[#34563a]"
            >
              {loading ? (
                "Creating account..."
              ) : (
                <>
                  Create account
                  <ArrowRight
                    size={16}
                    className="ml-2 transition-transform group-hover:translate-x-1"
                  />
                </>
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-[#85867e]">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-bold text-[#557b54] hover:underline"
              >
                Sign in
              </Link>
            </p>

            <Link
              href="/forgot-password"
              className="mt-3 inline-block text-xs text-[#a4a59c] hover:text-[#557b54]"
            >
              Forgot your password?
            </Link>
          </div>

          <div className="mt-8 flex justify-center gap-2 text-[11px] text-[#a4a59c]">
            <ShieldCheck size={14} />
            Secure and encrypted authentication
          </div>
        </div>
      </section>
    </main>
  );
}