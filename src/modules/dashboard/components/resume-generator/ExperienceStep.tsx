import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Briefcase, 
  MapPin, 
  Calendar,
  Save,
  X,
  Sparkles,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '@/services/auth/hook';
import { useGetAllExperiences, useGetSeniorityLevels } from '@/services/experience/hook';
import { Experience } from '@/services/experience/types';
import { ResumeData } from '../../pages/ResumeGenerator';

interface ExperienceStepProps {
  data: ResumeData;
  onUpdate: (data: Partial<ResumeData>) => void;
  onNext: () => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export function ExperienceStep({ data, onUpdate, onNext, onPrevious, isFirstStep, isLastStep }: ExperienceStepProps) {
  const { user } = useAuth();
  const { data: seniorityLevels = [] } = useGetSeniorityLevels();
  const { data: userExperiences = [], isLoading: experiencesLoading } = useGetAllExperiences();
  
  const [editingItem, setEditingItem] = useState<Experience | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAutoFilled, setIsAutoFilled] = useState(false);

  const experiences = data.experience || [];

  const defaultExperience: Omit<Experience, 'id'> = {
    title: '',
    seniority_level: '',
    company: '',
    city: '',
    country: '',
    start_date: '',
    end_date: '',
    currently_working: false,
    description: '',
    is_volunteer: false,
    duration: ''
  };

  const handleAdd = () => {
    setEditingItem({
      id: crypto.randomUUID(),
      ...defaultExperience
    });
    setIsAutoFilled(false);
    setIsDialogOpen(true);
  };

  const handleEdit = (experience: Experience) => {
    setEditingItem(experience);
    setIsAutoFilled(false);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    const updatedExperiences = experiences.filter((exp: Experience) => exp.id !== id);
    onUpdate({ experience: updatedExperiences });
  };

  const handleSave = () => {
    if (!editingItem) return;

    const existingIndex = experiences.findIndex((exp: Experience) => exp.id === editingItem.id);
    let updatedExperiences;

    if (existingIndex >= 0) {
      // Update existing
      updatedExperiences = [...experiences];
      updatedExperiences[existingIndex] = editingItem;
    } else {
      // Add new
      updatedExperiences = [...experiences, editingItem];
    }

    onUpdate({ experience: updatedExperiences });
    setIsDialogOpen(false);
    setEditingItem(null);
    setIsAutoFilled(false);
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setEditingItem(null);
    setIsAutoFilled(false);
  };

  const updateEditingItem = (field: keyof Experience, value: any) => {
    if (!editingItem) return;
    setEditingItem({ ...editingItem, [field]: value });
  };

  // Auto-fill functionality - loads ALL user experiences
  const handleAutoFillAll = () => {
    if (userExperiences.length > 0) {
      // Load all user experiences into the resume builder
      onUpdate({ experience: [...experiences, ...userExperiences] });
      setIsAutoFilled(true);
    }
  };

  const formatDateRange = (exp: Experience) => {
    const startDate = exp.start_date ? new Date(exp.start_date + '-01').toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    }) : '';
    
    if (exp.currently_working) {
      return `${startDate} - Present`;
    }
    
    const endDate = exp.end_date ? new Date(exp.end_date + '-01').toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    }) : '';
    
    return `${startDate} - ${endDate}`;
  };

  const isFormValid = () => {
    if (!editingItem) return false;
    return editingItem.title && editingItem.company && editingItem.start_date;
  };

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

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Work Experience</h3>
          <p className="text-sm text-muted-foreground">
            Add your professional work experience, starting with the most recent.
          </p>
        </div>
        <div className="flex gap-2">
          {/* Auto-fill ALL experiences button */}
          <Button 
            onClick={handleAutoFillAll} 
            variant="outline"
            disabled={experiencesLoading || userExperiences.length === 0}
            className="gap-2"
          >
            {experiencesLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent" />
                Loading...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Auto-fill All ({userExperiences.length})
              </>
            )}
          </Button>
          <Button onClick={handleAdd} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Experience
          </Button>
        </div>
      </div>

      {/* Auto-fill success message */}
      {isAutoFilled && !isDialogOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
        >
          <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm">Successfully imported {userExperiences.length} experience(s) from your profile!</span>
          </div>
        </motion.div>
      )}

      {/* Experience List */}
      <div className="space-y-4">
        <AnimatePresence>
          {experiences.map((experience: Experience, index: number) => (
            <motion.div
              key={experience.id}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -20 }}
              layout
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Briefcase className="h-4 w-4 text-blue-600" />
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{experience.title}</h4>
                          {experience.is_volunteer && (
                            <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                              Volunteer
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{experience.company}</span>
                          {experience.seniority_level && (
                            <>
                              <span>•</span>
                              <span className="text-blue-600">{experience.seniority_level}</span>
                            </>
                          )}
                        </div>
                        {(experience.city || experience.country) && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {[experience.city, experience.country].filter(Boolean).join(', ')}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDateRange(experience)}
                        </div>
                        {experience.description && (
                          <p className="mt-2 text-sm leading-relaxed">
                            {experience.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(experience)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(experience.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {experiences.length === 0 && (
          <motion.div
            variants={itemVariants}
            className="text-center py-12 text-muted-foreground"
          >
            <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No work experience added yet.</p>
            <p className="text-sm">
              Click "Auto-fill All" to import from your profile or "Add Experience" to create new.
            </p>
          </motion.div>
        )}
      </div>

      {/* Edit/Add Dialog - Extra wide restructured layout */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[96vw] max-w-none max-h-[96vh] overflow-y-auto p-8">
          <DialogHeader className="pb-6">
            <DialogTitle className="text-2xl font-bold">
              {editingItem?.id && experiences.some((exp: Experience) => exp.id === editingItem.id) 
                ? 'Edit Work Experience' 
                : 'Add Work Experience'
              }
            </DialogTitle>
          </DialogHeader>
          
          {editingItem && (
            <div className="space-y-10">
              {/* Top Row - Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-3">
                  <Label htmlFor="title" className="text-sm font-semibold">Job Title *</Label>
                  <Input
                    id="title"
                    value={editingItem.title}
                    onChange={(e) => updateEditingItem('title', e.target.value)}
                    placeholder="e.g. Software Engineer"
                    className="h-12 text-base"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="company" className="text-sm font-semibold">Company *</Label>
                  <Input
                    id="company"
                    value={editingItem.company}
                    onChange={(e) => updateEditingItem('company', e.target.value)}
                    placeholder="e.g. Google"
                    className="h-12 text-base"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="seniority_level" className="text-sm font-semibold">Seniority Level</Label>
                  <Select 
                    value={editingItem.seniority_level} 
                    onValueChange={(value) => updateEditingItem('seniority_level', value)}
                  >
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue placeholder="Select seniority level" />
                    </SelectTrigger>
                    <SelectContent>
                      {seniorityLevels.map((level: string) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Second Row - Location & Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="space-y-3">
                  <Label htmlFor="city" className="text-sm font-semibold">City</Label>
                  <Input
                    id="city"
                    value={editingItem.city}
                    onChange={(e) => updateEditingItem('city', e.target.value)}
                    placeholder="e.g. San Francisco"
                    className="h-12 text-base"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="country" className="text-sm font-semibold">Country</Label>
                  <Input
                    id="country"
                    value={editingItem.country}
                    onChange={(e) => updateEditingItem('country', e.target.value)}
                    placeholder="e.g. United States"
                    className="h-12 text-base"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="start_date" className="text-sm font-semibold">Start Date *</Label>
                  <Input
                    id="start_date"
                    type="month"
                    value={editingItem.start_date}
                    onChange={(e) => updateEditingItem('start_date', e.target.value)}
                    className="h-12 text-base"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="end_date" className="text-sm font-semibold">End Date</Label>
                  <Input
                    id="end_date"
                    type="month"
                    value={editingItem.end_date}
                    onChange={(e) => updateEditingItem('end_date', e.target.value)}
                    disabled={editingItem.currently_working}
                    placeholder={editingItem.currently_working ? "Present" : ""}
                    className="h-12 text-base"
                  />
                </div>
              </div>

              {/* Third Row - Employment Type */}
              <div className="space-y-6">
                <Label className="text-sm font-semibold">Employment Type</Label>
                <div className="flex flex-wrap gap-8">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="currently_working"
                      checked={editingItem.currently_working}
                      onCheckedChange={(checked) => {
                        updateEditingItem('currently_working', checked);
                        if (checked) {
                          updateEditingItem('end_date', '');
                        }
                      }}
                    />
                    <Label htmlFor="currently_working" className="text-base">I currently work here</Label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="is_volunteer"
                      checked={editingItem.is_volunteer}
                      onCheckedChange={(checked) => updateEditingItem('is_volunteer', checked)}
                    />
                    <Label htmlFor="is_volunteer" className="text-base">This is volunteer work</Label>
                  </div>
                </div>
              </div>

              {/* Fourth Row - Description - Full Width */}
              <div className="space-y-4">
                <Label htmlFor="description" className="text-sm font-semibold">Job Description & Achievements</Label>
                <Textarea
                  id="description"
                  value={editingItem.description}
                  onChange={(e) => updateEditingItem('description', e.target.value)}
                  placeholder="• Led a team of 5 developers to build a customer portal that increased user engagement by 40%&#10;• Developed microservices architecture reducing system downtime from 2% to 0.1%&#10;• Implemented automated testing pipeline reducing deployment time by 60%&#10;• Collaborated with design team to improve user experience"
                  rows={6}
                  className="min-h-[140px] resize-none text-base"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-8 border-t border-gray-200 dark:border-gray-700">
                <div className="text-sm text-muted-foreground">
                  {isFormValid() ? (
                    <span className="text-green-600 font-medium">✓ Ready to save</span>
                  ) : (
                    <span>Please fill in required fields (Job Title, Company, Start Date)</span>
                  )}
                </div>
                <div className="flex gap-4">
                  <Button variant="outline" onClick={handleCancel} className="h-12 px-8 text-base">
                    <X className="h-5 w-5 mr-2" />
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSave}
                    disabled={!isFormValid()}
                    className="bg-blue-600 hover:bg-blue-700 h-12 px-8 text-base"
                  >
                    <Save className="h-5 w-5 mr-2" />
                    {editingItem?.id && experiences.some((exp: Experience) => exp.id === editingItem.id) 
                      ? 'Update Experience' 
                      : 'Save Experience'
                    }
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={isFirstStep}
        >
          Previous
        </Button>
        <Button onClick={onNext}>
          Next: Education
        </Button>
      </div>
    </motion.div>
  );
} 