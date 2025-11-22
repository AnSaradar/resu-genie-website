import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useAdminUsers,
  useSearchAdminUsers,
  useFilterAdminUsers,
  useUpdateAdminUserStatus,
  useUpdateAdminUserRole,
} from '@/services/admin/hook';
import { AdminUser } from '@/services/admin/types';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  Shield,
  User,
  UserCheck,
  UserX,
  Loader2,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function AdminUsersPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<'user' | 'admin' | undefined>(undefined);
  const [filterStatus, setFilterStatus] = useState<'active' | 'disabled' | undefined>(undefined);
  const [filterVerified, setFilterVerified] = useState<boolean | undefined>(undefined);

  // Determine which query to use
  const useSearch = searchQuery.length > 0;
  const useFilter = !useSearch && (filterRole || filterStatus !== undefined || filterVerified !== undefined);

  const { data: usersData, isLoading: isLoadingUsers } = useAdminUsers(
    page,
    pageSize,
    'created_at',
    -1,
    !useSearch && !useFilter
  );

  const { data: searchData, isLoading: isLoadingSearch } = useSearchAdminUsers(
    searchQuery,
    page,
    pageSize,
    useSearch
  );

  const { data: filterData, isLoading: isLoadingFilter } = useFilterAdminUsers(
    filterRole,
    filterStatus,
    filterVerified,
    undefined,
    page,
    pageSize,
    useFilter
  );

  const updateStatusMutation = useUpdateAdminUserStatus();
  const updateRoleMutation = useUpdateAdminUserRole();

  const isLoading = isLoadingUsers || isLoadingSearch || isLoadingFilter;
  const data = useSearch ? searchData : useFilter ? filterData : usersData;

  const handleViewUser = (userId: string) => {
    navigate(`/admin/users/${userId}`);
  };

  const handleStatusChange = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'disabled' : 'active';
    try {
      await updateStatusMutation.mutateAsync({
        userId,
        statusUpdate: { status: newStatus },
      });
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleRoleChange = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      await updateRoleMutation.mutateAsync({
        userId,
        roleUpdate: { role: newRole },
      });
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setFilterRole(undefined);
    setFilterStatus(undefined);
    setFilterVerified(undefined);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage users, roles, and account status
        </p>
      </div>

      {/* Filters Card */}
      <Card>
        <CardHeader>
          <CardTitle>Filters & Search</CardTitle>
          <CardDescription>Search or filter users by various criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by email or name..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(1);
                  }}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Role Filter */}
            <Select
              value={filterRole || 'all'}
              onValueChange={(value) => {
                setFilterRole(value === 'all' ? undefined : (value as 'user' | 'admin'));
                setPage(1);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select
              value={filterStatus || 'all'}
              onValueChange={(value) => {
                setFilterStatus(value === 'all' ? undefined : (value as 'active' | 'disabled'));
                setPage(1);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="disabled">Disabled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Verification Filter */}
          <div className="mt-4 flex items-center gap-4">
            <Select
              value={filterVerified === undefined ? 'all' : filterVerified ? 'verified' : 'unverified'}
              onValueChange={(value) => {
                setFilterVerified(
                  value === 'all' ? undefined : value === 'verified'
                );
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Verification" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Verification</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="unverified">Unverified</SelectItem>
              </SelectContent>
            </Select>

            {(useSearch || useFilter) && (
              <Button variant="outline" onClick={handleClearFilters}>
                Clear Filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Users Table Card */}
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>
            {data ? `Total: ${data.total_count} users` : 'Loading...'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : !data || data.users.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No users found
            </div>
          ) : (
            <>
              <div className="rounded-md border overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="h-12 px-4 text-left align-middle font-medium">Name</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Email</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Role</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Verified</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Created</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.users.map((user: AdminUser) => (
                      <motion.tr
                        key={user.id}
                        className="border-b transition-colors hover:bg-muted/50"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <td className="p-4">
                          {user.first_name} {user.last_name}
                        </td>
                        <td className="p-4">{user.email}</td>
                        <td className="p-4">
                          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                            {user.role === 'admin' ? (
                              <Shield className="h-3 w-3 mr-1" />
                            ) : (
                              <User className="h-3 w-3 mr-1" />
                            )}
                            {user.role}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Badge
                            variant={user.status === 'active' ? 'default' : 'destructive'}
                          >
                            {user.status}
                          </Badge>
                        </td>
                        <td className="p-4">
                          {user.is_verified ? (
                            <UserCheck className="h-4 w-4 text-green-600" />
                          ) : (
                            <UserX className="h-4 w-4 text-gray-400" />
                          )}
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewUser(user.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleStatusChange(user.id, user.status)}
                              disabled={updateStatusMutation.isPending}
                            >
                              {user.status === 'active' ? (
                                <UserX className="h-4 w-4 text-destructive" />
                              ) : (
                                <UserCheck className="h-4 w-4 text-green-600" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRoleChange(user.id, user.role)}
                              disabled={updateRoleMutation.isPending}
                            >
                              {user.role === 'admin' ? (
                                <User className="h-4 w-4" />
                              ) : (
                                <Shield className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {data.total_pages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Page {data.page} of {data.total_pages}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1 || isLoading}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.min(data.total_pages, p + 1))}
                      disabled={page === data.total_pages || isLoading}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

