import { useMemo, useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AdminService, AdminUser, UserListResponse } from '@/services/admin/service';

const roles = [
  { label: 'All', value: '' },
  { label: 'User', value: 'user' },
  { label: 'Admin', value: 'admin' },
];

const statuses = [
  { label: 'All', value: '' },
  { label: 'Active', value: 'active' },
  { label: 'Disabled', value: 'disabled' },
];

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="p-3"><div className="h-4 w-48 bg-muted rounded" /></td>
      <td className="p-3"><div className="h-4 w-40 bg-muted rounded" /></td>
      <td className="p-3"><div className="h-4 w-20 bg-muted rounded" /></td>
      <td className="p-3"><div className="h-4 w-24 bg-muted rounded" /></td>
      <td className="p-3"><div className="h-4 w-14 bg-muted rounded" /></td>
      <td className="p-3"><div className="h-4 w-32 bg-muted rounded" /></td>
    </tr>
  );
}

export function UsersPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL-synced state
  const page = Number(searchParams.get('page') || '1');
  const pageSize = Number(searchParams.get('page_size') || '10');
  const sortBy = searchParams.get('sort_by') || 'created_at';
  const sortOrder = Number(searchParams.get('sort_order') || '-1') as 1 | -1;
  const roleFilter = searchParams.get('role') || '';
  const statusFilter = searchParams.get('status') || '';
  const verifiedFilter = searchParams.get('verified') || '';
  const workField = searchParams.get('work_field') || '';
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      const next = new URLSearchParams(searchParams);
      if (query) next.set('q', query); else next.delete('q');
      next.set('page', '1');
      setSearchParams(next, { replace: true });
    }, 400);
    return () => clearTimeout(t);
  }, [query]);

  const queryKey = useMemo(() => [
    'admin-users', { page, pageSize, sortBy, sortOrder, roleFilter, statusFilter, verifiedFilter, workField, initialQuery: searchParams.get('q') || '' }
  ], [page, pageSize, sortBy, sortOrder, roleFilter, statusFilter, verifiedFilter, workField, searchParams]);

  const { data, isLoading, isError } = useQuery<UserListResponse>({
    queryKey,
    queryFn: async () => {
      const q = searchParams.get('q');
      if (q && q.trim().length > 0) {
        return AdminService.searchUsers({ query: q, page, page_size: pageSize });
      }
      if (roleFilter || statusFilter || verifiedFilter || workField) {
        return AdminService.filterUsers({
          role: roleFilter ? (roleFilter as 'user' | 'admin') : undefined,
          status: statusFilter ? (statusFilter as 'active' | 'disabled') : undefined,
          is_verified: verifiedFilter ? verifiedFilter === 'true' : undefined,
          work_field: workField || undefined,
          page,
          page_size: pageSize,
        });
      }
      return AdminService.getUsers({ page, page_size: pageSize, sort_by: sortBy, sort_order: sortOrder });
    },
    keepPreviousData: true,
    staleTime: 10_000,
  });

  const setParam = (key: string, value: string | number) => {
    const next = new URLSearchParams(searchParams);
    next.set(String(key), String(value));
    setSearchParams(next, { replace: true });
  };

  const users = data?.users ?? [];
  const totalPages = data?.total_pages ?? 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold">Users</h1>

        <div className="flex flex-wrap gap-2">
          <input
            className="h-9 w-56 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
            placeholder="Search by email or name..."
            defaultValue={initialQuery}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select
            className="h-9 rounded-md border bg-background px-3 text-sm"
            value={roleFilter}
            onChange={(e) => { setParam('role', e.target.value); setParam('page', 1); }}
          >
            {roles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
          <select
            className="h-9 rounded-md border bg-background px-3 text-sm"
            value={statusFilter}
            onChange={(e) => { setParam('status', e.target.value); setParam('page', 1); }}
          >
            {statuses.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <select
            className="h-9 rounded-md border bg-background px-3 text-sm"
            value={verifiedFilter}
            onChange={(e) => { setParam('verified', e.target.value); setParam('page', 1); }}
          >
            <option value="">All</option>
            <option value="true">Verified</option>
            <option value="false">Unverified</option>
          </select>
        </div>
      </div>

      <div className="overflow-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-muted/60 backdrop-blur">
            <tr className="text-left">
              <th className="p-3">Email</th>
              <th className="p-3">Name</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
              <th className="p-3">Verified</th>
              <th className="p-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)}
            {!isLoading && users.map((u: AdminUser) => (
              <tr key={u.id} className="hover:bg-muted/30 cursor-pointer" onClick={() => navigate(`/admin/users/${u.id}`)}>
                <td className="p-3 font-medium">{u.email}</td>
                <td className="p-3">{u.first_name} {u.last_name}</td>
                <td className="p-3">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${u.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300'}`}>{u.role}</span>
                </td>
                <td className="p-3">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${u.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300' : 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300'}`}>{u.status}</span>
                </td>
                <td className="p-3">{u.is_verified ? 'Yes' : 'No'}</td>
                <td className="p-3">{new Date(u.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {!isLoading && users.length === 0 && (
              <tr>
                <td className="p-6 text-center text-muted-foreground" colSpan={6}>No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="text-sm text-muted-foreground">Page {page} of {Math.max(totalPages, 1)}</div>
        <div className="flex items-center gap-2">
          <button
            className="h-9 rounded-md border px-3 disabled:opacity-50"
            disabled={page <= 1}
            onClick={() => setParam('page', page - 1)}
          >
            Previous
          </button>
          <button
            className="h-9 rounded-md border px-3 disabled:opacity-50"
            disabled={totalPages === 0 || page >= totalPages}
            onClick={() => setParam('page', page + 1)}
          >
            Next
          </button>
          <select
            className="h-9 rounded-md border bg-background px-3 text-sm"
            value={pageSize}
            onChange={(e) => { setParam('page_size', Number(e.target.value)); setParam('page', 1); }}
          >
            {[10, 20, 50].map(ps => <option key={ps} value={ps}>{ps} / page</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}


