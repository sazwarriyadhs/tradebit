import DashboardClient from '@/components/dashboard/dashboard-client';
import { assets, alerts, marketNews } from '@/lib/data';

export default function Home() {
  return (
    <DashboardClient
      assets={assets}
      alerts={alerts}
      marketNews={marketNews}
    />
  );
}
