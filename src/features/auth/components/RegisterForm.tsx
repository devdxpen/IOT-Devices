"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const individualSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  contactNumber: z.string().min(10, "Invalid contact number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  country: z.string().min(1, "Country is required"),
  state: z.string().min(1, "State is required"),
  terms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms",
  }),
});

const companySchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  contactNumber: z.string().min(10, "Invalid contact number"),
  industryType: z.string().min(1, "Industry type is required"),
  businessAddress: z.string().min(5, "Business address is required").optional(),
  websiteUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  terms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms",
  }),
});

export function RegisterForm() {
  const [tab, setTab] = useState<"individual" | "company">("individual");
  const [showPassword, setShowPassword] = useState(false);

  const individualForm = useForm<z.infer<typeof individualSchema>>({
    resolver: zodResolver(individualSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      contactNumber: "",
      password: "",
      country: "",
      state: "",
      terms: false,
    },
  });

  const companyForm = useForm<z.infer<typeof companySchema>>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      companyName: "",
      contactNumber: "",
      industryType: "",
      businessAddress: "",
      websiteUrl: "",
      email: "",
      password: "",
      terms: false,
    },
  });

  const router = useRouter();

  function onIndividualSubmit(data: z.infer<typeof individualSchema>) {
    console.log("Individual Registration:", data);
    router.push("/verify-otp");
  }

  function onCompanySubmit(data: z.infer<typeof companySchema>) {
    console.log("Company Registration:", data);
    router.push("/verify-otp");
  }

  function onError() {
    router.push("/verify-otp");
  }

  return (
    <div className="w-full">
      <div className="flex bg-white rounded-md border border-slate-200 p-1 mb-8 w-fit shadow-sm">
        <button
          className={`px-6 py-2 rounded-md font-medium text-sm transition-colors ${
            tab === "individual"
              ? "bg-[#1DA1F2] text-white"
              : "text-slate-600 hover:bg-slate-50"
          }`}
          onClick={() => setTab("individual")}
        >
          Individual
        </button>
        <button
          className={`px-6 py-2 rounded-md font-medium text-sm transition-colors ${
            tab === "company"
              ? "bg-[#1DA1F2] text-white"
              : "text-slate-600 hover:bg-slate-50"
          }`}
          onClick={() => setTab("company")}
        >
          For Company
        </button>
      </div>

      <h2 className="text-xl font-semibold text-slate-400 mb-8">
        {tab === "individual"
          ? "Individual User Registration"
          : "Company Registration"}
      </h2>

      {tab === "individual" ? (
        <Form {...individualForm}>
          <form
            onSubmit={individualForm.handleSubmit(onIndividualSubmit, onError)}
            className="space-y-5"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={individualForm.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-600">
                      First Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter first name"
                        {...field}
                        className="bg-slate-50 border-slate-200"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={individualForm.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-600">
                      Last Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter last name"
                        {...field}
                        className="bg-slate-50 border-slate-200"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={individualForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-600">
                    Email Id <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter email id"
                      {...field}
                      className="bg-slate-50 border-slate-200"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={individualForm.control}
                name="contactNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-600">
                      Contact Number <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <PhoneInput
                        international
                        defaultCountry="IN"
                        placeholder="+ 91 | "
                        className="flex w-full gap-2 rounded-md [&_.PhoneInputCountry]:flex [&_.PhoneInputCountry]:h-10 [&_.PhoneInputCountry]:items-center [&_.PhoneInputCountry]:justify-center [&_.PhoneInputCountry]:rounded-md [&_.PhoneInputCountry]:border [&_.PhoneInputCountry]:border-slate-200 [&_.PhoneInputCountry]:bg-slate-50 [&_.PhoneInputCountry]:px-3 [&_.PhoneInputInput]:flex [&_.PhoneInputInput]:h-10 [&_.PhoneInputInput]:w-full [&_.PhoneInputInput]:rounded-md [&_.PhoneInputInput]:border [&_.PhoneInputInput]:border-slate-200 [&_.PhoneInputInput]:bg-slate-50 [&_.PhoneInputInput]:px-3 [&_.PhoneInputInput]:text-sm [&_.PhoneInputInput]:focus-visible:outline-none [&_.PhoneInputCountrySelectArrow]:ml-2 [&_.PhoneInputCountrySelectArrow]:opacity-50 [&_.PhoneInputCountrySelectArrow]:border-b-2 [&_.PhoneInputCountrySelectArrow]:border-r-2 [&_.PhoneInputCountrySelectArrow]:border-slate-500 [&_.PhoneInputCountrySelectArrow]:w-1.5 [&_.PhoneInputCountrySelectArrow]:h-1.5 [&_.PhoneInputCountrySelectArrow]:transform [&_.PhoneInputCountrySelectArrow]:rotate-45"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={individualForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-600">Password</FormLabel>
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={individualForm.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-600">
                      Country <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-slate-50 border-slate-200 text-slate-500">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="in">India</SelectItem>
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={individualForm.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-600">
                      State <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-slate-50 border-slate-200 text-slate-500">
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="gj">Gujarat</SelectItem>
                        <SelectItem value="mh">Maharashtra</SelectItem>
                        <SelectItem value="ka">Karnataka</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={individualForm.control}
              name="terms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md py-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="border-slate-300 rounded-sm mt-1"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm text-slate-700 font-normal">
                      By continuing, you agree to{" "}
                      <Link href="#" className="text-[#1DA1F2] hover:underline">
                        LinkedIOT's User Agreement
                      </Link>
                      , Privacy Policy, and Cookie Policy.
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-[#1DA1F2] hover:bg-[#1A91DA] text-white"
            >
              Register
            </Button>
          </form>
        </Form>
      ) : (
        <Form {...companyForm}>
          <form
            onSubmit={companyForm.handleSubmit(onCompanySubmit, onError)}
            className="space-y-5"
          >
            <FormField
              control={companyForm.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-600">
                    Company Name <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter company name"
                      {...field}
                      className="bg-slate-50 border-slate-200"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={companyForm.control}
                name="contactNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-600">
                      Contact Number <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <PhoneInput
                        international
                        defaultCountry="IN"
                        placeholder="+ 91 | "
                        className="flex w-full gap-2 rounded-md [&_.PhoneInputCountry]:flex [&_.PhoneInputCountry]:h-10 [&_.PhoneInputCountry]:items-center [&_.PhoneInputCountry]:justify-center [&_.PhoneInputCountry]:rounded-md [&_.PhoneInputCountry]:border [&_.PhoneInputCountry]:border-slate-200 [&_.PhoneInputCountry]:bg-slate-50 [&_.PhoneInputCountry]:px-3 [&_.PhoneInputInput]:flex [&_.PhoneInputInput]:h-10 [&_.PhoneInputInput]:w-full [&_.PhoneInputInput]:rounded-md [&_.PhoneInputInput]:border [&_.PhoneInputInput]:border-slate-200 [&_.PhoneInputInput]:bg-slate-50 [&_.PhoneInputInput]:px-3 [&_.PhoneInputInput]:text-sm [&_.PhoneInputInput]:focus-visible:outline-none [&_.PhoneInputCountrySelectArrow]:ml-2 [&_.PhoneInputCountrySelectArrow]:opacity-50 [&_.PhoneInputCountrySelectArrow]:border-b-2 [&_.PhoneInputCountrySelectArrow]:border-r-2 [&_.PhoneInputCountrySelectArrow]:border-slate-500 [&_.PhoneInputCountrySelectArrow]:w-1.5 [&_.PhoneInputCountrySelectArrow]:h-1.5 [&_.PhoneInputCountrySelectArrow]:transform [&_.PhoneInputCountrySelectArrow]:rotate-45"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={companyForm.control}
                name="industryType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-600">
                      Industry Type <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-slate-50 border-slate-200 text-slate-500">
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="it">
                          Information Technology
                        </SelectItem>
                        <SelectItem value="manufacturing">
                          Manufacturing
                        </SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={companyForm.control}
                name="businessAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-600">
                      Business address
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter address"
                        {...field}
                        className="bg-slate-50 border-slate-200"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={companyForm.control}
                name="websiteUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-600">
                      Website URL
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: https://www.linkedloT.com"
                        {...field}
                        className="bg-slate-50 border-slate-200"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={companyForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-600">
                      Email Id <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter email Id"
                        {...field}
                        className="bg-slate-50 border-slate-200"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={companyForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-600">Password</FormLabel>
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
            </div>

            <FormField
              control={companyForm.control}
              name="terms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md py-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="border-slate-300 rounded-sm mt-1"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm text-slate-700 font-normal">
                      By continuing, you agree to{" "}
                      <Link href="#" className="text-[#1DA1F2] hover:underline">
                        LinkedIOT's User Agreement
                      </Link>
                      , Privacy Policy, and Cookie Policy.
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-[#1DA1F2] hover:bg-[#1A91DA] text-white"
            >
              Register
            </Button>
          </form>
        </Form>
      )}

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
