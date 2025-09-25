import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/services/auth/hook";
import { useGetProfileCompletionData } from "@/services/profile_completion/hook";
import { useGetMyActivityFeed } from "@/services/activity/hook";
import { ProfileCompletionWidget } from "../components/ProfileCompletionWidget";
import { useTour } from "@/modules/tour/TourProvider";
import { getDashboardSteps } from "@/modules/tour/steps";
import { 
  FilePlus2, 
  User, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  FileText, 
  Wand2, 
  Star, 
  Rocket,
  ArrowRight,
  Download,
  Calendar,
  Target,
  BarChart3,
  Activity,
  Shield,
  Clock,
  Eye,
  EyeOff,
  Zap,
  Award,
  Globe,
  Code,
  BookOpen,
  Briefcase,
  GraduationCap,
  Languages,
  Link as LinkIcon,
  FolderOpen
} from 'lucide-react';

export function MainDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { startTour, enabled, language } = useTour();

  // Single API call for all profile completion data
  const { data: profileData, isLoading } = useGetProfileCompletionData();
  const { data: activityFeed } = useGetMyActivityFeed(5);

  // Start dashboard tour on component mount
  useEffect(() => {
    if (enabled && profileData) {
      const steps = getDashboardSteps(language);
      startTour({ tourKey: 'dashboard', steps, autoRun: true });
    }
  }, [enabled, language, profileData, startTour]);

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
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const platformFeatures = [
    {
      id: 'templates',
      title: 'Resume Templates',
      description: 'Choose from professional, ATS-optimized templates designed for various industries',
      icon: FileText,
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-600',
      action: 'Browse Templates',
      route: '/dashboard/templates',
      enabled: false // Not implemented yet
    },
    {
      id: 'builder',
      title: 'Build a Resume',
      description: 'Create a completely new resume step-by-step with guided assistance',
      icon: Rocket,
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      iconColor: 'text-green-600',
      action: 'Start Building',
      route: '/dashboard/generate',
      enabled: true
    },
    {
      id: 'evaluator',
      title: 'Resume Evaluator',
      description: 'Get AI-powered feedback and suggestions to improve your resume',
      icon: Wand2,
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      iconColor: 'text-purple-600',
      action: 'Evaluate Resume',
      route: '/dashboard/evaluator',
      enabled: true
    }
  ];

  const quickActions = [
    {
      title: 'Generate Resume',
      description: 'Create a new resume from your profile data',
      icon: FilePlus2,
      action: () => navigate('/dashboard/generate'),
      enabled: true
    },
    {
      title: 'Complete Profile',
      description: 'Finish setting up your profile information',
      icon: User,
      action: () => navigate('/dashboard/account'),
      enabled: true
    },
    {
      title: 'Browse Templates',
      description: 'Explore professional resume templates',
      icon: FileText,
      action: () => navigate('/dashboard/templates'),
      enabled: false // Not implemented yet
    },
    {
      title: 'Get Evaluation',
      description: 'Get AI feedback on your resume',
      icon: BarChart3,
      action: () => navigate('/dashboard/evaluator'),
      enabled: true
    }
  ];

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Loading Dashboard</h2>
          <p className="text-muted-foreground">Please wait while we load your data...</p>
        </div>
      </div>
    );
  }

  // If no data, show error state
  if (!profileData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Data</h2>
          <p className="text-muted-foreground">Failed to load profile data. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Welcome Header */}
      <motion.div variants={itemVariants}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">
              Welcome back, {user?.first_name}! 👋
            </h1>
            <p className="text-muted-foreground mt-2">
              Ready to take your career to the next level? Let's build something amazing.
            </p>
          </div>
          <Button 
            size="lg" 
            className="text-base"
            onClick={() => navigate('/dashboard/generate')}
          >
            <FilePlus2 className="mr-2 h-4 w-4" />
            Generate Resume
          </Button>
        </div>
      </motion.div>

      {/* Profile Overview */}
      <motion.div variants={itemVariants}>
        <div data-tour="profile-widget">
          <ProfileCompletionWidget 
            data={profileData.data} 
            variant="detailed" 
          />
        </div>
      </motion.div>

      {/* Quick Actions Panel */}
      <motion.div variants={itemVariants} data-tour="quick-actions">
        <h2 className="text-2xl font-semibold mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: action.enabled ? 1.02 : 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card 
                  className={`transition-shadow ${
                    action.enabled 
                      ? 'cursor-pointer hover:shadow-md' 
                      : 'opacity-60 cursor-not-allowed'
                  }`}
                  onClick={action.enabled ? action.action : undefined}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <IconComponent className={`h-5 w-5 ${action.enabled ? 'text-blue-600' : 'text-gray-400'}`} />
                      <div>
                        <h3 className="font-medium">{action.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {action.description}
                        </p>
                        {!action.enabled && (
                          <Badge variant="secondary" className="mt-1 text-xs">
                            Coming Soon
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Middle Row: Data Statistics & Platform Features */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Data Statistics Overview */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <CardTitle>Your Data Overview</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Briefcase className="h-4 w-4 text-blue-600 mr-1" />
                  <span className="text-2xl font-bold">{profileData.data.stats.totalExperiences}</span>
                </div>
                <p className="text-xs text-muted-foreground">Work Experience</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <GraduationCap className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-2xl font-bold">{profileData.data.stats.totalEducations}</span>
                </div>
                <p className="text-xs text-muted-foreground">Education</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Code className="h-4 w-4 text-purple-600 mr-1" />
                  <span className="text-2xl font-bold">{profileData.data.stats.totalTechnicalSkills + profileData.data.stats.totalSoftSkills}</span>
                </div>
                <p className="text-xs text-muted-foreground">Skills</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Award className="h-4 w-4 text-orange-600 mr-1" />
                  <span className="text-2xl font-bold">{profileData.data.stats.totalCertifications}</span>
                </div>
                <p className="text-xs text-muted-foreground">Certifications</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Platform Features */}
        <Card data-tour="platform-features">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Rocket className="h-5 w-5 text-green-600" />
              <CardTitle>Platform Features</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {platformFeatures.map((feature) => {
                const IconComponent = feature.icon;
                return (
                  <div 
                    key={feature.id}
                    className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                      feature.enabled 
                        ? 'hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer' 
                        : 'opacity-60'
                    }`}
                    onClick={feature.enabled ? () => navigate(feature.route) : undefined}
                  >
                    <div className={`p-2 rounded-lg ${feature.bgColor}`}>
                      <IconComponent className={`h-4 w-4 ${feature.iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{feature.title}</p>
                      <p className="text-xs text-muted-foreground">{feature.description}</p>
                    </div>
                    {!feature.enabled && (
                      <Badge variant="secondary" className="text-xs">
                        Soon
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Bottom Row: Recent Activity & Evaluation Summary */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity Feed */}
        <Card data-tour="recent-activity">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              <CardTitle>Recent Activity</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Last login</span>
                  <span className="text-muted-foreground ml-auto">
                    {user?.last_login_at ? new Date(user.last_login_at).toLocaleString() : '-'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <span>Last activity</span>
                  <span className="text-muted-foreground ml-auto">
                    {user?.last_activity_at ? new Date(user.last_activity_at).toLocaleString() : '-'}
                  </span>
                </div>
                {(activityFeed && activityFeed.length > 0) ? (
                  activityFeed.map((item, idx) => (
                    <div key={item._id} className="flex items-center gap-3 text-sm">
                      <span className="text-muted-foreground">{item.type.replace(/_/g, ' ').toLowerCase()}</span>
                      <span className="ml-auto text-muted-foreground">{new Date(item.created_at).toLocaleString()}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground text-sm">
                    <EyeOff className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No recent activity</p>
                  </div>
                )}
              </div>
          </CardContent>
        </Card>

        {/* Evaluation Quick Summary */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              <CardTitle>Last Evaluation</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">-</div>
                <p className="text-sm text-muted-foreground">No evaluation yet</p>
              </div>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/dashboard/evaluator')}
              >
                <Wand2 className="mr-2 h-4 w-4" />
                Get Evaluation
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Getting Started Guide (for new users) - Now using unified component */}
      <ProfileCompletionWidget 
        data={profileData.data} 
        variant="checklist" 
        showOnlyWhenIncomplete={true}
      />
    </motion.div>
  );
} 