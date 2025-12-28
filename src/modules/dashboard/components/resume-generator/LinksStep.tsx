import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Link as LinkIcon, 
  X,
  Save,
  ExternalLink,
  Sparkles,
  CheckCircle
} from 'lucide-react';
import { ResumeData } from '../../pages/ResumeGenerator';
import { useGetAllLinks } from '../../../../services/link/hook';

export interface Link {
  id: string;
  websiteName: string;
  websiteUrl: string;
}

interface LinksStepProps {
  data: ResumeData;
  onUpdate: (data: Partial<ResumeData>) => void;
  onNext: () => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export function LinksStep({ data, onUpdate, onNext, onPrevious, isFirstStep, isLastStep }: LinksStepProps) {
  const { data: userLinks = [], isLoading: linksLoading } = useGetAllLinks();

  const [editingItem, setEditingItem] = useState<Link | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAutoFilled, setIsAutoFilled] = useState(false);

  const links = data.links || [];

  // Sync with updated data prop (for edit mode)
  useEffect(() => {
    if (data.links && data.links.length > 0) {
      // Data is already synced via the links variable
      // This effect ensures we're aware of data changes
    }
  }, [data.links]);

  const defaultLink: Omit<Link, 'id'> = {
    websiteName: '',
    websiteUrl: ''
  };

  const handleAdd = () => {
    setEditingItem({
      id: crypto.randomUUID(),
      ...defaultLink
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (link: Link) => {
    setEditingItem(link);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    const updatedLinks = links.filter((link: Link) => link.id !== id);
    onUpdate({ links: updatedLinks });
  };

  const handleSave = () => {
    if (!editingItem) return;

    const existingIndex = links.findIndex((link: Link) => link.id === editingItem.id);
    let updatedLinks;

    if (existingIndex >= 0) {
      updatedLinks = [...links];
      updatedLinks[existingIndex] = editingItem;
    } else {
      updatedLinks = [...links, editingItem];
    }

    onUpdate({ links: updatedLinks });
    setIsDialogOpen(false);
    setEditingItem(null);
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setEditingItem(null);
  };

  const updateEditingItem = (field: keyof Link, value: any) => {
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

  // Auto-fill functionality - loads ALL user link entries
  const handleAutoFillAll = () => {
    if (userLinks.length > 0) {
      const convertedLinks: Link[] = userLinks.map((link: any) => ({
        id: link.id,
        websiteName: link.websiteName,
        websiteUrl: link.websiteUrl,
      }));

      onUpdate({ links: [...links, ...convertedLinks] });
      setIsAutoFilled(true);
    }
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
          <h3 className="text-lg font-semibold">Links</h3>
          <p className="text-sm text-muted-foreground">
            Add your personal links, such as GitHub, portfolio, blog, or social media profiles.
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleAutoFillAll} 
            variant="outline"
            disabled={linksLoading || userLinks.length === 0}
            className="gap-2"
          >
            {linksLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent" />
                Loading...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Auto-fill All ({userLinks.length})
              </>
            )}
          </Button>
          <Button onClick={handleAdd} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Link
          </Button>
        </div>
      </div>

      {/* Links List */}
      <div className="space-y-4">
        <AnimatePresence>
          {links.map((link: Link) => (
            <motion.div
              key={link.id}
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
                        <LinkIcon className="h-4 w-4 text-blue-600" />
                        <h4 className="font-semibold">{link.websiteName}</h4>
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div>
                          <a
                            href={link.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                          >
                            <ExternalLink className="h-3 w-3" />
                            {link.websiteUrl}
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(link)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(link.id)}
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

        {links.length === 0 && (
          <motion.div
            variants={itemVariants}
            className="text-center py-12 text-muted-foreground"
          >
            <LinkIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No links added yet.</p>
            <p className="text-sm">Click "Add Link" to get started.</p>
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
            <span className="text-sm">Successfully auto-filled {userLinks.length} link{userLinks.length > 1 ? 's' : ''} from your profile!</span>
          </motion.div>
        )}
      </div>

      {/* Edit/Add Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingItem?.id && links.some((link: Link) => link.id === editingItem.id) 
                ? 'Edit Link' 
                : 'Add Link'
              }
            </DialogTitle>
          </DialogHeader>
          
          {editingItem && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="websiteName">Website Name *</Label>
                <Input
                  id="websiteName"
                  value={editingItem.websiteName}
                  onChange={(e) => updateEditingItem('websiteName', e.target.value)}
                  placeholder="e.g. GitHub, Portfolio, Blog"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="websiteUrl">Website URL *</Label>
                <Input
                  id="websiteUrl"
                  type="url"
                  value={editingItem.websiteUrl}
                  onChange={(e) => updateEditingItem('websiteUrl', e.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave}
                  disabled={!editingItem.websiteName || !editingItem.websiteUrl}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Link
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

