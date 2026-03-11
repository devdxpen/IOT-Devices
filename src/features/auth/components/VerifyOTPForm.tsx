"use client";

import { useState, useRef, KeyboardEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const otpSchema = z.object({
  otp: z.string().length(4, "OTP must be exactly 4 digits"),
});

export function VerifyOTPForm() {
  const [otpValues, setOtpValues] = useState<string[]>(["", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const form = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const router = useRouter();

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;

    const newOtpValues = [...otpValues];
    // Keep only the last typed character
    newOtpValues[index] = value.length > 1 ? value.slice(-1) : value;
    setOtpValues(newOtpValues);

    // Update form value
    form.setValue("otp", newOtpValues.join(""), { shouldValidate: true });

    // Focus next input automatically
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    // Focus previous input on backspace if current is empty
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  function onSubmit(data: z.infer<typeof otpSchema>) {
    console.log("OTP Verification:", data);
    router.push("/");
  }

  function onError() {
    router.push("/");
  }

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold text-slate-600 mb-2">Enter OTP</h2>
      <p className="text-sm text-slate-500 mb-8">
        We have sent code to{" "}
        <span className="font-medium text-slate-800">+91-9870654321</span>
      </p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, onError)}
          className="space-y-12"
        >
          <FormField
            control={form.control}
            name="otp"
            render={() => (
              <FormItem>
                <FormControl>
                  <div className="flex justify-start gap-4 mb-4">
                    {otpValues.map((value, index) => (
                      <Input
                        key={index}
                        ref={(el) => {
                          inputRefs.current[index] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        value={value}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className={`w-16 h-16 text-center text-2xl font-semibold rounded-md ${
                          form.formState.errors.otp
                            ? "border-red-500"
                            : value
                              ? "border-[#1DA1F2] outline-none ring-1 ring-[#1DA1F2]"
                              : "border-slate-200 bg-slate-50"
                        }`}
                        maxLength={1}
                        autoFocus={index === 0}
                      />
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-[#1DA1F2] hover:bg-[#1A91DA] text-white py-6 text-base"
          >
            Enter OTP
          </Button>
        </form>
      </Form>

      <div className="mt-8 text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-[#1DA1F2] hover:underline inline-flex items-center justify-center gap-1"
        >
          Login <span className="text-lg leading-none mb-[2px]">↗</span>
        </Link>
      </div>
    </div>
  );
}
