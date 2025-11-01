import { useQuery } from '@tanstack/react-query';
import { AdminService, StatsResponse } from '@/services/admin/service';

function StatCard({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div className={`relative overflow-hidden rounded-xl border bg-card p-5 shadow-sm transition hover:shadow-md`}>      
      <div className="flex items-end justify-between">
        <div>
          <div className="text-sm text-muted-foreground">{label}</div>
          <div className="mt-2 text-3xl font-semibold tracking-tight">{value.toLocaleString()}</div>
        </div>
        <div className={`h-10 w-10 rounded-full ${accent} opacity-20 blur`}></div>
      </div>
      <div className={`absolute inset-x-0 bottom-0 h-1 ${accent}`}></div>
    </div>
  );
}

export function OverviewPage() {
  const { data, isLoading, isError } = useQuery<StatsResponse>({
    queryKey: ['admin-stats'],
    queryFn: () => AdminService.getStats(),
    staleTime: 30_000,
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border p-5 animate-pulse">
            <div className="h-4 w-24 bg-muted rounded" />
            <div className="mt-3 h-8 w-32 bg-muted rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return <div className="text-red-500">Failed to load stats. Please try again.</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Overview</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Users" value={data.total_users} accent="bg-primary" />
        <StatCard label="Verified" value={data.verified_users} accent="bg-green-500" />
        <StatCard label="Unverified" value={data.unverified_users} accent="bg-yellow-500" />
        <StatCard label="Admins" value={data.admin_users} accent="bg-purple-500" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard label="Active" value={data.active_users} accent="bg-blue-500" />
        <StatCard label="Disabled" value={data.disabled_users} accent="bg-rose-500" />
      </div>
    </div>
  );
}


