import { AdminPortal } from "@/features/admin/admin-portal";

interface AdminPageProps {
  params: Promise<{
    section?: string[];
  }>;
}

export default async function AdminPage({ params }: AdminPageProps) {
  const resolvedParams = await params;
  const primarySection = resolvedParams.section?.[0] ?? "home";
  const dashboardSection = resolvedParams.section?.[1] ?? "device-analytics";

  return (
    <AdminPortal
      primarySection={primarySection}
      dashboardSection={dashboardSection}
    />
  );
}
