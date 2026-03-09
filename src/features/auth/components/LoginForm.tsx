"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff } from "lucide-react";

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

const loginSchema = z.object({
  email: z.string().min(1, { message: "Email or mobile number is required" }),
  password: z.string().optional(),
  rememberMe: z.boolean().default(false).optional(),
});

type LogInValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"password" | "otp">("password");

  const form = useForm<LogInValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const router = useRouter();

  function onSubmit(data: LogInValues) {
    console.log("Login data:", data);
    if (loginMethod === "otp") {
      router.push("/verify-otp");
    } else {
      router.push("/");
    }
  }

  function onError() {
    if (loginMethod === "otp") {
      router.push("/verify-otp");
    } else {
      router.push("/");
    }
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold text-slate-600 mb-8">
        Login into LinkedIOT Portal
      </h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-600">Email / Mobile Number <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter email or mobile number"
                    {...field}
                    className={form.formState.errors.email ? "bg-white border-red-500 focus-visible:ring-red-500" : "bg-slate-50 border-slate-200"}
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
                  <FormLabel className="text-slate-600">Password <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="***********"
                        className="bg-slate-50 border-slate-200 pr-10"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
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
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
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
              <div></div>
            )}
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-[#1DA1F2] hover:underline flex items-center gap-1"
            >
              Forgot Password? <span className="text-lg leading-none mb-[2px]">↗</span>
            </Link>
          </div>

          <Button type="submit" className="w-full bg-[#1DA1F2] hover:bg-[#1A91DA] text-white">
            {loginMethod === "password" ? "Log In" : "Send OTP"}
          </Button>

          <div className="text-center mt-4">
             <button
              type="button"
              onClick={() => setLoginMethod(loginMethod === "password" ? "otp" : "password")}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              {loginMethod === "password" ? "Login with OTP instead" : "Login with Password instead"}
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

          <Button type="button" variant="outline" className="w-full bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 font-normal">
            {/* SVG implementation of Google G logo for maximum fidelity */}
            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
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
        Don't have an account?{" "}
        <Link href="/register" className="font-medium text-[#1DA1F2] hover:underline inline-flex items-center justify-center gap-1">
          Register <span className="text-lg leading-none mb-[2px]">↗</span>
        </Link>
      </div>
    </div>
  );
}
