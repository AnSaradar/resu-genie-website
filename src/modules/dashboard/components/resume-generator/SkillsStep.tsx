import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Lightbulb, 
  X,
  Save,
  Star,
  Sparkles,
  CheckCircle
} from 'lucide-react';
import { ResumeData } from '../../pages/ResumeGenerator';
import { useGetAllSkills } from '@/services/skill/hook';

export interface Skill {
  id: string;
  name: string;
  level: number; // 1-5 scale
  is_soft_skill: boolean; // true => Soft Skill
}

interface SkillsStepProps {
  data: ResumeData;
  onUpdate: (data: Partial<ResumeData>) => void;
  onNext: () => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

const SKILL_CATEGORIES = [
  'Career Skills',
  'Soft Skills'
];

const SKILL_LEVELS = [
  { value: 1, label: 'Beginner' },
  { value: 2, label: 'Intermediate' },
  { value: 3, label: 'Advanced' },
  { value: 4, label: 'Expert' },
  { value: 5, label: 'Master' }
];

export function SkillsStep({ data, onUpdate, onNext, onPrevious, isFirstStep, isLastStep }: SkillsStepProps) {
  const [editingItem, setEditingItem] = useState<Skill | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<'all' | 'career' | 'soft'>('all');
  const [isAutoFilled, setIsAutoFilled] = useState(false);

  // Fetch user skills from profile
  const { data: userSkills = [], isLoading: skillsLoading } = useGetAllSkills();

  const skills = data.skills || [];
  
  const filteredSkills = selectedType === 'all'
    ? skills
    : skills.filter((skill: Skill) => skill.is_soft_skill === (selectedType === 'soft'));

  const skillsByType: Record<'Career Skills' | 'Soft Skills', Skill[]> = {
    'Career Skills': skills.filter((s) => !s.is_soft_skill),
    'Soft Skills': skills.filter((s) => s.is_soft_skill),
  };

  const defaultSkill: Omit<Skill, 'id'> = {
    name: '',
    is_soft_skill: false,
    level: 3,
  };

  // Auto-fill ALL skills functionality
  const handleAutoFillAll = () => {
    if (userSkills.length > 0) {
      onUpdate({ skills: [...skills, ...userSkills] });
      setIsAutoFilled(true);
    }
  };

  const handleAdd = () => {
    setEditingItem({
      id: crypto.randomUUID(),
      ...defaultSkill
    });
    setIsDialogOpen(true);
    setIsAutoFilled(false);
  };

  const handleEdit = (skill: Skill) => {
    setEditingItem(skill);
    setIsDialogOpen(true);
    setIsAutoFilled(false);
  };

  const handleDelete = (id: string) => {
    const updatedSkills = skills.filter((skill: Skill) => skill.id !== id);
    onUpdate({ skills: updatedSkills });
  };

  const handleSave = () => {
    if (!editingItem) return;

    const existingIndex = skills.findIndex((skill: Skill) => skill.id === editingItem.id);
    let updatedSkills;

    if (existingIndex >= 0) {
      updatedSkills = [...skills];
      updatedSkills[existingIndex] = editingItem;
    } else {
      updatedSkills = [...skills, editingItem];
    }

    onUpdate({ skills: updatedSkills });
    setIsDialogOpen(false);
    setEditingItem(null);
    setIsAutoFilled(false);
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setEditingItem(null);
    setIsAutoFilled(false);
  };

  const updateEditingItem = (field: keyof Skill, value: any) => {
    if (!editingItem) return;
    setEditingItem({ ...editingItem, [field]: value });
  };

  const renderStars = (level: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < level ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
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
          <h3 className="text-lg font-semibold">Skills</h3>
          <p className="text-sm text-muted-foreground">
            Add your technical and soft skills with proficiency levels.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleAutoFillAll}
            variant="outline"
            disabled={skillsLoading || userSkills.length === 0}
            className="gap-2"
          >
            {skillsLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent" />
                Loading...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Auto-fill All ({userSkills.length})
              </>
            )}
          </Button>
          <Button onClick={handleAdd} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Skill
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
            <span className="text-sm">Successfully imported {userSkills.length} skill{userSkills.length !== 1 ? 's' : ''} from your profile!</span>
          </div>
        </motion.div>
      )}

      {/* Type Filter */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedType === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedType('all')}
        >
          All ({skills.length})
        </Button>
        {(['Career Skills', 'Soft Skills'] as const).map((label) => {
          const count = skillsByType[label]?.length || 0;
          if (count === 0) return null;

          const typeKey = label === 'Soft Skills' ? 'soft' : 'career';

          return (
            <Button
              key={label}
              variant={selectedType === typeKey ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType(typeKey as 'soft' | 'career')}
            >
              {label} ({count})
            </Button>
          );
        })}
      </div>

      {/* Skills Grid */}
      <div className="space-y-6">
        {selectedType === 'all' ? (
          // Show by categories
          (['Career Skills', 'Soft Skills'] as const).map((label) => {
            const typeSkills = skillsByType[label];
            if (!typeSkills || typeSkills.length === 0) return null;

            return (
              <motion.div key={label} variants={itemVariants}>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-blue-600" />
                  {label}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  <AnimatePresence>
                    {typeSkills.map((skill: Skill) => (
                      <motion.div
                        key={skill.id}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                      >
                        <Card className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h5 className="font-medium text-sm">{skill.name}</h5>
                                <div className="flex items-center gap-1 mt-1">
                                  {renderStars(skill.level)}
                                  <span className="text-xs text-muted-foreground ml-1">
                                    {SKILL_LEVELS.find(l => l.value === skill.level)?.label}
                                  </span>
                                </div>
                              </div>
                              <div className="flex gap-1 ml-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => handleEdit(skill)}
                                >
                                  <Edit2 className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => handleDelete(skill.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })
        ) : (
          // Show filtered skills
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <AnimatePresence>
              {filteredSkills.map((skill: Skill) => (
                <motion.div
                  key={skill.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h5 className="font-medium text-sm">{skill.name}</h5>
                          <div className="flex items-center gap-1 mt-1">
                            {renderStars(skill.level)}
                            <span className="text-xs text-muted-foreground ml-1">
                              {SKILL_LEVELS.find(l => l.value === skill.level)?.label}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-1 ml-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleEdit(skill)}
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleDelete(skill.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {skills.length === 0 && (
          <motion.div
            variants={itemVariants}
            className="text-center py-12 text-muted-foreground"
          >
            <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No skills added yet.</p>
            <p className="text-sm">Click "Add Skill" to get started.</p>
          </motion.div>
        )}
      </div>

      {/* Edit/Add Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingItem?.id && skills.some((skill: Skill) => skill.id === editingItem.id) 
                ? 'Edit Skill' 
                : 'Add Skill'
              }
            </DialogTitle>
          </DialogHeader>
          
          {editingItem && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="skillName">Skill Name *</Label>
                <Input
                  id="skillName"
                  value={editingItem.name}
                  onChange={(e) => updateEditingItem('name', e.target.value)}
                  placeholder="e.g. React, Python, Leadership"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="skillType">Skill Type *</Label>
                <Select
                  value={editingItem.is_soft_skill ? 'soft' : 'career'}
                  onValueChange={(value) => updateEditingItem('is_soft_skill', value === 'soft')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="career">Career Skill</SelectItem>
                    <SelectItem value="soft">Soft Skill</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="level">Proficiency Level *</Label>
                <Select
                  value={editingItem.level.toString()}
                  onValueChange={(value) => updateEditingItem('level', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {SKILL_LEVELS.map((level) => (
                      <SelectItem key={level.value} value={level.value.toString()}>
                        <div className="flex items-center gap-2">
                          <div className="flex">{renderStars(level.value)}</div>
                          {level.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave}
                  disabled={!editingItem.name}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Skill
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