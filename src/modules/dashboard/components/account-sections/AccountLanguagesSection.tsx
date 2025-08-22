import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Languages as LanguagesIcon, 
  Globe,
  Edit2,
  Save,
  X,
  Loader2,
  Plus,
  Trash2
} from 'lucide-react';
import apiClient from '@/lib/axios';

interface Language {
  id: string;
  name: string;
  proficiency: string;
  isNative: boolean;
}

interface AccountLanguagesSectionProps {
  data: any;
  onDataUpdate: () => void;
}

const PROFICIENCY_LEVELS = [
  { value: 'elementary', label: 'Elementary' },
  { value: 'limited', label: 'Limited Working' },
  { value: 'professional', label: 'Professional Working' },
  { value: 'full', label: 'Full Professional' },
  { value: 'native', label: 'Native or Bilingual' }
];

const COMMON_LANGUAGES = [
  'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian',
  'Chinese (Mandarin)', 'Chinese (Cantonese)', 'Japanese', 'Korean', 'Arabic',
  'Hindi', 'Dutch', 'Swedish', 'Norwegian', 'Danish', 'Finnish', 'Polish',
  'Turkish', 'Hebrew', 'Thai', 'Vietnamese', 'Indonesian', 'Malay'
];

export function AccountLanguagesSection({ data, onDataUpdate }: AccountLanguagesSectionProps) {
  const [editingItem, setEditingItem] = useState<Language | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const languages = data?.languages || [];

  const defaultLanguage: Omit<Language, 'id'> = {
    name: '',
    proficiency: 'professional',
    isNative: false
  };

  const handleAdd = () => {
    setEditingItem({
      id: crypto.randomUUID(),
      ...defaultLanguage
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (language: Language) => {
    setEditingItem(language);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await apiClient.delete(`/api/v1/language/${id}`);
      onDataUpdate();
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Failed to delete language.');
    }
  };

  const handleSave = async () => {
    if (!editingItem) return;
    
    setSaving(true);
    setError(null);
    
    try {
      const payload = {
        name: editingItem.name,
        proficiency: editingItem.proficiency,
        isNative: editingItem.isNative,
      };

      if (editingItem.id && languages.some((lang: Language) => lang.id === editingItem.id)) {
        // Update existing
        await apiClient.put(`/api/v1/language/${editingItem.id}`, payload);
      } else {
        // Create new
        await apiClient.post('/api/v1/language', payload);
      }
      
      setIsDialogOpen(false);
      setEditingItem(null);
      onDataUpdate();
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Failed to save language.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setEditingItem(null);
    setError(null);
  };

  const updateEditingItem = (field: keyof Language, value: any) => {
    if (!editingItem) return;
    setEditingItem({ ...editingItem, [field]: value });
  };

  const getProficiencyColor = (proficiency: string) => {
    switch (proficiency) {
      case 'elementary': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'limited': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      case 'professional': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'full': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'native': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  return (
    <div className="w-full border-b border-gray-200 dark:border-gray-700 pb-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <LanguagesIcon className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold">Languages</h2>
        </div>
        <Button 
          variant="outline" 
          onClick={handleAdd}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Language
        </Button>
      </div>

      {/* Display Mode */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {languages.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            <LanguagesIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No languages added yet.</p>
            <p className="text-sm">Click "Add Language" to get started.</p>
          </div>
        ) : (
          languages.map((language: Language) => (
            <div key={language.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="h-4 w-4 text-blue-600" />
                    <h3 className="font-semibold">{language.name}</h3>
                    {language.isNative && (
                      <span className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300 px-2 py-1 rounded-full">
                        Native
                      </span>
                    )}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getProficiencyColor(language.proficiency)}`}>
                    {PROFICIENCY_LEVELS.find(p => p.value === language.proficiency)?.label}
                  </span>
                </div>
                <div className="flex gap-1 ml-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleEdit(language)}
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleDelete(language.id)}
                  >
                    <Trash2 className="h-3 w-3" />
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
              {editingItem?.id && languages.some((lang: Language) => lang.id === editingItem.id) 
                ? 'Edit Language' 
                : 'Add Language'
              }
            </DialogTitle>
          </DialogHeader>
          
          {editingItem && (
            <div className="space-y-8 py-4">
              {/* Language Name */}
              <div className="space-y-3">
                <Label htmlFor="languageName" className="text-sm font-semibold">Language *</Label>
                <Select
                  value={editingItem.name}
                  onValueChange={(value) => updateEditingItem('name', value)}
                >
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {COMMON_LANGUAGES.map((lang) => (
                      <SelectItem key={lang} value={lang}>
                        {lang}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Proficiency Level */}
              <div className="space-y-3">
                <Label htmlFor="proficiency" className="text-sm font-semibold">Proficiency Level *</Label>
                <Select
                  value={editingItem.proficiency}
                  onValueChange={(value) => updateEditingItem('proficiency', value)}
                >
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Select proficiency" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROFICIENCY_LEVELS.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Native Language */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="isNative"
                    checked={editingItem.isNative}
                    onCheckedChange={(checked) => updateEditingItem('isNative', checked)}
                  />
                  <Label htmlFor="isNative" className="text-base">This is my native language</Label>
                </div>
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
              disabled={saving || !editingItem?.name || !editingItem?.proficiency}
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
                  {editingItem?.id && languages.some((lang: Language) => lang.id === editingItem.id) 
                    ? 'Update Language' 
                    : 'Save Language'
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