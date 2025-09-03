import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  GraduationCap, 
  Calendar,
  Save,
  X,
  BookOpen,
  Sparkles,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

import { useGetAllEducations, useGetDegreeTypes } from '@/services/education/hook';
import { Education as EducationServiceType } from '@/services/education/types';
import { ResumeData } from '../../pages/ResumeGenerator';

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  start_date: string;
  end_date: string;
  currently_studying: boolean;
  description?: string;
}

interface EducationStepProps {
  data: ResumeData;
  onUpdate: (data: Partial<ResumeData>) => void;
  onNext: () => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

// Helper function to format date range
const formatDateRange = (edu: Education) => {
  const startDate = edu.start_date ? new Date(edu.start_date + '-01').toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short' 
  }) : '';
  
  if (edu.currently_studying) {
    return `${startDate} - Present`;
  }
  
  const endDate = edu.end_date ? new Date(edu.end_date + '-01').toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short' 
  }) : '';
  
  return `${startDate} - ${endDate}`;
};

export function EducationStep({ data, onUpdate, onNext, onPrevious, isFirstStep, isLastStep }: EducationStepProps) {
  const { data: degreeTypes = [] } = useGetDegreeTypes();
  const { data: userEducations = [], isLoading: educationsLoading } = useGetAllEducations();
  
  const [editingItem, setEditingItem] = useState<Education | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAutoFilled, setIsAutoFilled] = useState(false);

  const educations = data.education || [];

  // Sync with updated data prop (for edit mode)
  useEffect(() => {
    if (data.education && data.education.length > 0) {
      // Data is already synced via the educations variable
      // This effect ensures we're aware of data changes
    }
  }, [data.education]);

  const defaultEducation: Omit<Education, 'id'> = {
    institution: '',
    degree: '',
    field: '',
    start_date: '',
    end_date: '',
    currently_studying: false,
    description: ''
  };

  const handleAdd = () => {
    setEditingItem({
      id: crypto.randomUUID(),
      ...defaultEducation
    });
    setIsAutoFilled(false);
    setIsDialogOpen(true);
  };

  const handleEdit = (education: Education) => {
    setEditingItem(education);
    setIsAutoFilled(false);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    const updatedEducations = educations.filter((edu: Education) => edu.id !== id);
    onUpdate({ education: updatedEducations });
  };

  const handleSave = () => {
    if (!editingItem) return;

    const existingIndex = educations.findIndex((edu: Education) => edu.id === editingItem.id);
    let updatedEducations;

    if (existingIndex >= 0) {
      // Update existing
      updatedEducations = [...educations];
      updatedEducations[existingIndex] = editingItem;
    } else {
      // Add new
      updatedEducations = [...educations, editingItem];
    }

    onUpdate({ education: updatedEducations });
    setIsDialogOpen(false);
    setEditingItem(null);
    setIsAutoFilled(false);
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setEditingItem(null);
    setIsAutoFilled(false);
  };

  // Auto-fill functionality - loads ALL user education entries
  const handleAutoFillAll = () => {
    if (userEducations.length > 0) {
      // Convert service education type to local education interface
      const convertedEducations: Education[] = userEducations.map((edu: EducationServiceType) => ({
        id: edu.id,
        institution: edu.institution,
        degree: edu.degree,
        field: edu.field,
        start_date: edu.start_date,
        end_date: edu.end_date || '',
        currently_studying: edu.currently_studying,
        description: edu.description || ''
      }));
      
      // Load all user education entries into the resume builder
      onUpdate({ education: [...educations, ...convertedEducations] });
      setIsAutoFilled(true);
    }
  };

  const updateEditingItem = (field: keyof Education, value: any) => {
    if (!editingItem) return;
    setEditingItem({ ...editingItem, [field]: value });
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
          <h3 className="text-lg font-semibold">Education</h3>
          <p className="text-sm text-muted-foreground">
            Add your educational background, starting with the most recent.
          </p>
        </div>
        <div className="flex gap-2">
          {/* Auto-fill ALL education entries button */}
          <Button 
            onClick={handleAutoFillAll} 
            variant="outline"
            disabled={educationsLoading || userEducations.length === 0}
            className="gap-2"
          >
            {educationsLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent" />
                Loading...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Auto-fill All ({userEducations.length})
              </>
            )}
          </Button>
          <Button onClick={handleAdd} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Education
          </Button>
        </div>
      </div>

      {/* Education List */}
      <div className="space-y-4">
        <AnimatePresence>
          {educations.map((education: Education, index: number) => (
            <motion.div
              key={education.id}
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
                        <GraduationCap className="h-4 w-4 text-blue-600" />
                        <h4 className="font-semibold">{education.degree}</h4>
                        {education.field && (
                          <>
                            <span className="text-muted-foreground">in</span>
                            <span className="font-medium">{education.field}</span>
                          </>
                        )}
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{education.institution}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDateRange(education)}
                        </div>
                        {education.description && (
                          <p className="mt-2 text-sm leading-relaxed">
                            {education.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(education)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(education.id)}
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

        {educations.length === 0 && (
          <motion.div
            variants={itemVariants}
            className="text-center py-12 text-muted-foreground"
          >
            <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No education added yet.</p>
            <p className="text-sm">Click "Add Education" to get started{userEducations.length > 0 ? ' or use "Auto-fill All" to load your saved education entries' : ''}.</p>
          </motion.div>
        )}

        {/* Auto-fill success indicator */}
        {isAutoFilled && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700"
          >
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm">Successfully auto-filled {userEducations.length} education entr{userEducations.length > 1 ? 'ies' : 'y'} from your profile!</span>
          </motion.div>
        )}
      </div>

      {/* Edit/Add Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingItem?.id && educations.some((edu: Education) => edu.id === editingItem.id) 
                ? 'Edit Education' 
                : 'Add Education'
              }
            </DialogTitle>
          </DialogHeader>
          
          {editingItem && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="institution">Institution *</Label>
                <Input
                  id="institution"
                  value={editingItem.institution}
                  onChange={(e) => updateEditingItem('institution', e.target.value)}
                  placeholder="e.g. Stanford University"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="degree">Degree Type *</Label>
                  <Select
                    value={editingItem.degree}
                    onValueChange={(value) => updateEditingItem('degree', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select degree type" />
                    </SelectTrigger>
                    <SelectContent>
                      {degreeTypes.map((degree: string) => (
                        <SelectItem key={degree} value={degree}>
                          {degree}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="field">Field of Study *</Label>
                  <Input
                    id="field"
                    value={editingItem.field}
                    onChange={(e) => updateEditingItem('field', e.target.value)}
                    placeholder="e.g. Computer Science"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date *</Label>
                  <Input
                    id="start_date"
                    type="month"
                    value={editingItem.start_date}
                    onChange={(e) => updateEditingItem('start_date', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    type="month"
                    value={editingItem.end_date}
                    onChange={(e) => updateEditingItem('end_date', e.target.value)}
                    disabled={editingItem.currently_studying}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="currently_studying"
                  checked={editingItem.currently_studying}
                  onChange={(e) => updateEditingItem('currently_studying', e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="currently_studying">I'm currently studying here</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editingItem.description}
                  onChange={(e) => updateEditingItem('description', e.target.value)}
                  placeholder="Describe relevant coursework, thesis, or special programs..."
                  rows={4}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave}
                  disabled={!editingItem.institution || !editingItem.degree || !editingItem.field || !editingItem.start_date}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Education
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Navigation handled by StepNavigation component */}
    </motion.div>
  );
} 