import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminHomeDashboard } from "@/features/admin/admin-home-dashboard";
import { AdminSupportTickets } from "@/features/admin/admin-support-tickets";
import { CompanyAnalyticsDashboard } from "@/features/admin/dashboards/company-analytics-dashboard";
import { DeviceAnalyticsDashboard } from "@/features/admin/dashboards/device-analytics-dashboard";
import { UserAnalyticsDashboard } from "@/features/admin/dashboards/user-analytics-dashboard";

const dashboardSectionTitles: Record<string, string> = {
  "device-analytics": "Device Analytics",
  "user-analytics": "User Analytics",
  "company-analytics": "Company Analytics",
  "template-analytics": "Template Analytics",
  "support-ticket-analytics": "Support Ticket Analytics",
  "knowledge-base-analytics": "Knowledge Base Analytics",
  "notification-usage-analytics": "Notification Usage Analytics",
  "financial-analytics": "Financial Analytics",
  "alarms-alerts": "Alarms & Alerts",
  coupons: "Coupons",
};

const primaryTitles: Record<string, string> = {
  home: "Home",
  monitoring: "Monitoring",
  system: "System",
  template: "Template",
  help: "Help",
  configuration: "Configuration",
  subscription: "Subscription",
  financial: "Financial",
  settings: "Settings",
  reports: "Reports",
};

interface AdminPortalProps {
  primarySection: string;
  dashboardSection: string;
}

function PlaceholderPanel({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader className="border-b border-slate-200">
        <CardTitle className="text-2xl text-slate-900">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-8 text-slate-600">{description}</CardContent>
    </Card>
  );
}

export function AdminPortal({
  primarySection,
  dashboardSection,
}: AdminPortalProps) {
  if (primarySection === "home") {
    return <AdminHomeDashboard />;
  }

  if (primarySection === "dashboard") {
    const resolvedSection = dashboardSectionTitles[dashboardSection]
      ? dashboardSection
      : "device-analytics";

    if (resolvedSection === "company-analytics") {
      return <CompanyAnalyticsDashboard />;
    }

    if (resolvedSection === "user-analytics") {
      return <UserAnalyticsDashboard />;
    }

    if (resolvedSection === "device-analytics") {
      return <DeviceAnalyticsDashboard />;
    }

    return (
      <PlaceholderPanel
        title={dashboardSectionTitles[resolvedSection]}
        description="This dashboard section is ready. Share exact content and we will build this screen with the same detailed UI, charts, and tables."
      />
    );
  }

  if (primarySection === "support") {
    return <AdminSupportTickets />;
  }

  const title = primaryTitles[primarySection] ?? "Admin Module";
  return (
    <PlaceholderPanel
      title={title}
      description="This section is configured in the admin portal. We can now implement the full UI for this menu with charts, tabs, and table interactions."
    />
  );
}
