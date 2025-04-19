import { motion } from "framer-motion";
import { useState } from "react";
// import { useForm } from "react-hook-form"; // Keep form for now
// import { zodResolver } from "@hookform/resolvers/zod"; // Keep form for now
// import * as z from "zod"; // Keep form for now
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
// import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"; // Keep form for now
// import { Input } from "@/components/ui/input"; // Keep form for now
// import { Textarea } from "@/components/ui/textarea"; // Keep form for now
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Keep form for now
// import { useCreateUserProfile } from "@/services/user_profile/hook"; // Commented out
// import { UserProfileData } from "@/services/user_profile/types"; // Commented out

// Define the form schema using Zod
// const profileFormSchema = z.object({ ... }); // Keep form schema commented for now if form is kept active

// type ProfileFormValues = z.infer<typeof profileFormSchema>; // Keep commented

export function Profile() {
  console.log("Rendering Profile component...");
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate(); // Initialize navigate
  // const { mutate: createUserProfileMutate, isPending } = useCreateUserProfile(); // Commented out
  const isPending = false; // Mock isPending

  // Initialize react-hook-form - Keep form active for now to see if it's the cause
  // const form = useForm<ProfileFormValues>({ ... }); 

  // Handle form submission - Commented out related logic
  // function onSubmit(data: ProfileFormValues) { ... }

  // Handle step navigation - Keep navigation logic, remove validation/submission call
  const handleNextStep = async () => {
    //   let fieldsToValidate: (keyof ProfileFormValues)[] = [];
    //   if (currentStep === 1) { ... }
    //   const isValid = await form.trigger(fieldsToValidate);
    //   if (isValid) {
            if (currentStep < 2) { 
                setCurrentStep(currentStep + 1);
            } else {
                // If it's the last step, just navigate for testing
                console.log("Would submit form here...");
                // form.handleSubmit(onSubmit)(); // Commented out
                 navigate("/dashboard"); // Navigate directly for testing
            }
    //   }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Calculate progress based on current step
  const totalSteps = 2; // Define total steps
  const progressValue = (currentStep / totalSteps) * 100;

  return (
    <section className="relative overflow-hidden bg-background py-20 md:py-32 min-h-screen flex items-center">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 opacity-50" />
      
      {/* Content */}
      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto">
          <motion.div 
            key={currentStep} // Keep key for animation
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* Header section - Keep */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold">
                  <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                    Personal Profile
                  </span>
                </h1>
                <p className="text-muted-foreground mt-2">
                  {currentStep === 1
                    ? "Let's add your personal information"
                    : "Tell us about your current professional situation"}
                </p>
              </div>
              <div className="flex items-center space-x-1 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                <p className="text-blue-600 dark:text-blue-300 text-sm font-medium">Step {currentStep} of 2</p>
              </div>
            </div>

            {/* Progress bar - Keep */}
            <div>
              <Progress value={progressValue} className="h-2" />
            </div>

            <Card className="border-2 border-blue-100 dark:border-blue-900/30">
              <CardHeader>
                <CardTitle>{currentStep === 1 ? "Personal Information" : "Current Situation"}</CardTitle>
                <CardDescription>
                  This information will be used in your resume. You can edit it anytime.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Mock Form Content - Replace the actual form */}
                <div className="space-y-6">
                  {currentStep === 1 && (
                    <p>Step 1 Form Content (Placeholder)</p>
                  )}
                  {currentStep === 2 && (
                    <p>Step 2 Form Content (Placeholder)</p>
                  )}
                </div>

                {/* Keep Buttons */}
                <div className="mt-8 flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePreviousStep}
                    disabled={currentStep === 1}
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={handleNextStep}
                    disabled={isPending && currentStep === 2} // Uses mocked isPending
                  >
                    {isPending && currentStep === 2 ? 'Saving...' : (currentStep === 2 ? 'Finish' : 'Continue')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 