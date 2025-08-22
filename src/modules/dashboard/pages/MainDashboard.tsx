import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Link, useNavigate } from "react-router-dom";
import { useGetUserProfile } from "@/services/user_profile/hook";
import { useAuth } from "@/services/auth/hook";
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
  Target
} from 'lucide-react';

export function MainDashboard() {
  const { user } = useAuth();
  const { data: userProfile, isLoading: profileLoading } = useGetUserProfile();
  const navigate = useNavigate();

  // Dummy data for demonstration - replace with actual data later
  const userDocuments: any[] = []; // Replace with actual documents later
  const hasDocuments = userDocuments.length > 0;
  const profileCompletionPercentage = userProfile ? 100 : 0;

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
      route: '/dashboard/templates'
    },
    {
      id: 'builder',
      title: 'Build a Resume',
      description: 'Create a completely new resume step-by-step with guided assistance',
      icon: Rocket,
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      iconColor: 'text-green-600',
      action: 'Start Building',
      route: '/dashboard/generate'
    }
  ];

  const quickActions = [
    {
      title: 'Upload Resume',
      description: 'Upload an existing resume to enhance or evaluate',
      icon: Download,
      action: () => navigate('/dashboard/upload')
    },
    {
      title: 'Schedule Review',
      description: 'Book a 1-on-1 resume review session',
      icon: Calendar,
      action: () => navigate('/dashboard/schedule')
    },
    {
      title: 'Career Goals',
      description: 'Set and track your career objectives',
      icon: Target,
      action: () => navigate('/dashboard/goals')
    }
  ];

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
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
            Build a Resume
          </Button>
        </div>
      </motion.div>

      {/* Profile Completion Status */}
      {profileCompletionPercentage < 100 && (
        <motion.div variants={itemVariants}>
          <Card className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                <CardTitle className="text-orange-800 dark:text-orange-200">
                  Complete Your Profile
                </CardTitle>
              </div>
              <CardDescription className="text-orange-700 dark:text-orange-300">
                Finish setting up your profile to unlock all features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Profile completion</span>
                  <span>{profileCompletionPercentage}%</span>
                </div>
                <Progress value={profileCompletionPercentage} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Platform Features Grid */}
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-semibold mb-6">Explore ResuGenie Platform</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {platformFeatures.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={feature.id}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300 cursor-pointer group">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className={`p-3 rounded-lg ${feature.bgColor}`}>
                        <IconComponent className={`h-6 w-6 ${feature.iconColor}`} />
                      </div>
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      className="w-full group-hover:scale-105 transition-transform"
                      onClick={() => navigate(feature.route)}
                    >
                      {feature.action}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-semibold mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={action.action}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <IconComponent className="h-5 w-5 text-blue-600" />
                      <div>
                        <h3 className="font-medium">{action.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Recent Activity / Statistics */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Resumes
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userDocuments.length}</div>
              <p className="text-xs text-muted-foreground">
                +0 from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Profile Score
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">85%</div>
              <p className="text-xs text-muted-foreground">
                +5% from last week
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Job Matches
              </CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                +3 new this week
              </p>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Getting Started Guide (for new users) */}
      {!hasDocuments && (
        <motion.div variants={itemVariants}>
          <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Rocket className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-blue-800 dark:text-blue-200">
                  Get Started with ResuGenie
                </CardTitle>
              </div>
              <CardDescription className="text-blue-700 dark:text-blue-300">
                Follow these steps to create your first professional resume
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Profile setup completed</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                  <span>Choose a template or build from scratch</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                  <span>Fill in your experience and skills</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                  <span>Download your polished resume</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
} 