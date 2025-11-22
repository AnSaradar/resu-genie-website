import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminUserStats } from '@/services/admin/hook';
import {
  Users,
  UserCheck,
  UserX,
  Shield,
  User,
  Loader2,
  TrendingUp,
} from 'lucide-react';

export default function AdminStatsPage() {
  const { data: stats, isLoading } = useAdminUserStats();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10,
      },
    },
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Unable to load statistics</p>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats.total_users,
      icon: Users,
      description: 'All registered users',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      title: 'Verified Users',
      value: stats.verified_users,
      icon: UserCheck,
      description: 'Email verified',
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      title: 'Unverified Users',
      value: stats.unverified_users,
      icon: UserX,
      description: 'Pending verification',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    },
    {
      title: 'Active Users',
      value: stats.active_users,
      icon: TrendingUp,
      description: 'Currently active',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
    },
    {
      title: 'Disabled Users',
      value: stats.disabled_users,
      icon: UserX,
      description: 'Account disabled',
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
    },
    {
      title: 'Admin Users',
      value: stats.admin_users,
      icon: Shield,
      description: 'Administrators',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      title: 'Regular Users',
      value: stats.regular_users,
      icon: User,
      description: 'Standard users',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Platform Statistics</h1>
        <p className="text-muted-foreground mt-2">
          Overview of user metrics and platform usage
        </p>
      </div>

      {/* Stats Grid */}
      <motion.div
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div key={index} variants={itemVariants}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
          <CardDescription>Key metrics at a glance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Verification Rate</p>
              <p className="text-2xl font-bold">
                {stats.total_users > 0
                  ? ((stats.verified_users / stats.total_users) * 100).toFixed(1)
                  : 0}
                %
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Active Rate</p>
              <p className="text-2xl font-bold">
                {stats.total_users > 0
                  ? ((stats.active_users / stats.total_users) * 100).toFixed(1)
                  : 0}
                %
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Admin Ratio</p>
              <p className="text-2xl font-bold">
                {stats.total_users > 0
                  ? ((stats.admin_users / stats.total_users) * 100).toFixed(2)
                  : 0}
                %
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Unverified Count</p>
              <p className="text-2xl font-bold">{stats.unverified_users}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

