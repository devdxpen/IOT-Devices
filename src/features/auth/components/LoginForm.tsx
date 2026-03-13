"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  getDemoAccounts,
  loginDemoAccount,
  saveDemoSession,
} from "@/lib/auth/demo-auth";
import type { UserRole } from "@/types/access-control";

const loginSchema = z.object({
  email: z.string().min(1, { message: "Login ID or email is required" }),
  password: z.string().optional(),
  rememberMe: z.boolean().default(false).optional(),
});

type LogInValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"password" | "otp">(
    "password",
  );

  const form = useForm<LogInValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const router = useRouter();
  const demoAccounts = useMemo(() => getDemoAccounts(), []);
  const groupedDemoAccounts = useMemo(() => {
    const grouped = new Map<UserRole, typeof demoAccounts>();
    for (const account of demoAccounts) {
      const roleAccounts = grouped.get(account.role) ?? [];
      roleAccounts.push(account);
      grouped.set(account.role, roleAccounts);
    }
    return grouped;
  }, [demoAccounts]);

  async function onSubmit(data: LogInValues) {
    if (loginMethod === "otp") {
      router.push("/verify-otp");
      return;
    }

    const password = data.password?.trim() ?? "";
    if (!password) {
      form.setError("password", { message: "Password is required" });
      return;
    }

    const session = await loginDemoAccount(data.email, password);
    if (!session) {
      form.setError("email", { message: "Invalid login ID or password" });
      form.setError("password", { message: "Invalid login ID or password" });
      return;
    }

    saveDemoSession(session);
    router.push(session.redirectPath);
  }

  return (
    <div className="w-full">
      <h2 className="mb-8 text-2xl font-semibold text-slate-600">
        Login into LinkedIOT Portal
      </h2>

      <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4 text-xs text-slate-700">
        <p className="mb-2 font-semibold text-blue-700">Demo Credentials</p>
        <div className="space-y-3">
          {(["admin", "company", "iot_user"] as UserRole[]).map((role) => {
            const accounts = groupedDemoAccounts.get(role) ?? [];
            if (!accounts.length) {
              return null;
            }
            return (
              <div key={role} className="space-y-1">
                <p className="font-semibold text-slate-800">
                  {role === "admin"
                    ? "Admin"
                    : role === "company"
                      ? "Company"
                      : "IoT User"}
                </p>
                {accounts.map((account) => (
                  <p key={`${role}-${account.loginId}`}>
                    <span className="font-semibold">{account.loginId}</span> /{" "}
                    <span className="font-semibold">{account.password}</span> (
                    {account.displayName})
                  </p>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-600">
                  Login ID / Email <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter login ID (admin/company/iot user)"
                    {...field}
                    className={
                      form.formState.errors.email
                        ? "border-red-500 bg-white focus-visible:ring-red-500"
                        : "border-slate-200 bg-slate-50"
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {loginMethod === "password" && (
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-600">
                    Password <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="border-slate-200 bg-slate-50 pr-10"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <div className="flex items-center justify-between">
            {loginMethod === "password" ? (
              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-y-0 space-x-3">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal text-slate-600">
                      Remember me
                    </FormLabel>
                  </FormItem>
                )}
              />
            ) : (
              <div />
            )}
            <Link
              href="/forgot-password"
              className="flex items-center gap-1 text-sm font-medium text-[#1DA1F2] hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="w-full bg-[#1DA1F2] text-white hover:bg-[#1A91DA]"
          >
            {loginMethod === "password"
              ? form.formState.isSubmitting
                ? "Logging In..."
                : "Log In"
              : "Send OTP"}
          </Button>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() =>
                setLoginMethod(loginMethod === "password" ? "otp" : "password")
              }
              className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
            >
              {loginMethod === "password"
                ? "Login with OTP instead"
                : "Login with Password instead"}
            </button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs font-medium uppercase">
              <span className="bg-white px-2 text-[#1DA1F2]">OR</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full border-slate-200 bg-slate-50 font-normal text-slate-700 hover:bg-slate-100"
          >
            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
              <title>Google</title>
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
              <path d="M1 1h22v22H1z" fill="none" />
            </svg>
            Sign with Google
          </Button>
        </form>
      </Form>

      <div className="mt-16 text-center text-sm text-slate-600">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="inline-flex items-center justify-center gap-1 font-medium text-[#1DA1F2] hover:underline"
        >
          Register
        </Link>
      </div>
    </div>
  );
}
