import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Briefcase, 
  MapPin, 
  Calendar,
  Edit2,
  Save,
  X,
  Loader2,
  Plus,
  Trash2,
  Building
} from 'lucide-react';
import { 
  useGetSeniorityLevels,
  useGetWorkTypes,
  useGetWorkModels,
  useGetAllExperiences,
  useAddExperiences,
  useUpdateExperience,
  useDeleteExperience
} from '@/services/experience/hook';
import { Experience } from '@/services/experience/types';
import { extractApiErrorMessage } from '@/utils/error-utils';
import { normalizeMonthValue } from '@/utils/date';

interface AccountExperienceSectionProps {
  data: any;
  onDataUpdate: () => void;
}

export function AccountExperienceSection({ data, onDataUpdate }: AccountExperienceSectionProps) {
  const { data: seniorityLevels = [] } = useGetSeniorityLevels();
  const { data: workTypes = [] } = useGetWorkTypes();
  const { data: workModels = [] } = useGetWorkModels();
  const { data: experiencesData = [], isLoading } = useGetAllExperiences();
  const addExperiencesMutation = useAddExperiences();
  const updateExperienceMutation = useUpdateExperience();
  const deleteExperienceMutation = useDeleteExperience();
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<Experience | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  
  // State for interactive bullet points
  const [bulletPoints, setBulletPoints] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState<string>('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState<string>('');

  // Validation helper
  const validateExperience = (exp: Experience | null): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (!exp) {
      errors.push('Experience data is required');
      return { isValid: false, errors };
    }
    
    if (!exp.title?.trim()) {
      errors.push('Job title is required');
    }
    
    if (!exp.company?.trim()) {
      errors.push('Company name is required');
    }
    
    if (!exp.seniority_level?.trim()) {
      errors.push('Seniority level is required');
    }
    
    if (!exp.start_date?.trim()) {
      errors.push('Start date is required');
    }
    
    if (exp.currently_working === undefined || exp.currently_working === null) {
      errors.push('Please specify if you are currently working here');
    }
    
    if (!exp.currently_working && !exp.end_date?.trim()) {
      errors.push('End date is required when not currently working');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };

  // Prevent selecting a future month for end date
  const maxMonth = new Date().toISOString().slice(0, 7);

  // Prefer React Query data; fallback to provided data for initial render
  // Normalize dates for month inputs (convert YYYY-MM-DD to YYYY-MM)
  const experiences = (experiencesData && Array.isArray(experiencesData)) 
    ? experiencesData 
    : (data?.experience?.career || []).map((exp: any) => ({
        ...exp,
        start_date: normalizeMonthValue(exp.start_date || exp.startDate || ''),
        end_date: normalizeMonthValue(exp.end_date || exp.endDate || ''),
        city: exp.location?.city || exp.city || '',
        country: exp.location?.country || exp.country || ''
      }));

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
    work_type: '',
    work_model: '',
    duration: ''
  };

  const handleAdd = () => {
    setEditingItem({
      id: crypto.randomUUID(),
      ...defaultExperience
    });
    setBulletPoints([]);
    setCurrentInput('');
    setEditingIndex(null);
    setEditingValue('');
    setIsDialogOpen(true);
  };

  const handleEdit = (experience: Experience) => {
    // Ensure dates are normalized to YYYY-MM format for month inputs
    setEditingItem({
      ...experience,
      start_date: normalizeMonthValue(experience.start_date),
      end_date: normalizeMonthValue(experience.end_date)
    });
    // Convert description string to bullet points array
    const points = experience.description 
      ? experience.description.split('\n').filter(line => line.trim())
      : [];
    setBulletPoints(points);
    setCurrentInput('');
    setEditingIndex(null);
    setEditingValue('');
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteExperienceMutation.mutateAsync(id);
    } catch (err: any) {
      const detail = err?.response?.data?.detail;
      const message = typeof detail === 'string' ? detail : 'Failed to delete experience.';
      setError(message);
    }
  };

  const handleSave = async () => {
    if (!editingItem) return;
    
    setSaving(true);
    setError(null);
    setValidationErrors([]);
    
    // Convert bullet points array to description string
    const descriptionString = bulletPoints.join('\n');
    const itemWithDescription = {
      ...editingItem,
      description: descriptionString
    };
    
    // Client-side validation
    const validation = validateExperience(itemWithDescription);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      setError(validation.errors.join('; '));
      setSaving(false);
      return;
    }
    
    try {
      // Normalize month inputs (YYYY-MM) to full dates (YYYY-MM-DD)
      const toIsoDate = (monthValue: string | undefined | null) => {
        if (!monthValue) return undefined;
        return monthValue.length === 7 ? `${monthValue}-01` : monthValue;
      };

      const normalizedStart = toIsoDate(itemWithDescription.start_date) as string;
      const normalizedEnd = itemWithDescription.currently_working ? undefined : toIsoDate(itemWithDescription.end_date);

      if (itemWithDescription.id && experiences.some((exp: Experience) => exp.id === itemWithDescription.id)) {
        // Update existing
        await updateExperienceMutation.mutateAsync({
          experienceId: itemWithDescription.id,
          updateData: {
            title: itemWithDescription.title,
            seniority_level: itemWithDescription.seniority_level,
            company: itemWithDescription.company,
            location: (itemWithDescription.city || itemWithDescription.country) ? {
              city: itemWithDescription.city,
              country: itemWithDescription.country
            } : undefined,
            start_date: normalizedStart,
            end_date: normalizedEnd,
            currently_working: itemWithDescription.currently_working,
            description: descriptionString.trim() || '', // Send empty string for clearing, backend will normalize to null
            is_volunteer: itemWithDescription.is_volunteer,
            work_type: itemWithDescription.work_type || undefined,
            work_model: itemWithDescription.work_model || undefined,
          }
        });
      } else {
        // Create new (mutation accepts array of one item)
        const normalizedItem: Experience = {
          ...itemWithDescription,
          start_date: normalizedStart,
          end_date: normalizedEnd || '',
          description: descriptionString
        } as Experience;
        await addExperiencesMutation.mutateAsync([normalizedItem]);
      }

      setIsDialogOpen(false);
      setEditingItem(null);
      setBulletPoints([]);
      setCurrentInput('');
      setEditingIndex(null);
      setEditingValue('');
      setValidationErrors([]);
    } catch (err: any) {
      // Use shared error utility
      const errorMessage = extractApiErrorMessage(
        err,
        'Failed to save experience. Please try again.'
      );
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setEditingItem(null);
    setBulletPoints([]);
    setCurrentInput('');
    setEditingIndex(null);
    setEditingValue('');
    setError(null);
    setValidationErrors([]);
  };

  const updateEditingItem = (field: keyof Experience, value: any) => {
    if (!editingItem) return;
    setEditingItem({ ...editingItem, [field]: value });
  };

  // Bullet point handlers
  const handleAddBulletPoint = () => {
    if (currentInput.trim()) {
      setBulletPoints([...bulletPoints, currentInput.trim()]);
      setCurrentInput('');
    }
  };

  const handleEditBulletPoint = (index: number) => {
    setEditingIndex(index);
    setEditingValue(bulletPoints[index]);
  };

  const handleSaveEdit = (index: number) => {
    if (editingValue.trim()) {
      const updated = [...bulletPoints];
      updated[index] = editingValue.trim();
      setBulletPoints(updated);
    }
    setEditingIndex(null);
    setEditingValue('');
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingValue('');
  };

  const handleDeleteBulletPoint = (index: number) => {
    setBulletPoints(bulletPoints.filter((_, i) => i !== index));
  };

  const toDisplayMonth = (value: string | undefined | null) => {
    const month = normalizeMonthValue(value);
    if (!month) return '';
    const d = new Date(month + '-01');
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  const formatDateRange = (exp: Experience) => {
    const startDate = toDisplayMonth(exp.start_date);
    if (exp.currently_working) return `${startDate} - Present`;
    const endDate = toDisplayMonth(exp.end_date);
    return `${startDate} - ${endDate}`;
  };

  return (
    <div className="w-full border-b border-gray-200 dark:border-gray-700 pb-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Briefcase className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold">Work Experience</h2>
        </div>
        <Button 
          variant="outline" 
          onClick={handleAdd}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Experience
        </Button>
      </div>

      {/* Display Mode */}
      {!isEditing && (
        <div className="space-y-6">
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">
              Loading experiences...
            </div>
          ) : experiences.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No work experience added yet.</p>
              <p className="text-sm">Click "Add Experience" to get started.</p>
            </div>
          ) : (
            experiences.map((experience: Experience) => (
              <div key={experience.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Building className="h-4 w-4 text-blue-600" />
                      <h3 className="text-lg font-semibold">{experience.title}</h3>
                      {experience.is_volunteer && (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                          Volunteer
                        </span>
                      )}
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
                      {(experience.work_type || experience.work_model) && (
                        <div className="flex items-center gap-2 text-xs mt-1">
                          {experience.work_type && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                              {experience.work_type}
                            </span>
                          )}
                          {experience.work_model && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full">
                              {experience.work_model}
                            </span>
                          )}
                        </div>
                      )}
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
                        <p className="mt-3 text-sm leading-relaxed">
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
              </div>
            ))
          )}
        </div>
      )}

      {/* Edit/Add Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[98vw] max-w-none max-h-[98vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {editingItem?.id && experiences.some((exp: Experience) => exp.id === editingItem.id) 
                ? 'Edit Work Experience' 
                : 'Add Work Experience'
              }
            </DialogTitle>
          </DialogHeader>
          
          {editingItem && (
            <div className="space-y-8 py-4">
              {/* Top Row - Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  <Label htmlFor="seniority_level" className="text-sm font-semibold">Seniority Level *</Label>
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

              {/* Second Row - Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              </div>

              {/* Work Type and Work Model Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="work_type" className="text-sm font-semibold">Work Type</Label>
                  <Select 
                    value={editingItem.work_type || 'none'} 
                    onValueChange={(value) => updateEditingItem('work_type', value === 'none' ? '' : value)}
                  >
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue placeholder="Select work type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {workTypes.map((type: string) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="work_model" className="text-sm font-semibold">Work Model</Label>
                  <Select 
                    value={editingItem.work_model || 'none'} 
                    onValueChange={(value) => updateEditingItem('work_model', value === 'none' ? '' : value)}
                  >
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue placeholder="Select work model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {workModels.map((model: string) => (
                        <SelectItem key={model} value={model}>
                          {model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Third Row - Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="start_date" className="text-sm font-semibold">Start Date *</Label>
                  <Input
                    id="start_date"
                    type="month"
                    value={normalizeMonthValue(editingItem.start_date)}
                    onChange={(e) => updateEditingItem('start_date', e.target.value)}
                    className="h-12 text-base"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="end_date" className="text-sm font-semibold">End Date</Label>
                  <Input
                    id="end_date"
                    type="month"
                    value={normalizeMonthValue(editingItem.end_date)}
                    onChange={(e) => updateEditingItem('end_date', e.target.value)}
                    max={maxMonth}
                    disabled={editingItem.currently_working}
                    placeholder={editingItem.currently_working ? "Present" : ""}
                    className="h-12 text-base"
                  />
                </div>
              </div>

              {/* Fourth Row - Employment Type */}
              <div className="space-y-4">
                <Label className="text-sm font-semibold">Employment Type</Label>
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="currently_working"
                      checked={!!editingItem.currently_working}
                      onCheckedChange={(checked) => {
                        const isChecked = checked === true;
                        if (editingItem) {
                          setEditingItem({
                            ...editingItem,
                            currently_working: isChecked,
                            end_date: isChecked ? '' : editingItem.end_date
                          });
                        }
                      }}
                    />
                    <Label htmlFor="currently_working" className="text-base">I currently work here</Label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="is_volunteer"
                      checked={!!editingItem.is_volunteer}
                      onCheckedChange={(checked) => updateEditingItem('is_volunteer', checked === true)}
                    />
                    <Label htmlFor="is_volunteer" className="text-base">This is volunteer work</Label>
                  </div>
                </div>
              </div>

              {/* Fifth Row - Description - Full Width */}
              <div className="space-y-4">
                <Label htmlFor="description" className="text-sm font-semibold">Job Description & Achievements</Label>
                <div className="space-y-2 border rounded-md p-4 min-h-[200px]">
                  {/* Existing bullet points */}
                  {bulletPoints.map((point, index) => (
                    <div key={index} className="flex items-center gap-2 group">
                      <span className="text-muted-foreground flex-shrink-0">•</span>
                      {editingIndex === index ? (
                        <div className="flex-1 flex items-center gap-2">
                          <Input
                            value={editingValue}
                            onChange={(e) => setEditingValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleSaveEdit(index);
                              } else if (e.key === 'Escape') {
                                handleCancelEdit();
                              }
                            }}
                            className="flex-1 h-9 text-base"
                            autoFocus
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSaveEdit(index)}
                            className="h-9 px-2"
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleCancelEdit}
                            className="h-9 px-2"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <span className="flex-1 text-base">{point}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditBulletPoint(index)}
                            className="h-8 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteBulletPoint(index)}
                            className="h-8 px-2 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  ))}
                  
                  {/* Add new input */}
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground flex-shrink-0">•</span>
                    <Input
                      id="description-input"
                      value={currentInput}
                      onChange={(e) => setCurrentInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddBulletPoint();
                        }
                      }}
                      placeholder="Type a bullet point and press Enter..."
                      className="flex-1 h-9 text-base"
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Press Enter to add a bullet point. Hover over existing items to edit or delete.
                </p>
              </div>
            </div>
          )}

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
              disabled={saving || !editingItem?.title?.trim() || !editingItem?.company?.trim() || !editingItem?.seniority_level?.trim() || !editingItem?.start_date?.trim()}
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
                  {editingItem?.id && experiences.some((exp: Experience) => exp.id === editingItem.id) 
                    ? 'Update Experience' 
                    : 'Save Experience'
                  }
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 