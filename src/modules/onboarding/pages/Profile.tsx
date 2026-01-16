import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useNavigate } from "react-router-dom";
import { useCreateUserProfile, useGetWorkFields, useGetCountries } from "@/services/user_profile/hook";
import { UserProfileData, SeniorityLevel, WorkField } from "@/services/user_profile/types";
import { toast } from "react-hot-toast";
import { ArrowLeft, ArrowRight, UserCircle, Briefcase } from "lucide-react";
import { useAppTranslation } from "@/i18n/hooks";

type ProfileFormValues = {
  birth_date: string;
  linkedin_url?: string;
  website_url?: string;
  profile_summary?: string;
  city?: string;
  country: string;
  country_of_residence?: string;
  current_position?: string;
  current_seniority_level?: SeniorityLevel;
  work_field?: WorkField;
  years_of_experience?: number;
};

export function Profile() {
  const { t } = useAppTranslation('onboarding');
  const { t: tCommon } = useAppTranslation('common');
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const createProfileMutation = useCreateUserProfile();
  const { data: workFields, isLoading: workFieldsLoading } = useGetWorkFields();
  const { data: countries, isLoading: countriesLoading } = useGetCountries();

  // Create validation schema with translations
  const profileFormSchema = z.object({
    // Step 1: Personal Information
    birth_date: z.string().min(1, t('profile.validation.birth_date_required')),
    linkedin_url: z.string().url(t('profile.validation.linkedin_invalid')).optional().or(z.literal("")),
    website_url: z.string().url(t('profile.validation.website_invalid')).optional().or(z.literal("")),
    profile_summary: z.string().max(500, t('profile.validation.summary_max')).optional(),
    
    // Address information
    city: z.string().optional(),
    country: z.string().min(1, t('profile.validation.country_required')),
    country_of_residence: z.string().optional(),
    
    // Step 2: Professional Information
    current_position: z.string().optional(),
    current_seniority_level: z.nativeEnum(SeniorityLevel).optional(),
    work_field: z.nativeEnum(WorkField).optional(),
    years_of_experience: z.coerce.number().min(0, t('profile.validation.years_negative')).max(50, t('profile.validation.years_max')).optional(),
  });

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      birth_date: "",
      linkedin_url: "",
      website_url: "",
      profile_summary: "",
      city: "",
      country: "",
      country_of_residence: "",
      current_position: "",
      years_of_experience: undefined,
    },
  });

  const { watch, trigger } = form;
  const watchedValues = watch();

  const totalSteps = 2;
  const progress = (currentStep / totalSteps) * 100;


  function onSubmit(data: ProfileFormValues) {
    // Transform form data to match API structure
    const profileData: UserProfileData = {
      birth_date: data.birth_date,
      linkedin_url: data.linkedin_url || undefined,
      website_url: data.website_url || undefined,
      profile_summary: data.profile_summary || undefined,
      address: data.city || data.country ? {
        city: data.city || undefined,
        country: data.country,
      } : undefined,
      country_of_residence: data.country_of_residence || undefined,
      current_position: data.current_position || undefined,
      current_seniority_level: data.current_seniority_level || undefined,
      work_field: data.work_field || undefined,
      years_of_experience: data.years_of_experience || undefined,
    };

    createProfileMutation.mutate(profileData, {
      onSuccess: () => {
        toast.success(t('profile.toast.profile_created'));
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      },
    });
  }

  const handleNextStep = async () => {
    if (currentStep === 1) {
      // Validate step 1 fields
      const step1Valid = await trigger(['birth_date', 'country']);
      if (step1Valid) {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      // Submit the form
      form.handleSubmit(onSubmit)();
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/onboarding/welcome');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 py-12 px-4">
      <div className="container max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">
            {t('profile.title')} <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Profile</span>
          </h1>
          <p className="text-muted-foreground">{t('profile.subtitle')}</p>
        </motion.div>

        {/* Progress */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">{t('profile.step', { current: currentStep, total: totalSteps })}</span>
            <span className="text-sm text-muted-foreground">{t('profile.progress', { progress: Math.round(progress) })}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </motion.div>

        {/* Form Card */}
        <motion.div
          key={currentStep}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.3 }}
        >
          <Card className="shadow-xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                {currentStep === 1 ? (
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <UserCircle className="h-6 w-6 text-blue-600" />
                  </div>
                ) : (
                  <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <Briefcase className="h-6 w-6 text-green-600" />
                  </div>
                )}
                <div>
                  <CardTitle className="text-xl">
                    {currentStep === 1 ? t('profile.step1.title') : t('profile.step2.title')}
                  </CardTitle>
                  <CardDescription>
                    {currentStep === 1 
                      ? t('profile.step1.description')
                      : t('profile.step2.description')
                    }
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <Form {...form}>
                <form className="space-y-6">
                  {/* Step 1: Personal Information */}
                  {currentStep === 1 && (
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="birth_date"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('profile.step1.birth_date_label')}</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('profile.step1.country_label')}</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value || "Syria"}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder={t('profile.step1.country_placeholder')} />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {countriesLoading ? (
                                    <SelectItem value="loading" disabled>{t('profile.toast.loading_countries')}</SelectItem>
                                  ) : countries && countries.length > 0 ? (
                                    countries.map((country) => (
                                      <SelectItem key={country} value={country}>
                                        {country}
                                      </SelectItem>
                                    ))
                                  ) : (
                                    <SelectItem value="error" disabled>{t('profile.toast.failed_load_countries')}</SelectItem>
                                  )}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('profile.step1.city_label')}</FormLabel>
                              <FormControl>
                                <Input placeholder={t('profile.step1.city_placeholder')} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="country_of_residence"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('profile.step1.country_of_residence_label')}</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value || "Syria"}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder={t('profile.step1.country_of_residence_placeholder')} />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {countriesLoading ? (
                                    <SelectItem value="loading" disabled>{t('profile.toast.loading_countries')}</SelectItem>
                                  ) : countries && countries.length > 0 ? (
                                    countries.map((country) => (
                                      <SelectItem key={country} value={country}>
                                        {country}
                                      </SelectItem>
                                    ))
                                  ) : (
                                    <SelectItem value="error" disabled>{t('profile.toast.failed_load_countries')}</SelectItem>
                                  )}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="linkedin_url"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('profile.step1.linkedin_label')}</FormLabel>
                              <FormControl>
                                <Input placeholder={t('profile.step1.linkedin_placeholder')} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="website_url"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('profile.step1.website_label')}</FormLabel>
                              <FormControl>
                                <Input placeholder={t('profile.step1.website_placeholder')} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="profile_summary"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('profile.step1.summary_label')}</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder={t('profile.step1.summary_placeholder')}
                                className="min-h-[100px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                    </motion.div>
                  )}

                  {/* Step 2: Professional Information */}
                  {currentStep === 2 && (
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="current_position"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('profile.step2.current_position_label')}</FormLabel>
                              <FormControl>
                                <Input placeholder={t('profile.step2.current_position_placeholder')} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="current_seniority_level"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('profile.step2.seniority_level_label')}</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder={t('profile.step2.seniority_level_placeholder')} />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {Object.values(SeniorityLevel).map((level) => (
                                    <SelectItem key={level} value={level}>
                                      {level}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="work_field"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('profile.step2.work_field_label')}</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder={t('profile.step2.work_field_placeholder')} />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {Object.values(WorkField).map((field_value) => (
                                    <SelectItem key={field_value} value={field_value}>
                                      {field_value}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="years_of_experience"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('profile.step2.years_experience_label')}</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder={t('profile.step2.years_experience_placeholder')} 
                                  min="0" 
                                  max="50"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                    </motion.div>
                  )}
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-between mt-8"
        >
          <Button
            variant="outline"
            onClick={handlePreviousStep}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {currentStep === 1 ? t('profile.navigation.back_to_welcome') : t('profile.navigation.previous')}
          </Button>

          <Button
            onClick={handleNextStep}
            className="flex items-center gap-2"
            disabled={createProfileMutation.isPending}
          >
            {currentStep === totalSteps ? (
              createProfileMutation.isPending ? t('profile.navigation.creating') : t('profile.navigation.complete')
            ) : (
              <>
                {t('profile.navigation.next')}
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </section>
  );
} 