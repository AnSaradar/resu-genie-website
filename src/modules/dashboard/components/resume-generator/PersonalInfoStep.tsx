import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Linkedin, 
  FileUser,
  Sparkles,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/services/auth/hook';
import { useGetUserProfile } from '@/services/user_profile/hook';
import { SeniorityLevel, WorkField } from '@/services/user_profile/types';
import { ResumeData } from '../../pages/ResumeGenerator';

interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  linkedinUrl: string;
  websiteUrl: string;
  currentPosition: string;
  profileSummary: string;
  seniorityLevel: SeniorityLevel | '';
  workField: WorkField | '';
  yearsOfExperience: number | '';
}

interface PersonalInfoStepProps {
  data: ResumeData;
  onUpdate: (data: Partial<ResumeData>) => void;
  onNext: () => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

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

export function PersonalInfoStep({ data, onUpdate, onNext, onPrevious, isFirstStep, isLastStep }: PersonalInfoStepProps) {
  const { user } = useAuth();
  const { data: userProfile, isLoading: profileLoading } = useGetUserProfile();
  
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: data.personalInfo?.firstName || '',
    lastName: data.personalInfo?.lastName || '',
    email: data.personalInfo?.email || '',
    phone: data.personalInfo?.phone || '',
    city: data.personalInfo?.city || '',
    country: data.personalInfo?.country || '',
    linkedinUrl: data.personalInfo?.linkedinUrl || '',
    websiteUrl: data.personalInfo?.websiteUrl || '',
    currentPosition: data.personalInfo?.currentPosition || '',
    profileSummary: data.personalInfo?.profileSummary || '',
    seniorityLevel: data.personalInfo?.seniorityLevel || '',
    workField: data.personalInfo?.workField || '',
    yearsOfExperience: data.personalInfo?.yearsOfExperience || '',
  });

  const [isAutoFilled, setIsAutoFilled] = useState(false);

  // Auto-fill from user and profile data
  const handleAutoFill = () => {
    if (user || userProfile) {
      const autoFilledData: PersonalInfo = {
        firstName: user?.first_name || personalInfo.firstName,
        lastName: user?.last_name || personalInfo.lastName,
        email: user?.email || personalInfo.email,
        phone: user?.phone || personalInfo.phone,
        city: userProfile?.address?.city || personalInfo.city,
        country: userProfile?.address?.country || userProfile?.country_of_residence || personalInfo.country,
        linkedinUrl: userProfile?.linkedin_url || personalInfo.linkedinUrl,
        websiteUrl: userProfile?.website_url || personalInfo.websiteUrl,
        currentPosition: userProfile?.current_position || personalInfo.currentPosition,
        profileSummary: userProfile?.profile_summary || personalInfo.profileSummary,
        seniorityLevel: userProfile?.current_seniority_level || personalInfo.seniorityLevel,
        workField: userProfile?.work_field || personalInfo.workField,
        yearsOfExperience: userProfile?.years_of_experience || personalInfo.yearsOfExperience,
      };
      
      setPersonalInfo(autoFilledData);
      setIsAutoFilled(true);
      
      // Update parent component
      onUpdate({ personalInfo: autoFilledData });
    }
  };

  // Update parent component when personal info changes
  const handleInputChange = (field: keyof PersonalInfo, value: string | number) => {
    const updatedInfo = { ...personalInfo, [field]: value };
    setPersonalInfo(updatedInfo);
    onUpdate({ personalInfo: updatedInfo });
  };

  // Check if form has enough data to proceed
  const isFormValid = personalInfo.firstName && personalInfo.lastName && personalInfo.email;

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Auto-fill section */}
      <motion.div variants={itemVariants}>
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-blue-600" />
                <div>
                  <h3 className="font-medium text-blue-800 dark:text-blue-200">
                    Auto-fill from Profile
                  </h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Save time by importing your existing profile information
                  </p>
                </div>
              </div>
              <Button
                onClick={handleAutoFill}
                disabled={profileLoading || (!user && !userProfile)}
                variant="outline"
                className="border-blue-300 text-blue-700 hover:bg-blue-100 dark:border-blue-600 dark:text-blue-300 dark:hover:bg-blue-800"
              >
                {profileLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent mr-2" />
                    Loading...
                  </>
                ) : (
                  <>
                    <FileUser className="h-4 w-4 mr-2" />
                    Auto-fill Data
                  </>
                )}
              </Button>
            </div>
            
            {isAutoFilled && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 flex items-center gap-2 text-green-700 dark:text-green-300"
              >
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Profile data imported successfully!</span>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Form fields */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5 text-blue-600" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={personalInfo.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="John"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={personalInfo.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={personalInfo.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="john.doe@example.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    value={personalInfo.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="pl-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location & Links */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="h-5 w-5 text-blue-600" />
                Location & Links
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={personalInfo.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="New York"
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={personalInfo.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    placeholder="United States"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="linkedinUrl">LinkedIn Profile</Label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="linkedinUrl"
                    value={personalInfo.linkedinUrl}
                    onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                    placeholder="linkedin.com/in/johndoe"
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="websiteUrl">Personal Website</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="websiteUrl"
                    value={personalInfo.websiteUrl}
                    onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                    placeholder="johndoe.com"
                    className="pl-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Professional Information */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileUser className="h-5 w-5 text-blue-600" />
              Professional Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="currentPosition">Current Position</Label>
              <Input
                id="currentPosition"
                value={personalInfo.currentPosition}
                onChange={(e) => handleInputChange('currentPosition', e.target.value)}
                placeholder="Software Engineer"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="seniorityLevel">Seniority Level</Label>
                <Select 
                  value={personalInfo.seniorityLevel} 
                  onValueChange={(value) => handleInputChange('seniorityLevel', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(SeniorityLevel).map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="workField">Work Field</Label>
                <Select 
                  value={personalInfo.workField} 
                  onValueChange={(value) => handleInputChange('workField', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(WorkField).map((field) => (
                      <SelectItem key={field} value={field}>
                        {field}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                <Input
                  id="yearsOfExperience"
                  type="number"
                  min="0"
                  max="50"
                  value={personalInfo.yearsOfExperience}
                  onChange={(e) => handleInputChange('yearsOfExperience', parseInt(e.target.value) || '')}
                  placeholder="5"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="profileSummary">Professional Summary</Label>
              <Textarea
                id="profileSummary"
                value={personalInfo.profileSummary}
                onChange={(e) => handleInputChange('profileSummary', e.target.value)}
                placeholder="Brief professional summary highlighting your key skills and experience..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Validation Message */}
      {!isFormValid && (
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-2 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg"
        >
          <AlertCircle className="h-5 w-5 text-amber-600" />
          <p className="text-amber-800 dark:text-amber-300 text-sm">
            Please fill in the required fields (First Name, Last Name, and Email) to continue.
          </p>
        </motion.div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={isFirstStep}
        >
          Previous
        </Button>
        <Button 
          onClick={onNext}
          disabled={!isFormValid}
        >
          Next: Work Experience
        </Button>
      </div>
    </motion.div>
  );
} 