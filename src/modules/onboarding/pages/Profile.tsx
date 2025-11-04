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

// Form validation schema
const profileFormSchema = z.object({
  // Step 1: Personal Information
  birth_date: z.string().min(1, "Birth date is required"),
  linkedin_url: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
  website_url: z.string().url("Invalid website URL").optional().or(z.literal("")),
  profile_summary: z.string().max(500, "Profile summary must be under 500 characters").optional(),
  
  // Address information
  city: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  country_of_residence: z.string().optional(),
  
  // Step 2: Professional Information
  current_position: z.string().optional(),
  current_seniority_level: z.nativeEnum(SeniorityLevel).optional(),
  work_field: z.nativeEnum(WorkField).optional(),
  years_of_experience: z.coerce.number().min(0, "Years of experience cannot be negative").max(50, "Years of experience cannot exceed 50").optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function Profile() {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const createProfileMutation = useCreateUserProfile();
  const { data: workFields, isLoading: workFieldsLoading } = useGetWorkFields();
  const { data: countries, isLoading: countriesLoading } = useGetCountries();

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
        toast.success("Profile created successfully! Redirecting to dashboard...");
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
            Complete Your <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Profile</span>
          </h1>
          <p className="text-muted-foreground">Help us create the perfect resume for you</p>
        </motion.div>

        {/* Progress */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
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
                    {currentStep === 1 ? "Personal Information" : "Professional Background"}
                  </CardTitle>
                  <CardDescription>
                    {currentStep === 1 
                      ? "Tell us about yourself and where you're located"
                      : "Share your professional experience and career goals"
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
                              <FormLabel>Date of Birth *</FormLabel>
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
                              <FormLabel>Country *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select your country" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {countriesLoading ? (
                                    <SelectItem value="loading" disabled>Loading countries...</SelectItem>
                                  ) : countries && countries.length > 0 ? (
                                    countries.map((country) => (
                                      <SelectItem key={country} value={country}>
                                        {country}
                                      </SelectItem>
                                    ))
                                  ) : (
                                    <SelectItem value="error" disabled>Failed to load countries</SelectItem>
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
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., New York" {...field} />
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
                              <FormLabel>Country of Residence</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="If different from above" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {countriesLoading ? (
                                    <SelectItem value="loading" disabled>Loading countries...</SelectItem>
                                  ) : countries && countries.length > 0 ? (
                                    countries.map((country) => (
                                      <SelectItem key={country} value={country}>
                                        {country}
                                      </SelectItem>
                                    ))
                                  ) : (
                                    <SelectItem value="error" disabled>Failed to load countries</SelectItem>
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
                              <FormLabel>LinkedIn Profile</FormLabel>
                              <FormControl>
                                <Input placeholder="https://linkedin.com/in/yourprofile" {...field} />
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
                              <FormLabel>Personal Website</FormLabel>
                              <FormControl>
                                <Input placeholder="https://yourwebsite.com" {...field} />
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
                            <FormLabel>Profile Summary</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Briefly describe yourself, your background, and career goals..."
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
                              <FormLabel>Current Position</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Software Engineer, Student" {...field} />
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
                              <FormLabel>Seniority Level</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select your level" />
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
                              <FormLabel>Work Field / Industry</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select your field" />
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
                              <FormLabel>Years of Experience</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="0" 
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
            {currentStep === 1 ? "Back to Welcome" : "Previous"}
          </Button>

          <Button
            onClick={handleNextStep}
            className="flex items-center gap-2"
            disabled={createProfileMutation.isPending}
          >
            {currentStep === totalSteps ? (
              createProfileMutation.isPending ? "Creating Profile..." : "Complete Profile"
            ) : (
              <>
                Next
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </section>
  );
} 