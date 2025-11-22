import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Linkedin, 
  FileUser,
  Edit2,
  Save,
  X,
  Loader2
} from 'lucide-react';
import { SeniorityLevel, WorkField } from '@/services/user_profile/types';
import { useGetUserProfile, useUpdateUserProfile, useGetWorkFields } from '@/services/user_profile/hook';
import { extractApiErrorMessage } from '@/utils/error-utils';

interface PersonalInfo {
  city: string;
  country: string;
  linkedinUrl: string;
  websiteUrl: string;
  currentPosition: string;
  profileSummary: string;
  seniorityLevel: SeniorityLevel | '';
  workField: WorkField | '';
  yearsOfExperience: number | '';
  birthDate: string;
}

interface AccountPersonalInfoSectionProps {
  data: any;
  onDataUpdate: () => void;
}

export function AccountPersonalInfoSection({ data, onDataUpdate }: AccountPersonalInfoSectionProps) {
  const { data: userProfile, isLoading } = useGetUserProfile();
  const updateProfileMutation = useUpdateUserProfile();
  const { data: workFields = [] } = useGetWorkFields();
  const PROFILE_SUMMARY_MAX = 500;
  const [isEditing, setIsEditing] = useState(false);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    city: '',
    country: '',
    linkedinUrl: '',
    websiteUrl: '',
    currentPosition: '',
    profileSummary: '',
    seniorityLevel: '',
    workField: '',
    yearsOfExperience: '',
    birthDate: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Validation helper
  const validatePersonalInfo = (info: PersonalInfo): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (!info.birthDate?.trim()) {
      errors.push('Birth date is required');
    }
    
    // Profile summary length validation
    if (info.profileSummary && info.profileSummary.length > PROFILE_SUMMARY_MAX) {
      errors.push(`Professional summary must be at most ${PROFILE_SUMMARY_MAX} characters`);
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };

  // Update local state when user profile data changes
  useEffect(() => {
    if (userProfile) {
      setPersonalInfo({
        city: userProfile.address?.city || '',
        country: userProfile.address?.country || userProfile.country_of_residence || '',
        linkedinUrl: userProfile.linkedin_url || '',
        websiteUrl: userProfile.website_url || '',
        currentPosition: userProfile.current_position || '',
        profileSummary: userProfile.profile_summary || '',
        seniorityLevel: userProfile.current_seniority_level || '',
        workField: userProfile.work_field || '',
        yearsOfExperience: userProfile.years_of_experience || '',
        birthDate: userProfile.birth_date || '',
      });
    }
  }, [userProfile]);

  const handleInputChange = (field: keyof PersonalInfo, value: string | number) => {
    setPersonalInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setValidationErrors([]);
    
    // Client-side validation
    const validation = validatePersonalInfo(personalInfo);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      setError(validation.errors.join('; '));
      setSaving(false);
      return;
    }

    try {
      // Transform data to match backend format
      const payload = {
        address: {
          city: personalInfo.city,
          country: personalInfo.country,
        },
        linkedin_url: personalInfo.linkedinUrl,
        website_url: personalInfo.websiteUrl,
        current_position: personalInfo.currentPosition,
        profile_summary: personalInfo.profileSummary,
        current_seniority_level: personalInfo.seniorityLevel || undefined,
        work_field: personalInfo.workField || undefined,
        years_of_experience: personalInfo.yearsOfExperience === '' ? undefined : personalInfo.yearsOfExperience,
        birth_date: personalInfo.birthDate,
      };

      await updateProfileMutation.mutateAsync(payload);
      setIsEditing(false);
      setValidationErrors([]);
    } catch (err: any) {
      // Use shared error utility
      const errorMessage = extractApiErrorMessage(
        err,
        'Failed to update profile. Please try again.'
      );
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset to original data
    if (userProfile) {
      setPersonalInfo({
        city: userProfile.address?.city || '',
        country: userProfile.address?.country || userProfile.country_of_residence || '',
        linkedinUrl: userProfile.linkedin_url || '',
        websiteUrl: userProfile.website_url || '',
        currentPosition: userProfile.current_position || '',
        profileSummary: userProfile.profile_summary || '',
        seniorityLevel: userProfile.current_seniority_level || '',
        workField: userProfile.work_field || '',
        yearsOfExperience: userProfile.years_of_experience || '',
        birthDate: userProfile.birth_date || '',
      });
    }
    setIsEditing(false);
    setError(null);
    setValidationErrors([]);
  };

  return (
    <div className="w-full border-b border-gray-200 dark:border-gray-700 pb-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <User className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold">Personal Information</h2>
        </div>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => setIsEditing(true)}
        >
          <Edit2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Display Mode */}
      {!isEditing && (
        <>
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" />
              Loading personal information...
            </div>
          ) : (
            <div className="space-y-8">
              {/* Main Information Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Personal Details & Location */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Location & Personal</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-6 py-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2 min-w-[120px]">
                        <MapPin className="h-4 w-4" />
                        Location
                      </span>
                      <span className="text-sm text-gray-900 dark:text-gray-100">
                        {personalInfo.city && personalInfo.country 
                          ? `${personalInfo.city}, ${personalInfo.country}`
                          : <span className="text-gray-400 italic">Not provided</span>
                        }
                      </span>
                    </div>
                    <div className="flex items-center gap-6 py-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2 min-w-[120px]">
                        <User className="h-4 w-4" />
                        Birth Date
                      </span>
                      <span className="text-sm text-gray-900 dark:text-gray-100">
                        {personalInfo.birthDate ? (
                          new Date(personalInfo.birthDate).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })
                        ) : (
                          <span className="text-gray-400 italic">Not provided</span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Online Presence */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Globe className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Online Presence</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-6 py-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2 min-w-[120px]">
                        <Linkedin className="h-4 w-4" />
                        LinkedIn
                      </span>
                      <span className="text-sm">
                        {personalInfo.linkedinUrl ? (
                          <a 
                            href={personalInfo.linkedinUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
                          >
                            View Profile
                          </a>
                        ) : (
                          <span className="text-gray-400 italic">Not provided</span>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-6 py-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2 min-w-[120px]">
                        <Globe className="h-4 w-4" />
                        Website
                      </span>
                      <span className="text-sm">
                        {personalInfo.websiteUrl ? (
                          <a 
                            href={personalInfo.websiteUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
                          >
                            Visit Site
                          </a>
                        ) : (
                          <span className="text-gray-400 italic">Not provided</span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <FileUser className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Professional Information</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-6 py-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400 min-w-[140px]">Current Position</span>
                      <span className="text-sm text-gray-900 dark:text-gray-100">
                        {personalInfo.currentPosition || <span className="text-gray-400 italic">Not provided</span>}
                      </span>
                    </div>
                    <div className="flex items-center gap-6 py-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400 min-w-[140px]">Seniority Level</span>
                      <span className="text-sm text-gray-900 dark:text-gray-100">
                        {personalInfo.seniorityLevel || <span className="text-gray-400 italic">Not provided</span>}
                      </span>
                    </div>
                    <div className="flex items-center gap-6 py-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400 min-w-[140px]">Work Field</span>
                      <span className="text-sm text-gray-900 dark:text-gray-100">
                        {personalInfo.workField || <span className="text-gray-400 italic">Not provided</span>}
                      </span>
                    </div>
                    <div className="flex items-center gap-6 py-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400 min-w-[140px]">Years of Experience</span>
                      <span className="text-sm text-gray-900 dark:text-gray-100">
                        {personalInfo.yearsOfExperience || <span className="text-gray-400 italic">Not provided</span>}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional Summary - Full Width on New Line */}
              {personalInfo.profileSummary && (
                <div className="w-full">
                  <div className="flex items-center gap-2 mb-4">
                    <FileUser className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Professional Summary</h3>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border">
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {personalInfo.profileSummary}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Edit Modal */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="w-[98vw] max-w-none max-h-[98vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Edit Personal Information</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-8 py-4">
            {/* Birth Date */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="birthDate">Birth Date *</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={personalInfo.birthDate}
                    onChange={(e) => handleInputChange('birthDate', e.target.value)}
                    className="h-12 text-base"
                  />
                </div>
              </div>
            </div>

            {/* Location & Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                Location & Links
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={personalInfo.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="New York"
                    className="h-12 text-base"
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={personalInfo.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    placeholder="United States"
                    className="h-12 text-base"
                  />
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
                      className="pl-10 h-12 text-base"
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
                      className="pl-10 h-12 text-base"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileUser className="h-5 w-5 text-blue-600" />
                Professional Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="currentPosition">Current Position</Label>
                  <Input
                    id="currentPosition"
                    value={personalInfo.currentPosition}
                    onChange={(e) => handleInputChange('currentPosition', e.target.value)}
                    placeholder="Software Engineer"
                    className="h-12 text-base"
                  />
                </div>
                <div>
                  <Label htmlFor="seniorityLevel">Seniority Level</Label>
                  <Select 
                    value={personalInfo.seniorityLevel} 
                    onValueChange={(value) => handleInputChange('seniorityLevel', value)}
                  >
                    <SelectTrigger className="h-12 text-base">
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
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue placeholder="Select field" />
                    </SelectTrigger>
                    <SelectContent>
                      {workFields.map((field) => (
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
                    className="h-12 text-base"
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
                  className="text-base"
                maxLength={PROFILE_SUMMARY_MAX}
                />
              <div className="mt-1 text-xs text-muted-foreground text-right">
                {(personalInfo.profileSummary?.length || 0)}/{PROFILE_SUMMARY_MAX}
              </div>
              </div>
            </div>
          </div>

          {validationErrors.length > 0 && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <h4 className="text-red-800 dark:text-red-200 font-semibold mb-2 text-sm">
                Please fix the following issues:
              </h4>
              <ul className="text-red-700 dark:text-red-300 text-sm space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">•</span>
                    <span>{error}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {error && validationErrors.length === 0 && (
            <div className="text-red-600 dark:text-red-400 text-sm mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
              {error}
            </div>
          )}

          <DialogFooter className="flex gap-4">
            <Button variant="outline" onClick={handleCancel} disabled={saving} className="h-12 px-8">
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={saving || !personalInfo.birthDate?.trim()} 
              className="h-12 px-8"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 