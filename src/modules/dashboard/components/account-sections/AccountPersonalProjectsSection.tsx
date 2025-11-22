import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Code, 
  Calendar,
  ExternalLink,
  Target,
  Edit2,
  Save,
  X,
  Loader2,
  Plus,
  Trash2
} from 'lucide-react';
import { 
  useGetAllPersonalProjects,
  useAddPersonalProjects,
  useUpdatePersonalProject,
  useDeletePersonalProject
} from '@/services/personal_project/hook';
import { PersonalProject as PersonalProjectType } from '@/services/personal_project/types';
import { extractApiErrorMessage } from '@/utils/error-utils';

interface PersonalProject {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  startDate: string;
  endDate: string;
  isOngoing: boolean;
  liveUrl?: string;
  projectUrl?: string;
  achievements?: string;
}

interface AccountPersonalProjectsSectionProps {
  data: any;
  onDataUpdate: () => void;
}

export function AccountPersonalProjectsSection({ data, onDataUpdate }: AccountPersonalProjectsSectionProps) {
  const { data: projectsData = [], isLoading } = useGetAllPersonalProjects();
  const addPersonalProjectsMutation = useAddPersonalProjects();
  const updatePersonalProjectMutation = useUpdatePersonalProject();
  const deletePersonalProjectMutation = useDeletePersonalProject();
  const [editingItem, setEditingItem] = useState<PersonalProject | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [techInput, setTechInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Validation helper
  const validateProject = (project: PersonalProject | null): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (!project) {
      errors.push('Project data is required');
      return { isValid: false, errors };
    }
    
    if (!project.name?.trim()) {
      errors.push('Project name is required');
    }
    
    if (!project.description?.trim()) {
      errors.push('Project description is required');
    }
    
    if (!project.startDate?.trim()) {
      errors.push('Start date is required');
    }
    
    if (!project.isOngoing && !project.endDate?.trim()) {
      errors.push('End date is required when project is not ongoing');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };

  // Prefer React Query data; fallback to provided data for initial render
  const projects = (projectsData && Array.isArray(projectsData)) ? projectsData : (data?.personal_projects || []);

  const emptyProject: PersonalProject = {
    id: '',
    name: '',
    description: '',
    technologies: [],
    startDate: '',
    endDate: '',
    isOngoing: false,
    liveUrl: '',
    projectUrl: '',
    achievements: ''
  };

  const handleAdd = () => {
    setEditingItem({
      ...emptyProject,
      id: crypto.randomUUID()
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (project: PersonalProject) => {
    setEditingItem(project);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePersonalProjectMutation.mutateAsync(id);
    } catch (err: any) {
      const detail = err?.response?.data?.detail;
      const message = typeof detail === 'string' ? detail : 'Failed to delete project.';
      setError(message);
    }
  };

  const handleSave = async () => {
    if (!editingItem) return;
    
    setSaving(true);
    setError(null);
    setValidationErrors([]);
    
    // Client-side validation
    const validation = validateProject(editingItem);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      setError(validation.errors.join('; '));
      setSaving(false);
      return;
    }
    
    try {
      if (editingItem.id && projects.some((proj: PersonalProject) => proj.id === editingItem.id)) {
        // Update existing
        await updatePersonalProjectMutation.mutateAsync({
          projectId: editingItem.id,
          updateData: {
            title: editingItem.name,
            description: editingItem.description,
            technologies: editingItem.technologies,
            start_date: editingItem.startDate,
            end_date: editingItem.endDate || undefined,
            is_ongoing: editingItem.isOngoing,
            live_url: editingItem.liveUrl || undefined,
            project_url: editingItem.projectUrl || undefined,
          }
        });
      } else {
        // Create new (mutation accepts array of one item)
        const projectToAdd: PersonalProjectType = {
          id: editingItem.id,
          title: editingItem.name,
          description: editingItem.description,
          technologies: editingItem.technologies,
          startDate: editingItem.startDate,
          endDate: editingItem.endDate || '',
          isOngoing: editingItem.isOngoing,
          liveUrl: editingItem.liveUrl || '',
          projectUrl: editingItem.projectUrl || '',
          duration: '' // Will be computed by backend
        };
        await addPersonalProjectsMutation.mutateAsync([projectToAdd]);
      }
      
      setIsDialogOpen(false);
      setEditingItem(null);
      setValidationErrors([]);
    } catch (err: any) {
      // Use shared error utility
      const errorMessage = extractApiErrorMessage(
        err,
        'Failed to save project. Please try again.'
      );
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setEditingItem(null);
    setError(null);
    setValidationErrors([]);
  };

  const updateEditingItem = (field: keyof PersonalProject, value: any) => {
    if (editingItem) {
      setEditingItem({ ...editingItem, [field]: value });
    }
  };

  const handleAddTechnology = () => {
    if (!editingItem) return;
    const value = techInput.trim();
    if (!value) return;
    if (!editingItem.technologies.includes(value)) {
      setEditingItem({ ...editingItem, technologies: [...editingItem.technologies, value] });
    }
    setTechInput('');
  };

  const handleRemoveTechnology = (index: number) => {
    if (!editingItem) return;
    const newTechs = [...editingItem.technologies];
    newTechs.splice(index, 1);
    setEditingItem({ ...editingItem, technologies: newTechs });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="w-full border-b border-gray-200 dark:border-gray-700 pb-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Code className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold">Personal Projects</h2>
        </div>
        <Button 
          variant="outline" 
          onClick={handleAdd}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Project
        </Button>
      </div>

      {/* Display Mode */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            Loading projects...
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No personal projects added yet.</p>
            <p className="text-sm">Click "Add Project" to get started.</p>
          </div>
        ) : (
          projects.map((project: PersonalProject) => (
            <div key={project.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Code className="h-4 w-4 text-blue-600" />
                    <h3 className="text-lg font-semibold">{project.name}</h3>
                    {project.isOngoing && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                        Ongoing
                      </span>
                    )}
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(project.startDate)} - {
                        project.isOngoing ? 'Present' : formatDate(project.endDate)
                      }
                    </div>
                    <p className="mt-2">{project.description}</p>
                    
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="mt-3">
                        <h4 className="text-sm font-medium mb-2">Technologies:</h4>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech, techIndex) => (
                            <span
                              key={techIndex}
                              className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-md text-xs"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {project.achievements && (
                      <div className="mt-3">
                        <h4 className="text-sm font-medium mb-1 flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          Key Achievements:
                        </h4>
                        <p className="text-sm">{project.achievements}</p>
                      </div>
                    )}

                    {(project.liveUrl || project.projectUrl) && (
                      <div className="flex gap-2 pt-3">
                        {project.liveUrl && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Live Demo
                            </a>
                          </Button>
                        )}
                        {project.projectUrl && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={project.projectUrl} target="_blank" rel="noopener noreferrer">
                              <Code className="h-3 w-3 mr-1" />
                              GitHub
                            </a>
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEdit(project)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(project.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit/Add Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[98vw] max-w-none max-h-[98vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {editingItem?.id && projects.some((proj: PersonalProject) => proj.id === editingItem.id) 
                ? 'Edit Personal Project' 
                : 'Add Personal Project'
              }
            </DialogTitle>
          </DialogHeader>
          
          {editingItem && (
            <div className="space-y-8 py-4">
              {/* Project Name */}
              <div className="space-y-3">
                <Label htmlFor="name" className="text-sm font-semibold">Project Name *</Label>
                <Input
                  id="name"
                  value={editingItem.name}
                  onChange={(e) => updateEditingItem('name', e.target.value)}
                  placeholder="My Awesome Project"
                  className="h-12 text-base"
                />
              </div>

              {/* Technologies & Tools */}
              <div className="space-y-3">
                <Label htmlFor="technologyInput" className="text-sm font-semibold">Technologies & Tools</Label>
                <div className="flex gap-2">
                  <Input
                    id="technologyInput"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    placeholder="e.g. React"
                    className="h-12 text-base"
                  />
                  <Button type="button" variant="secondary" onClick={handleAddTechnology} disabled={!techInput.trim()}>
                    Add
                  </Button>
                </div>
                {editingItem.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {editingItem.technologies.map((tech, idx) => (
                      <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md flex items-center gap-1 text-xs">
                        {tech}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveTechnology(idx)} />
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Project Description */}
              <div className="space-y-3">
                <Label htmlFor="description" className="text-sm font-semibold">Project Description *</Label>
                <Textarea
                  id="description"
                  value={editingItem.description}
                  onChange={(e) => updateEditingItem('description', e.target.value)}
                  placeholder="Describe what your project does, the problem it solves, and your role in building it..."
                  rows={3}
                  className="text-base"
                />
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="startDate" className="text-sm font-semibold">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={editingItem.startDate}
                    onChange={(e) => updateEditingItem('startDate', e.target.value)}
                    className="h-12 text-base"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="endDate" className="text-sm font-semibold">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={editingItem.endDate}
                    onChange={(e) => updateEditingItem('endDate', e.target.value)}
                    disabled={editingItem.isOngoing}
                    className="h-12 text-base"
                  />
                </div>
              </div>

              {/* Ongoing Project */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="isOngoing"
                    checked={editingItem.isOngoing}
                    onCheckedChange={(checked) => updateEditingItem('isOngoing', checked)}
                  />
                  <Label htmlFor="isOngoing" className="text-base">This is an ongoing project</Label>
                </div>
              </div>

              {/* URLs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="liveUrl" className="text-sm font-semibold">Live URL</Label>
                  <Input
                    id="liveUrl"
                    value={editingItem.liveUrl || ''}
                    onChange={(e) => updateEditingItem('liveUrl', e.target.value)}
                    placeholder="https://myproject.com"
                    className="h-12 text-base"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="projectUrl" className="text-sm font-semibold">Project URL</Label>
                  <Input
                    id="projectUrl"
                    value={editingItem.projectUrl || ''}
                    onChange={(e) => updateEditingItem('projectUrl', e.target.value)}
                    placeholder="https://github.com/username/repo"
                    className="h-12 text-base"
                  />
                </div>
              </div>

              {/* Achievements */}
              <div className="space-y-3">
                <Label htmlFor="achievements" className="text-sm font-semibold">Key Achievements</Label>
                <Textarea
                  id="achievements"
                  value={editingItem.achievements || ''}
                  onChange={(e) => updateEditingItem('achievements', e.target.value)}
                  placeholder="Highlight specific achievements, metrics, or notable features..."
                  rows={2}
                  className="text-base"
                />
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
              disabled={saving || !editingItem?.name?.trim() || !editingItem?.description?.trim() || !editingItem?.startDate?.trim()}
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
                  {editingItem?.id && projects.some((proj: PersonalProject) => proj.id === editingItem.id) 
                    ? 'Update Project' 
                    : 'Save Project'
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