import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { useGetUserProfile } from "@/services/user_profile/hook";
import { useGetAllExperiences } from "@/services/experience/hook";
import { useGetAllEducations } from "@/services/education/hook";
import { useGetAllSkills } from "@/services/skill/hook";
import { useGetAllCertifications } from "@/services/certification/hook";
import { useGetAllLanguages } from "@/services/language/hook";
import { useGetAllPersonalProjects } from "@/services/personal_project/hook";
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

  // Fetch all user data
  const { data: userProfile, isLoading: profileLoading } = useGetUserProfile();
  const { data: experiences, isLoading: experiencesLoading } = useGetAllExperiences();
  const { data: educations, isLoading: educationsLoading } = useGetAllEducations();
  const { data: skills, isLoading: skillsLoading } = useGetAllSkills();
  const { data: certifications, isLoading: certificationsLoading } = useGetAllCertifications();
  const { data: languages, isLoading: languagesLoading } = useGetAllLanguages();
  const { data: personalProjects, isLoading: projectsLoading } = useGetAllPersonalProjects();

  // Calculate profile completeness
  const calculateProfileCompleteness = () => {
    if (!userProfile) return 0;
    
    let completedSections = 0;
    const totalSections = 8;
    
    // Check each section
    if (userProfile.profile_summary) completedSections++;
    if (userProfile.linkedin_url) completedSections++;
    if (userProfile.current_position) completedSections++;
    if (userProfile.work_field) completedSections++;
    if (userProfile.years_of_experience !== null && userProfile.years_of_experience !== undefined) completedSections++;
    if (experiences && experiences.length > 0) completedSections++;
    if (educations && educations.length > 0) completedSections++;
    if (skills && skills.length > 0) completedSections++;
    
    return Math.round((completedSections / totalSections) * 100);
  };

  const profileCompletionPercentage = calculateProfileCompleteness();
  const hasDocuments = false; // Will be updated when resume service is implemented

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
  const isLoading = profileLoading || experiencesLoading || educationsLoading || 
                   skillsLoading || certificationsLoading || languagesLoading || projectsLoading;

  if (isLoading) {
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
            Generate Resume
          </Button>
        </div>
      </motion.div>

      {/* Top Row: Resume Generation Status & Profile Completeness */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resume Generation Status */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <CardTitle>Resume Generation Status</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Ready to Generate</span>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  {profileCompletionPercentage >= 70 ? "Ready" : "Incomplete"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Profile Completeness</span>
                <span className="text-sm font-medium">{profileCompletionPercentage}%</span>
              </div>
              <Progress value={profileCompletionPercentage} className="h-2" />
              {profileCompletionPercentage < 70 && (
                <p className="text-xs text-muted-foreground">
                  Complete your profile to generate resumes
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Profile Completeness Score */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <CardTitle>Profile Completeness</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{profileCompletionPercentage}%</span>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Complete</div>
                </div>
              </div>
              <Progress value={profileCompletionPercentage} className="h-2" />
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1">
                  {userProfile?.profile_summary ? <CheckCircle className="h-3 w-3 text-green-600" /> : <AlertCircle className="h-3 w-3 text-orange-600" />}
                  <span>Profile Summary</span>
                </div>
                <div className="flex items-center gap-1">
                  {experiences && experiences.length > 0 ? <CheckCircle className="h-3 w-3 text-green-600" /> : <AlertCircle className="h-3 w-3 text-orange-600" />}
                  <span>Experience</span>
                </div>
                <div className="flex items-center gap-1">
                  {educations && educations.length > 0 ? <CheckCircle className="h-3 w-3 text-green-600" /> : <AlertCircle className="h-3 w-3 text-orange-600" />}
                  <span>Education</span>
                </div>
                <div className="flex items-center gap-1">
                  {skills && skills.length > 0 ? <CheckCircle className="h-3 w-3 text-green-600" /> : <AlertCircle className="h-3 w-3 text-orange-600" />}
                  <span>Skills</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions Panel */}
      <motion.div variants={itemVariants}>
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
                  <span className="text-2xl font-bold">{experiences?.length || 0}</span>
                </div>
                <p className="text-xs text-muted-foreground">Work Experience</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <GraduationCap className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-2xl font-bold">{educations?.length || 0}</span>
                </div>
                <p className="text-xs text-muted-foreground">Education</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Code className="h-4 w-4 text-purple-600 mr-1" />
                  <span className="text-2xl font-bold">{skills?.length || 0}</span>
                </div>
                <p className="text-xs text-muted-foreground">Skills</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Award className="h-4 w-4 text-orange-600 mr-1" />
                  <span className="text-2xl font-bold">{certifications?.length || 0}</span>
                </div>
                <p className="text-xs text-muted-foreground">Certifications</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Platform Features */}
        <Card>
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
        <Card>
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
                <span>Profile updated</span>
                <span className="text-muted-foreground ml-auto">2 hours ago</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>Account created</span>
                <span className="text-muted-foreground ml-auto">1 day ago</span>
              </div>
              <div className="text-center py-4 text-muted-foreground text-sm">
                <EyeOff className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Activity tracking coming soon</p>
              </div>
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

      {/* Getting Started Guide (for new users) */}
      {profileCompletionPercentage < 50 && (
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
                  {userProfile ? <CheckCircle className="h-5 w-5 text-green-600" /> : <div className="h-5 w-5 rounded-full border-2 border-gray-300" />}
                  <span>Complete your profile</span>
                </div>
                <div className="flex items-center gap-3">
                  {experiences && experiences.length > 0 ? <CheckCircle className="h-5 w-5 text-green-600" /> : <div className="h-5 w-5 rounded-full border-2 border-gray-300" />}
                  <span>Add work experience</span>
                </div>
                <div className="flex items-center gap-3">
                  {educations && educations.length > 0 ? <CheckCircle className="h-5 w-5 text-green-600" /> : <div className="h-5 w-5 rounded-full border-2 border-gray-300" />}
                  <span>Add education details</span>
                </div>
                <div className="flex items-center gap-3">
                  {skills && skills.length > 0 ? <CheckCircle className="h-5 w-5 text-green-600" /> : <div className="h-5 w-5 rounded-full border-2 border-gray-300" />}
                  <span>Add your skills</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                  <span>Generate your resume</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
} 