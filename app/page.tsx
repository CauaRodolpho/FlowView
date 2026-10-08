import { DashboardApp } from "@/components/dashboard-app";
import { DashboardErrorBoundary } from "@/components/dashboard-error-boundary";

export default function Home() {
  return <DashboardErrorBoundary><DashboardApp /></DashboardErrorBoundary>;
}
