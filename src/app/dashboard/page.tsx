import { redirect } from "next/navigation";

export default function DashboardIndex() {
  // Directly point the dashboard root to the devices sub-page
  redirect("/dashboard/devices");
}
