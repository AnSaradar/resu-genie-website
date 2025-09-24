import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  GraduationCap, 
  Calendar,
  Edit2,
  Save,
  X,
  Loader2,
  Plus,
  Trash2,
  BookOpen
} from 'lucide-react';
import { 
  useGetDegreeTypes, 
  useGetAllEducations,
  useAddEducations,
  useUpdateEducation,
  useDeleteEducation
} from '@/services/education/hook';
import { Education } from '@/services/education/types';

interface AccountEducationSectionProps {
  data: any;
  onDataUpdate: () => void;
}

export function AccountEducationSection({ data, onDataUpdate }: AccountEducationSectionProps) {
  const { data: degreeTypes = [] } = useGetDegreeTypes();
  const { data: educationsData = [], isLoading } = useGetAllEducations();
  const addEducationsMutation = useAddEducations();
  const updateEducationMutation = useUpdateEducation();
  const deleteEducationMutation = useDeleteEducation();
  const [editingItem, setEditingItem] = useState<Education | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Prefer React Query data; fallback to provided data for initial render
  const educations = (educationsData && Array.isArray(educationsData)) ? educationsData : (data?.education || []);

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
    setIsDialogOpen(true);
  };

  const handleEdit = (education: Education) => {
    setEditingItem(education);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteEducationMutation.mutateAsync(id);
    } catch (err: any) {
      const detail = err?.response?.data?.detail;
      const message = typeof detail === 'string' ? detail : 'Failed to delete education.';
      setError(message);
    }
  };

  const handleSave = async () => {
    if (!editingItem) return;
    
    setSaving(true);
    setError(null);
    
    try {
      // Normalize month inputs (YYYY-MM) to full dates (YYYY-MM-DD)
      const toIsoDate = (monthValue: string | undefined | null) => {
        if (!monthValue) return undefined;
        return monthValue.length === 7 ? `${monthValue}-01` : monthValue;
      };

      const normalizedStart = toIsoDate(editingItem.start_date) as string;
      const normalizedEnd = editingItem.currently_studying ? undefined : toIsoDate(editingItem.end_date);

      if (editingItem.id && educations.some((edu: Education) => edu.id === editingItem.id)) {
        // Update existing (send only fields that may have changed)
        await updateEducationMutation.mutateAsync({
          educationId: editingItem.id,
          updateData: {
            institution: editingItem.institution,
            degree: editingItem.degree,
            field: editingItem.field,
            start_date: normalizedStart,
            end_date: normalizedEnd,
            currently_studying: editingItem.currently_studying,
            description: editingItem.description || undefined,
          }
        });
      } else {
        // Create new (mutation accepts array of one item)
        const normalizedItem: Education = {
          ...editingItem,
          start_date: normalizedStart,
          end_date: normalizedEnd || '',
          description: editingItem.description || ''
        } as Education;
        await addEducationsMutation.mutateAsync([normalizedItem]);
      }

      setIsDialogOpen(false);
      setEditingItem(null);
    } catch (err: any) {
      // Robustly extract error message; FastAPI 422 returns detail as array of objects
      const detail = err?.response?.data?.detail;
      let message = 'Failed to save education.';
      if (typeof detail === 'string') {
        message = detail;
      } else if (Array.isArray(detail)) {
        message = detail.map((d: any) => d?.msg || JSON.stringify(d)).join(' | ');
      } else if (detail && typeof detail === 'object') {
        message = detail.msg || JSON.stringify(detail);
      } else if (err?.message) {
        message = err.message;
      }
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setEditingItem(null);
    setError(null);
  };

  const updateEditingItem = (field: keyof Education, value: any) => {
    if (!editingItem) return;
    setEditingItem({ ...editingItem, [field]: value });
  };

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

  return (
    <div className="w-full border-b border-gray-200 dark:border-gray-700 pb-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <GraduationCap className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold">Education</h2>
        </div>
        <Button 
          variant="outline" 
          onClick={handleAdd}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Education
        </Button>
      </div>

      {/* Display Mode */}
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">
          Loading education...
        </div>
      ) : (
      <div className="space-y-6">
        {educations.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No education added yet.</p>
            <p className="text-sm">Click "Add Education" to get started.</p>
          </div>
        ) : (
          educations.map((education: Education) => (
            <div key={education.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="h-4 w-4 text-blue-600" />
                    <h3 className="text-lg font-semibold">{education.degree}</h3>
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
                      <p className="mt-3 text-sm leading-relaxed">
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
              {editingItem?.id && educations.some((edu: Education) => edu.id === editingItem.id) 
                ? 'Edit Education' 
                : 'Add Education'
              }
            </DialogTitle>
          </DialogHeader>
          
          {editingItem && (
            <div className="space-y-8 py-4">
              {/* Institution */}
              <div className="space-y-3">
                <Label htmlFor="institution" className="text-sm font-semibold">Institution *</Label>
                <Input
                  id="institution"
                  value={editingItem.institution}
                  onChange={(e) => updateEditingItem('institution', e.target.value)}
                  placeholder="e.g. Stanford University"
                  className="h-12 text-base"
                />
              </div>

              {/* Degree and Field */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="degree" className="text-sm font-semibold">Degree Type *</Label>
                  <Select
                    value={editingItem.degree}
                    onValueChange={(value) => updateEditingItem('degree', value)}
                  >
                    <SelectTrigger className="h-12 text-base">
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
                <div className="space-y-3">
                  <Label htmlFor="field" className="text-sm font-semibold">Field of Study *</Label>
                  <Input
                    id="field"
                    value={editingItem.field}
                    onChange={(e) => updateEditingItem('field', e.target.value)}
                    placeholder="e.g. Computer Science"
                    className="h-12 text-base"
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    disabled={editingItem.currently_studying}
                    className="h-12 text-base"
                  />
                </div>
              </div>

              {/* Currently Studying */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="currently_studying"
                    checked={editingItem.currently_studying}
                    onCheckedChange={(checked) => updateEditingItem('currently_studying', checked)}
                  />
                  <Label htmlFor="currently_studying" className="text-base">I'm currently studying here</Label>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <Label htmlFor="description" className="text-sm font-semibold">Description</Label>
                <Textarea
                  id="description"
                  value={editingItem.description}
                  onChange={(e) => updateEditingItem('description', e.target.value)}
                  placeholder="Describe relevant coursework, thesis, or special programs..."
                  rows={4}
                  className="text-base"
                />
              </div>
            </div>
          )}

          {error && (
            <div className="text-red-600 text-sm mb-4 p-3 bg-red-50 border border-red-200 rounded">
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
              disabled={saving || !editingItem?.institution || !editingItem?.degree || !editingItem?.field || !editingItem?.start_date}
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
                  {editingItem?.id && educations.some((edu: Education) => edu.id === editingItem.id) 
                    ? 'Update Education' 
                    : 'Save Education'
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