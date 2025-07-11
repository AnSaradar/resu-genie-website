import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  ExternalLink, 
  Code, 
  Calendar,
  Target,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  X
} from "lucide-react";
import { useGetAllPersonalProjects } from '@/services/personal_project/hook';
import { ResumeData } from "../../pages/ResumeGenerator";

// New interface reflecting renamed fields
export interface PersonalProject {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  startDate: string;
  endDate: string;
  isOngoing: boolean;
  liveUrl?: string; // formerly projectUrl
  projectUrl?: string; // formerly githubUrl
  achievements?: string;
}

interface PersonalProjectsStepProps {
  data: ResumeData;
  onUpdate: (data: Partial<ResumeData>) => void;
  onNext: () => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export function PersonalProjectsStep({ data, onUpdate, onNext, onPrevious, isFirstStep, isLastStep }: PersonalProjectsStepProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<PersonalProject | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [techInput, setTechInput] = useState('');
  const { data: userProjects = [], isLoading: projectsLoading } = useGetAllPersonalProjects();
  const [isAutoFilled, setIsAutoFilled] = useState(false);

  const projects = data.personalProjects || [];

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

  // Auto-fill handler – imports all personal projects from user profile
  const handleAutoFillAll = () => {
    if (userProjects.length > 0) {
      onUpdate({ personalProjects: [...projects, ...userProjects] });
      setIsAutoFilled(true);
    }
  };

  const handleAddTechnology = () => {
    if (!editingProject) return;
    const value = techInput.trim();
    if (!value) return;
    if (!editingProject.technologies.includes(value)) {
      setEditingProject({ ...editingProject, technologies: [...editingProject.technologies, value] });
    }
    setTechInput('');
  };

  const handleRemoveTechnology = (index: number) => {
    if (!editingProject) return;
    const newTechs = [...editingProject.technologies];
    newTechs.splice(index, 1);
    setEditingProject({ ...editingProject, technologies: newTechs });
  };

  const handleAdd = () => {
    setEditingProject(emptyProject);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEdit = (project: PersonalProject) => {
    setEditingProject(project);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    const updatedProjects = projects.filter((p: PersonalProject) => p.id !== id);
    onUpdate({ personalProjects: updatedProjects });
  };

  const handleSave = () => {
    if (!editingProject) return;

    const projectToSave = {
      ...editingProject,
      id: editingProject.id || `project-${Date.now()}`
    };

    let updatedProjects;
    if (isEditing) {
      updatedProjects = projects.map((p: PersonalProject) => 
        p.id === projectToSave.id ? projectToSave : p
      );
    } else {
      updatedProjects = [...projects, projectToSave];
    }

    onUpdate({ personalProjects: updatedProjects });
    handleCancel();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    setIsEditing(false);
  };

  const updateEditingItem = (field: keyof PersonalProject, value: any) => {
    if (editingProject) {
      setEditingProject({ ...editingProject, [field]: value });
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <motion.h2 
          className="text-3xl font-bold"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Personal Projects
        </motion.h2>
        <motion.p 
          className="text-muted-foreground"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Showcase your personal projects and side work that demonstrate your skills
        </motion.p>
      </div>

      {/* Action Buttons */}
      <motion.div
        className="flex gap-2 justify-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Button 
          onClick={handleAutoFillAll}
          variant="outline"
          disabled={projectsLoading || userProjects.length === 0}
          className="gap-2"
        >
          {projectsLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent" />
              Loading...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Auto-fill All ({userProjects.length})
            </>
          )}
        </Button>

        <Button 
          onClick={handleAdd} 
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Project
        </Button>
      </motion.div>

      {/* Projects List */}
      <AnimatePresence>
        {projects.length > 0 && (
          <motion.div 
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {projects.map((project: PersonalProject, index: number) => (
              <motion.div
                key={project.id}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                transition={{ delay: index * 0.1 }}
                layout
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-xl flex items-center gap-2">
                          <Code className="h-5 w-5 text-blue-600" />
                          {project.name}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          <div className="flex items-center gap-4 text-sm">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {formatDate(project.startDate)} - {
                                project.isOngoing ? 'Present' : formatDate(project.endDate)
                              }
                            </span>
                            {project.isOngoing && (
                              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                Ongoing
                              </span>
                            )}
                          </div>
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(project)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(project.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm">{project.description}</p>
                      
                      {project.technologies && project.technologies.length > 0 && (
                        <div>
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
                        <div>
                          <h4 className="text-sm font-medium mb-1 flex items-center gap-1">
                            <Target className="h-4 w-4" />
                            Key Achievements:
                          </h4>
                          <p className="text-sm text-muted-foreground">{project.achievements}</p>
                        </div>
                      )}

                      {(project.liveUrl || project.projectUrl) && (
                        <div className="flex gap-2 pt-2">
                          {project.liveUrl && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4 mr-1" />
                                Live Demo
                              </a>
                            </Button>
                          )}
                          {project.projectUrl && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={project.projectUrl} target="_blank" rel="noopener noreferrer">
                                <Code className="h-4 w-4 mr-1" />
                                GitHub
                              </a>
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {projects.length === 0 && (
        <motion.div 
          className="text-center py-12 text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Code className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p>No personal projects added yet. Start by adding your first project!</p>
        </motion.div>
      )}

      {/* Navigation */}
      <motion.div 
        className="flex justify-between pt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Button 
          onClick={onPrevious} 
          variant="outline"
          disabled={isFirstStep}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <Button onClick={onNext}>
          Next
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </motion.div>

      {/* Edit/Add Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Edit Personal Project' : 'Add Personal Project'}
            </DialogTitle>
            <DialogDescription>
              Add details about your personal project, including technologies used and achievements.
            </DialogDescription>
          </DialogHeader>

          {editingProject && (
            <div className="space-y-4">
              {/* First Row - Project Name */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="name">Project Name *</Label>
                  <Input
                    id="name"
                    value={editingProject.name}
                    onChange={(e) => updateEditingItem('name', e.target.value)}
                    placeholder="My Awesome Project"
                  />
                </div>
              </div>

              {/* Second Row - Technologies & Tools */}
              <div>
                <Label htmlFor="technologyInput">Technologies & Tools</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="technologyInput"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    placeholder="e.g. React"
                  />
                  <Button type="button" variant="secondary" onClick={handleAddTechnology} disabled={!techInput.trim()}>
                    Add
                  </Button>
                </div>
                {editingProject.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {editingProject.technologies.map((tech, idx) => (
                      <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md flex items-center gap-1 text-xs">
                        {tech}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveTechnology(idx)} />
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="description">Project Description *</Label>
                <Textarea
                  id="description"
                  value={editingProject.description}
                  onChange={(e) => updateEditingItem('description', e.target.value)}
                  placeholder="Describe what your project does, the problem it solves, and your role in building it..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={editingProject.startDate}
                    onChange={(e) => updateEditingItem('startDate', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={editingProject.endDate}
                    onChange={(e) => updateEditingItem('endDate', e.target.value)}
                    disabled={editingProject.isOngoing}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isOngoing"
                  checked={editingProject.isOngoing}
                  onCheckedChange={(checked) => updateEditingItem('isOngoing', checked)}
                />
                <Label htmlFor="isOngoing">This is an ongoing project</Label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="liveUrl">Live URL</Label>
                  <Input
                    id="liveUrl"
                    value={editingProject.liveUrl || ''}
                    onChange={(e) => updateEditingItem('liveUrl', e.target.value)}
                    placeholder="https://myproject.com"
                  />
                </div>
                <div>
                  <Label htmlFor="projectUrl">Project URL</Label>
                  <Input
                    id="projectUrl"
                    value={editingProject.projectUrl || ''}
                    onChange={(e) => updateEditingItem('projectUrl', e.target.value)}
                    placeholder="https://github.com/username/repo"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="achievements">Key Achievements</Label>
                <Textarea
                  id="achievements"
                  value={editingProject.achievements || ''}
                  onChange={(e) => updateEditingItem('achievements', e.target.value)}
                  placeholder="Highlight specific achievements, metrics, or notable features..."
                  rows={2}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={!editingProject?.name || !editingProject?.description || !editingProject?.startDate}
            >
              {isEditing ? 'Update' : 'Add'} Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Auto-fill success message */}
      {isAutoFilled && !isModalOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
        >
          <div className="flex items-center gap-2 text-green-700 dark:text-green-300 text-sm">
            Successfully imported {userProjects.length} project{userProjects.length !== 1 && 's'} from your profile!
          </div>
        </motion.div>
      )}
    </motion.div>
  );
} 