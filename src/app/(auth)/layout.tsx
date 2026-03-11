import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left side - Image/Branding (Hidden on smaller screens) */}
      <div className="hidden lg:flex flex-col justify-between bg-blue-50 p-12 relative overflow-hidden">
        <div className="relative z-10">
          <Link href="/">
            <Image
              src="/logo.svg"
              alt="LinkedIOT Logo"
              width={200}
              height={40}
              priority
              className="h-10 w-auto"
            />
          </Link>
        </div>
        <div className="relative z-10 mt-auto">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-4">
            Manage your IoT devices
            <br />
            with ease and scale.
          </h1>
          <p className="text-lg text-slate-600 max-w-md">
            The complete platform for monitoring, controlling, and analyzing
            your connected ecosystem.
          </p>
        </div>

        {/* Decorative background pattern */}
        <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(#1DA1F2_1px,transparent_1px)] bg-size-[24px_24px]"></div>
      </div>

      {/* Right side - Form */}
      <div className="flex flex-col justify-center px-8 py-12 sm:px-16 lg:px-24 bg-white relative">
        <div className="lg:hidden mb-8">
          <Link href="/">
            <Image
              src="/logo.svg"
              alt="LinkedIOT Logo"
              width={160}
              height={32}
              priority
              className="h-8 w-auto"
            />
          </Link>
        </div>
        <div className="w-full max-w-md mx-auto">{children}</div>
      </div>
    </div>
  );
}
