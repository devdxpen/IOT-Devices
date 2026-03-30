import { ArrowRight, ExternalLink, MapPin, QrCode } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { DeviceGroup } from "@/types/group";
import { Device } from "@/types/device";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockDevices } from "@/data/mockDevices";
import { mockGroups } from "@/data/mockGroups";
import { DeviceAccessManagement } from "@/features/device-access/components/DeviceAccessManagement";
import { HomeAnalyticsSection } from "@/features/home/components/home-analytics-section";
import { fetchTemplates } from "@/lib/mock-api/templates";

const appLinks = {
  android: "https://play.google.com/store/apps/details?id=org.thingsboard.app",
  ios: "https://apps.apple.com/us/app/thingsboard-iot/id1507653728",
};

const quickLinks = [
  {
    label: "Device Dashboard",
    description: "Open live telemetry and device metrics.",
    href: "/dashboard/devices",
  },
  {
    label: "Template Management",
    description: "Browse, activate, and maintain templates.",
    href: "/template-management",
  },
  {
    label: "Add Device",
    description: "Create and onboard a new IoT device.",
    href: "/device",
  },
  {
    label: "Groups",
    description: "Organize devices by site and operations.",
    href: "/groups",
  },
];

const onboardingSteps = [
  {
    title: "Initialize Onboarding Process",
    description:
      "Start by navigating to the 'Add Device' section from your dashboard. Choose your preferred onboarding mode—Manual for custom entry or Template-based for rapid setup—to begin registering your new unit.",
  },
  {
    title: "Configure Device Details",
    description:
      "Carefully enter the manufacturer-provided serial number and select your specific model from the dropdown. Configure critical network parameters like MAC address and firmware version to ensure a secure and stable connection.",
  },
  {
    title: "Assign and Map Templates",
    description:
      "Link your device to a predefined template that matches its hardware profile. This step is crucial as it automatically maps physical data points like T1 (Temperature), T2 (Humidity), and T3 (Pressure) to their digital counterparts.",
  },
  {
    title: "Final Validation & Activation",
    description:
      "Observe the live telemetry stream to confirm the device is transmitting accurate data. Once verified, complete the activation process to promote the device to 'Active' status and begin real-time monitoring.",
  },
];

export default async function HomePage() {
  const templates = await fetchTemplates();
  const popularTemplates = templates
    .filter((template) => template.status === "active")
    .slice(0, 3);
  const nearbyTemplates = templates
    .filter((template) => template.source === "local")
    .slice(0, 3)
    .map((template, index) => ({
      ...template,
      proximityScore: Math.max(55, 92 - index * 14),
    }));
    const recent = [...mockDevices].slice(0, 3);

  const androidQr = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(appLinks.android)}`;
  const iosQr = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(appLinks.ios)}`;

  return (
    <Tabs defaultValue="home" className="w-full flex-1 h-full">
      <div className="flex justify-between items-center mb-6">
        <TabsList className="">
          <TabsTrigger value="home">Home</TabsTrigger>
          <TabsTrigger value="access">Device Access Request</TabsTrigger>
          <TabsTrigger value="activity">User Activity Log</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="home" className="mt-0 outline-none">
        <div className="space-y-6">
          <section className="rounded-xl border border-cyan-200 bg-linear-to-r from-cyan-50 via-white to-slate-50 p-6">
            <p className="text-xs font-semibold tracking-[0.12em] uppercase text-cyan-700">
              Home Dashboard
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              IoT Operations Overview
            </h2>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">
              Centralized content inspired by the ThingsBoard home experience.
              Includes popular templates, app onboarding, recently viewed
              devices, and quick actions for daily operations.
            </p>
          </section>

          <section className="grid gap-6 xl:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-semibold text-slate-900">
                  3 Most Popular Templates
                </h3>
                <Link
                  href="/template-management"
                  className="inline-flex items-center gap-1 text-xs font-medium text-cyan-700 hover:text-cyan-800"
                >
                  View all <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="space-y-3">
                {popularTemplates.map((template, index) => (
                  <div
                    key={template.id}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3"
                  >
                    <p className="text-sm font-semibold text-slate-900">
                      {index + 1}. {template.templateName}
                    </p>
                    <p className="mt-1 text-xs text-slate-600">
                      {template.typeOfTemplate} | v{template.version} |{" "}
                      {template.brandName}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <div className="mb-4 flex items-center gap-2">
                <QrCode className="h-4 w-4 text-cyan-700" />
                <h3 className="text-base font-semibold text-slate-900">
                  QR Code For Mobile App Download
                </h3>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <a
                  href={appLinks.android}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg border border-slate-200 bg-slate-50 p-3 transition hover:border-cyan-300"
                >
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Play Store
                  </p>
                  <Image
                    src={androidQr}
                    alt="Android app QR code"
                    width={150}
                    height={150}
                    unoptimized
                    className="h-[150px] w-[150px] rounded-md border border-slate-300 bg-white"
                  />
                </a>
                <a
                  href={appLinks.ios}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg border border-slate-200 bg-slate-50 p-3 transition hover:border-cyan-300"
                >
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    App Store
                  </p>
                  <Image
                    src={iosQr}
                    alt="iOS app QR code"
                    width={150}
                    height={150}
                    unoptimized
                    className="h-[150px] w-[150px] rounded-md border border-slate-300 bg-white"
                  />
                </a>
              </div>
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h3 className="mb-4 text-base font-semibold text-slate-900">
                Last Viewed Devices (Top 3) With Actual Values
              </h3>
              <div className="space-y-3">
                {recent.map((device) => (
                  <div
                    key={device.id}
                    className="rounded-lg border border-slate-200 bg-white px-4 py-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {device.name}
                        </p>
                        <p className="text-xs text-slate-600">
                          {device.category} | {device.location}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-2 py-1 text-[11px] font-semibold ${
                          device.isOnline
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {device.isOnline ? "Online" : "Offline"}
                      </span>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                      <div className="rounded-md bg-cyan-50 p-2 text-cyan-800">
                        T1: {device.data?.t1 ?? 0}
                      </div>
                      <div className="rounded-md bg-amber-50 p-2 text-amber-800">
                        T2: {device.data?.t2 ?? 0}
                      </div>
                      <div className="rounded-md bg-violet-50 p-2 text-violet-800">
                        T3: {device.data?.t3 ?? 0}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h3 className="mb-4 text-base font-semibold text-slate-900">
                Get Started - Add New Device With Steps
              </h3>
              <div className="space-y-5">
                {onboardingSteps.map((step, index) => (
                  <div key={step.title} className="flex items-start gap-4">
                    <span className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-100 text-[11px] font-bold text-cyan-800 shadow-xs">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <div className="text-secondary-500 font-bold mb-3 px-1">{mockDevices.length} Total Devices</div>
                      <p className="text-sm font-bold text-slate-900">
                        {step.title}
                      </p>
                      <p className="mt-1 text-[13px] leading-relaxed text-slate-600">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/device"
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-700"
              >
                Add Device <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h3 className="mb-4 text-base font-semibold text-slate-900">
                Quick Links
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {quickLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group rounded-lg border border-slate-200 bg-slate-50 p-4 transition hover:border-cyan-300 hover:bg-cyan-50"
                  >
                    <p className="text-sm font-semibold text-slate-900">
                      {item.label}
                    </p>
                    <p className="mt-1 text-xs text-slate-600">
                      {item.description}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-cyan-700">
                      Open <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <div className="mb-4 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-cyan-700" />
                <h3 className="text-base font-semibold text-slate-900">
                  Top 3 Nearby Templates (Graphical View)
                </h3>
              </div>
              <div className="space-y-4">
                {nearbyTemplates.map((template) => (
                  <div key={template.id}>
                    <div className="mb-1 flex items-center justify-between text-xs text-slate-600">
                      <span className="font-medium text-slate-800">
                        {template.templateName}
                      </span>
                      <span>{template.proximityScore}% match</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100">
                      <div
                        className="h-2 rounded-full bg-linear-to-r from-cyan-500 to-blue-500"
                        style={{ width: `${template.proximityScore}%` }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      {template.typeOfTemplate} | {template.brandName}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <Suspense
            fallback={
              <div className="h-[400px] animate-pulse bg-slate-100 rounded-xl" />
            }
          >
            <HomeAnalyticsSection />
          </Suspense>
        </div>
      </TabsContent>

      <TabsContent value="access" className="mt-0 outline-none">
        <DeviceAccessManagement />
      </TabsContent>

      <TabsContent value="activity" className="mt-0 outline-none">
        <div className="bg-white rounded-lg border border-slate-200 p-6 min-h-[400px]">
          <h2 className="text-xl font-semibold mb-4 text-slate-800">
            User Activity Logs
          </h2>
          <p className="text-slate-500">
            Track actions performed by users across the system.
          </p>
          {/* Add user activity logs here */}
        </div>
      </TabsContent>
    </Tabs>
  );
}
