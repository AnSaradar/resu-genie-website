import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Languages as LanguagesIcon, 
  X,
  Save,
  Globe,
  Sparkles,
  CheckCircle
} from 'lucide-react';
import { useGetAllLanguages } from '@/services/language/hook';
import { ResumeData } from '../../pages/ResumeGenerator';

export interface Language {
  id: string;
  name: string;
  proficiency: string;
  isNative: boolean;
}

interface LanguagesStepProps {
  data: ResumeData;
  onUpdate: (data: Partial<ResumeData>) => void;
  onNext: () => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

const PROFICIENCY_LEVELS = [
  { value: 'A1', label: 'A1 - Elementary' },
  { value: 'A2', label: 'A2 - Limited Working' },
  { value: 'B1', label: 'B1 - Limited Working' },
  { value: 'B2', label: 'B2 - Professional Working' },
  { value: 'C1', label: 'C1 - Full Professional' },
  { value: 'C2', label: 'C2 - Native or Bilingual' }
];

const COMMON_LANGUAGES = [
  'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian',
  'Chinese (Mandarin)', 'Chinese (Cantonese)', 'Japanese', 'Korean', 'Arabic',
  'Hindi', 'Dutch', 'Swedish', 'Norwegian', 'Danish', 'Finnish', 'Polish',
  'Turkish', 'Hebrew', 'Thai', 'Vietnamese', 'Indonesian', 'Malay'
];

export function LanguagesStep({ data, onUpdate, onNext, onPrevious, isFirstStep, isLastStep }: LanguagesStepProps) {
  const [editingItem, setEditingItem] = useState<Language | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAutoFilled, setIsAutoFilled] = useState(false);

  // Fetch user languages from profile
  const { data: userLanguages = [], isLoading: languagesLoading } = useGetAllLanguages();

  const languages = data.languages || [];

  // Sync with updated data prop (for edit mode)
  useEffect(() => {
    if (data.languages && data.languages.length > 0) {
      // Data is already synced via the languages variable
      // This effect ensures we're aware of data changes
    }
  }, [data.languages]);

  const defaultLanguage: Omit<Language, 'id'> = {
    name: '',
    proficiency: 'B2',
    isNative: false
  };

  // Auto-fill ALL languages functionality
  const handleAutoFillAll = () => {
    if (userLanguages.length > 0) {
      onUpdate({ languages: [...languages, ...userLanguages] });
      setIsAutoFilled(true);
    }
  };

  const handleAdd = () => {
    setEditingItem({
      id: crypto.randomUUID(),
      ...defaultLanguage
    });
    setIsAutoFilled(false);
    setIsDialogOpen(true);
  };

  const handleEdit = (language: Language) => {
    setEditingItem(language);
    setIsAutoFilled(false);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    const updatedLanguages = languages.filter((lang: Language) => lang.id !== id);
    onUpdate({ languages: updatedLanguages });
  };

  const handleSave = () => {
    if (!editingItem) return;

    const existingIndex = languages.findIndex((lang: Language) => lang.id === editingItem.id);
    let updatedLanguages;

    if (existingIndex >= 0) {
      updatedLanguages = [...languages];
      updatedLanguages[existingIndex] = editingItem;
    } else {
      updatedLanguages = [...languages, editingItem];
    }

    onUpdate({ languages: updatedLanguages });
    setIsDialogOpen(false);
    setEditingItem(null);
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setEditingItem(null);
  };

  const updateEditingItem = (field: keyof Language, value: any) => {
    if (!editingItem) return;
    setEditingItem({ ...editingItem, [field]: value });
  };

  const getProficiencyColor = (proficiency: string) => {
    switch (proficiency) {
      case 'A1': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'A2': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      case 'B1': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'B2': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'C1': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300';
      case 'C2': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
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
          <h3 className="text-lg font-semibold">Languages</h3>
          <p className="text-sm text-muted-foreground">
            Add languages you speak and your proficiency level.
          </p>
        </div>
        <div className="flex gap-2">
          {/* Auto-fill button */}
          <Button
            onClick={handleAutoFillAll}
            variant="outline"
            disabled={languagesLoading || userLanguages.length === 0}
            className="gap-2"
          >
            {languagesLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent" />
                Loading...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Auto-fill All ({userLanguages.length})
              </>
            )}
          </Button>
          <Button onClick={handleAdd} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Language
          </Button>
        </div>
      </div>

      {/* Languages List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {languages.map((language: Language) => (
            <motion.div
              key={language.id}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, scale: 0.8 }}
              layout
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Globe className="h-4 w-4 text-blue-600" />
                        <h4 className="font-semibold">{language.name}</h4>
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
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {languages.length === 0 && (
        <motion.div
          variants={itemVariants}
          className="text-center py-12 text-muted-foreground"
        >
          <LanguagesIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No languages added yet.</p>
          <p className="text-sm">Click "Add Language" to get started{userLanguages.length > 0 ? ' or use "Auto-fill All" to load your saved languages' : ''}.</p>
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
          <span className="text-sm">Successfully auto-filled {userLanguages.length} language entr{userLanguages.length > 1 ? 'ies' : 'y'} from your profile!</span>
        </motion.div>
      )}

      {/* Edit/Add Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingItem?.id && languages.some((lang: Language) => lang.id === editingItem.id) 
                ? 'Edit Language' 
                : 'Add Language'
              }
            </DialogTitle>
          </DialogHeader>
          
          {editingItem && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="languageName">Language *</Label>
                <Select
                  value={editingItem.name}
                  onValueChange={(value) => updateEditingItem('name', value)}
                >
                  <SelectTrigger>
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

              <div className="space-y-2">
                <Label htmlFor="proficiency">Proficiency Level *</Label>
                <Select
                  value={editingItem.proficiency}
                  onValueChange={(value) => updateEditingItem('proficiency', value)}
                >
                  <SelectTrigger>
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

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isNative"
                  checked={editingItem.isNative}
                  onChange={(e) => updateEditingItem('isNative', e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="isNative">This is my native language</Label>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave}
                  disabled={!editingItem.name || !editingItem.proficiency}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Language
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