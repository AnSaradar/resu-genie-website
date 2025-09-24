import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { 
  Lightbulb, 
  Star,
  Edit2,
  Save,
  X,
  Loader2,
  Plus,
  Trash2
} from 'lucide-react';
import { 
  useGetAllSkills,
  useAddSkills,
  useUpdateSkill,
  useDeleteSkill
} from '@/services/skill/hook';
import { Skill as SkillType } from '@/services/skill/types';

interface Skill {
  id: string;
  name: string;
  level: number; // 1-5 scale
  is_soft_skill: boolean; // true => Soft Skill
}

interface AccountSkillsSectionProps {
  data: any;
  onDataUpdate: () => void;
}

const SKILL_LEVELS = [
  { value: 1, label: 'Beginner' },
  { value: 2, label: 'Intermediate' },
  { value: 3, label: 'Advanced' },
  { value: 4, label: 'Expert' },
  { value: 5, label: 'Master' }
];

export function AccountSkillsSection({ data, onDataUpdate }: AccountSkillsSectionProps) {
  const { data: skillsData = [], isLoading } = useGetAllSkills();
  const addSkillsMutation = useAddSkills();
  const updateSkillMutation = useUpdateSkill();
  const deleteSkillMutation = useDeleteSkill();
  const [editingItem, setEditingItem] = useState<Skill | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<'all' | 'career' | 'soft'>('all');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Prefer React Query data; fallback to provided data for initial render
  const allSkills = (skillsData && Array.isArray(skillsData)) ? skillsData : [
    ...(data?.skills?.technical || []).map((skill: any) => ({ ...skill, is_soft_skill: false })),
    ...(data?.skills?.soft || []).map((skill: any) => ({ ...skill, is_soft_skill: true }))
  ];

  const filteredSkills = selectedType === 'all'
    ? allSkills
    : allSkills.filter((skill: Skill) => skill.is_soft_skill === (selectedType === 'soft'));

  const skillsByType: Record<'Career Skills' | 'Soft Skills', Skill[]> = {
    'Career Skills': allSkills.filter((s) => !s.is_soft_skill),
    'Soft Skills': allSkills.filter((s) => s.is_soft_skill),
  };

  const defaultSkill: Omit<Skill, 'id'> = {
    name: '',
    is_soft_skill: false,
    level: 3,
  };

  const handleAdd = () => {
    setEditingItem({
      id: crypto.randomUUID(),
      ...defaultSkill
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (skill: Skill) => {
    setEditingItem(skill);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSkillMutation.mutateAsync(id);
    } catch (err: any) {
      const detail = err?.response?.data?.detail;
      const message = typeof detail === 'string' ? detail : 'Failed to delete skill.';
      setError(message);
    }
  };

  const handleSave = async () => {
    if (!editingItem) return;
    
    setSaving(true);
    setError(null);
    
    try {
      if (editingItem.id && allSkills.some((skill: Skill) => skill.id === editingItem.id)) {
        // Update existing
        await updateSkillMutation.mutateAsync({
          skillId: editingItem.id,
          updateData: {
            name: editingItem.name,
            proficiency: editingItem.level, // Convert level to proficiency
            is_soft_skill: editingItem.is_soft_skill,
          }
        });
      } else {
        // Create new (mutation accepts array of one item)
        const skillToAdd: SkillType = {
          id: editingItem.id,
          name: editingItem.name,
          level: editingItem.level,
          is_soft_skill: editingItem.is_soft_skill
        };
        await addSkillsMutation.mutateAsync([skillToAdd]);
      }
      
      setIsDialogOpen(false);
      setEditingItem(null);
    } catch (err: any) {
      // Robustly extract error message; FastAPI 422 returns detail as array of objects
      const detail = err?.response?.data?.detail;
      let message = 'Failed to save skill.';
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

  return (
    <div className="w-full border-b border-gray-200 dark:border-gray-700 pb-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Lightbulb className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold">Skills</h2>
        </div>
        <Button 
          variant="outline" 
          onClick={handleAdd}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Skill
        </Button>
      </div>

      {/* Type Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Button
          variant={selectedType === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedType('all')}
        >
          All ({allSkills.length})
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

      {/* Display Mode */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            Loading skills...
          </div>
        ) : allSkills.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No skills added yet.</p>
            <p className="text-sm">Click "Add Skill" to get started.</p>
          </div>
        ) : (
          selectedType === 'all' ? (
            // Show by categories
            (['Career Skills', 'Soft Skills'] as const).map((label) => {
              const typeSkills = skillsByType[label];
              if (!typeSkills || typeSkills.length === 0) return null;

              return (
                <div key={label} className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-blue-600" />
                    {label}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {typeSkills.map((skill: Skill) => (
                      <div key={skill.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{skill.name}</h4>
                            <div className="flex items-center gap-1 mt-2">
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
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            // Show filtered skills
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSkills.map((skill: Skill) => (
                <div key={skill.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{skill.name}</h4>
                      <div className="flex items-center gap-1 mt-2">
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
                </div>
              ))}
            </div>
          )
        )}
      </div>

      {/* Edit/Add Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[98vw] max-w-none max-h-[98vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {editingItem?.id && allSkills.some((skill: Skill) => skill.id === editingItem.id) 
                ? 'Edit Skill' 
                : 'Add Skill'
              }
            </DialogTitle>
          </DialogHeader>
          
          {editingItem && (
            <div className="space-y-8 py-4">
              {/* Skill Name */}
              <div className="space-y-3">
                <Label htmlFor="skillName" className="text-sm font-semibold">Skill Name *</Label>
                <Input
                  id="skillName"
                  value={editingItem.name}
                  onChange={(e) => updateEditingItem('name', e.target.value)}
                  placeholder="e.g. React, Python, Leadership"
                  className="h-12 text-base"
                />
              </div>

              {/* Skill Type */}
              <div className="space-y-3">
                <Label htmlFor="skillType" className="text-sm font-semibold">Skill Type *</Label>
                <Select
                  value={editingItem.is_soft_skill ? 'soft' : 'career'}
                  onValueChange={(value) => updateEditingItem('is_soft_skill', value === 'soft')}
                >
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="career">Career Skill</SelectItem>
                    <SelectItem value="soft">Soft Skill</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Proficiency Level */}
              <div className="space-y-3">
                <Label htmlFor="level" className="text-sm font-semibold">Proficiency Level *</Label>
                <Select
                  value={editingItem.level.toString()}
                  onValueChange={(value) => updateEditingItem('level', parseInt(value))}
                >
                  <SelectTrigger className="h-12 text-base">
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
              disabled={saving || !editingItem?.name}
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
                  {editingItem?.id && allSkills.some((skill: Skill) => skill.id === editingItem.id) 
                    ? 'Update Skill' 
                    : 'Save Skill'
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