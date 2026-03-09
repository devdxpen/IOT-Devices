"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft } from "lucide-react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

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

const forgotPasswordSchema = z.object({
  contactNumber: z.string().min(10, "Valid contact number is required"),
});

export function ForgotPasswordForm() {
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      contactNumber: "",
    },
  });

  const router = useRouter();

  function onSubmit(data: z.infer<typeof forgotPasswordSchema>) {
    console.log("Request OTP for:", data);
    router.push("/verify-otp");
  }

  function onError() {
    router.push("/verify-otp");
  }

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold text-slate-600 mb-8">
        Forgot Password
      </h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-6">
          <FormField
            control={form.control}
            name="contactNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-600">Contact Number <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <PhoneInput
                    international
                    defaultCountry="IN"
                    placeholder="+91 | Enter"
                    className="flex w-full gap-2 rounded-md [&_.PhoneInputCountry]:flex [&_.PhoneInputCountry]:h-10 [&_.PhoneInputCountry]:items-center [&_.PhoneInputCountry]:justify-center [&_.PhoneInputCountry]:rounded-md [&_.PhoneInputCountry]:border [&_.PhoneInputCountry]:border-slate-200 [&_.PhoneInputCountry]:bg-slate-50 [&_.PhoneInputCountry]:px-3 [&_.PhoneInputInput]:flex [&_.PhoneInputInput]:h-10 [&_.PhoneInputInput]:w-full [&_.PhoneInputInput]:rounded-md [&_.PhoneInputInput]:border [&_.PhoneInputInput]:border-slate-200 [&_.PhoneInputInput]:bg-slate-50 [&_.PhoneInputInput]:px-3 [&_.PhoneInputInput]:text-sm [&_.PhoneInputInput]:focus-visible:outline-none [&_.PhoneInputCountrySelectArrow]:ml-2 [&_.PhoneInputCountrySelectArrow]:opacity-50 [&_.PhoneInputCountrySelectArrow]:border-b-2 [&_.PhoneInputCountrySelectArrow]:border-r-2 [&_.PhoneInputCountrySelectArrow]:border-slate-500 [&_.PhoneInputCountrySelectArrow]:w-1.5 [&_.PhoneInputCountrySelectArrow]:h-1.5 [&_.PhoneInputCountrySelectArrow]:transform [&_.PhoneInputCountrySelectArrow]:rotate-45"
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full bg-[#1DA1F2] hover:bg-[#1A91DA] text-white">
            Send OTP
          </Button>
        </form>
      </Form>

      <div className="mt-8 text-center text-sm">
        <Link href="/login" className="font-medium text-slate-600 hover:text-slate-900 flex items-center justify-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Login
        </Link>
      </div>
    </div>
  );
}
