import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/services/auth/hook";
import { useGetProfileCompletionData } from "@/services/profile_completion/hook";
import { useGetDashboardStats } from "@/services/dashboard/hook";
import { ProfileCompletionWidget } from "../components/ProfileCompletionWidget";
import { RecentResumes } from "../components/RecentResumes";
import { 
  FilePlus2, 
  FileText, 
  Wand2, 
  Rocket,
  Target,
  BarChart3,
  Mail,
  Briefcase,
  GraduationCap,
  Code,
  Award,
  Target as TargetIcon
} from 'lucide-react';

export function MainDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Single API call for all profile completion data
  const { data: profileData, isLoading } = useGetProfileCompletionData();
  const { data: dashboardStats, isLoading: isLoadingStats } = useGetDashboardStats();

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
    },
    {
      id: 'job-matcher',
      title: 'Job Matcher',
      description: 'Compare your resume against job postings and get match scores',
      icon: Target,
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      iconColor: 'text-orange-600',
      action: 'Match Jobs',
      route: '/dashboard/job-matcher',
      enabled: true
    },
    {
      id: 'cover-letter',
      title: 'Cover Letter Generator',
      description: 'Generate tailored cover letters using AI for specific job applications',
      icon: Mail,
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
      iconColor: 'text-indigo-600',
      action: 'Generate Letter',
      route: '/dashboard/cover-letter',
      enabled: true
    }
  ];


  // Loading state
  if (isLoading || isLoadingStats) {
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
  if (!profileData || !dashboardStats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Data</h2>
          <p className="text-muted-foreground">Failed to load dashboard data. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Welcome Header */}
      <motion.div variants={itemVariants}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4" data-tour-id="dashboard-welcome">
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
            data-tour-id="quick-actions"
          >
            <FilePlus2 className="mr-2 h-4 w-4" />
            Generate Resume
          </Button>
        </div>
      </motion.div>

      {/* Profile Overview */}
      {profileData.data.completion_percentage < 100 && (
        <motion.div variants={itemVariants}>
          <div data-tour-id="profile-widget">
            <ProfileCompletionWidget 
              data={profileData.data} 
              variant="detailed" 
            />
          </div>
        </motion.div>
      )}

      {/* Recent Resumes */}
      <motion.div variants={itemVariants} data-tour-id="recent-activity">
        <RecentResumes />
      </motion.div>

      {/* Data Overview & Platform Features */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enhanced Data Statistics Overview */}
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
                  <FileText className="h-4 w-4 text-blue-600 mr-1" />
                  <span className="text-2xl font-bold">{dashboardStats.data.total_resumes}</span>
                </div>
                <p className="text-xs text-muted-foreground">Resumes</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <TargetIcon className="h-4 w-4 text-orange-600 mr-1" />
                  <span className="text-2xl font-bold">{dashboardStats.data.total_job_matches}</span>
                </div>
                <p className="text-xs text-muted-foreground">Job Matches</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Mail className="h-4 w-4 text-indigo-600 mr-1" />
                  <span className="text-2xl font-bold">{dashboardStats.data.total_cover_letters}</span>
                </div>
                <p className="text-xs text-muted-foreground">Cover Letters</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Briefcase className="h-4 w-4 text-blue-600 mr-1" />
                  <span className="text-2xl font-bold">{dashboardStats.data.total_experiences}</span>
                </div>
                <p className="text-xs text-muted-foreground">Experience</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <GraduationCap className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-2xl font-bold">{dashboardStats.data.total_educations}</span>
                </div>
                <p className="text-xs text-muted-foreground">Education</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Code className="h-4 w-4 text-purple-600 mr-1" />
                  <span className="text-2xl font-bold">{dashboardStats.data.total_skills}</span>
                </div>
                <p className="text-xs text-muted-foreground">Skills</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Award className="h-4 w-4 text-orange-600 mr-1" />
                  <span className="text-2xl font-bold">{dashboardStats.data.total_certifications}</span>
                </div>
                <p className="text-xs text-muted-foreground">Certifications</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Platform Features */}
        <Card data-tour-id="platform-features">
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

    </motion.div>
  );
} 