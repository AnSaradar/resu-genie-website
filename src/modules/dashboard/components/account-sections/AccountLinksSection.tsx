import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { 
  Link as LinkIcon, 
  ExternalLink,
  Edit2,
  Save,
  X,
  Loader2,
  Plus,
  Trash2
} from 'lucide-react';
import { 
  useGetAllLinks,
  useAddLinks,
  useUpdateLink,
  useDeleteLink
} from '@/services/link/hook';
import { Link as LinkType } from '@/services/link/types';
import { extractApiErrorMessage } from '@/utils/error-utils';

interface Link {
  id: string;
  websiteName: string;
  websiteUrl: string;
}

interface AccountLinksSectionProps {
  data: any;
  onDataUpdate: () => void;
}

export function AccountLinksSection({ data, onDataUpdate }: AccountLinksSectionProps) {
  const { data: linksData = [], isLoading } = useGetAllLinks();
  const addLinksMutation = useAddLinks();
  const updateLinkMutation = useUpdateLink();
  const deleteLinkMutation = useDeleteLink();
  const [editingItem, setEditingItem] = useState<Link | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Prefer React Query data; fallback to provided data for initial render
  const links = (linksData && Array.isArray(linksData)) 
    ? linksData 
    : (data?.links || []).map((link: any) => ({
        id: link.id || link._id,
        websiteName: link.website_name || link.websiteName || '',
        websiteUrl: link.website_url || link.websiteUrl || ''
      }));

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

  const handleDelete = async (id: string) => {
    try {
      await deleteLinkMutation.mutateAsync(id);
    } catch (err: any) {
      const message = extractApiErrorMessage(err, 'Failed to delete link.');
      setError(message);
    }
  };

  const handleSave = async () => {
    if (!editingItem) return;
    
    setSaving(true);
    setError(null);
    
    try {
      if (editingItem.id && links.some((link: Link) => link.id === editingItem.id)) {
        // Update existing
        await updateLinkMutation.mutateAsync({
          linkId: editingItem.id,
          updateData: {
            website_name: editingItem.websiteName,
            website_url: editingItem.websiteUrl,
          }
        });
      } else {
        // Create new (mutation accepts array of one item)
        const linkToAdd: LinkType = {
          id: editingItem.id,
          websiteName: editingItem.websiteName,
          websiteUrl: editingItem.websiteUrl,
        };
        await addLinksMutation.mutateAsync([linkToAdd]);
      }
      
      setIsDialogOpen(false);
      setEditingItem(null);
    } catch (err: any) {
      const message = extractApiErrorMessage(err, 'Failed to save link.');
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

  const updateEditingItem = (field: keyof Link, value: any) => {
    if (!editingItem) return;
    setEditingItem({ ...editingItem, [field]: value });
  };

  return (
    <div className="w-full border-b border-gray-200 dark:border-gray-700 pb-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <LinkIcon className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold">Links</h2>
        </div>
        <Button 
          variant="outline" 
          onClick={handleAdd}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Link
        </Button>
      </div>

      {/* Display Mode */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            Loading links...
          </div>
        ) : links.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <LinkIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No links added yet.</p>
            <p className="text-sm">Click "Add Link" to get started.</p>
          </div>
        ) : (
          links.map((link: Link) => (
            <div key={link.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <LinkIcon className="h-4 w-4 text-blue-600" />
                    <h3 className="text-lg font-semibold">{link.websiteName}</h3>
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
            </div>
          ))
        )}
      </div>

      {/* Edit/Add Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[98vw] max-w-none max-h-[98vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {editingItem?.id && links.some((link: Link) => link.id === editingItem.id) 
                ? 'Edit Link' 
                : 'Add Link'
              }
            </DialogTitle>
          </DialogHeader>
          
          {editingItem && (
            <div className="space-y-8 py-4">
              {/* Website Name */}
              <div className="space-y-3">
                <Label htmlFor="websiteName" className="text-sm font-semibold">Website Name *</Label>
                <Input
                  id="websiteName"
                  value={editingItem.websiteName}
                  onChange={(e) => updateEditingItem('websiteName', e.target.value)}
                  placeholder="e.g. GitHub, Portfolio, Blog"
                  className="h-12 text-base"
                />
              </div>

              {/* Website URL */}
              <div className="space-y-3">
                <Label htmlFor="websiteUrl" className="text-sm font-semibold">Website URL *</Label>
                <Input
                  id="websiteUrl"
                  type="url"
                  value={editingItem.websiteUrl}
                  onChange={(e) => updateEditingItem('websiteUrl', e.target.value)}
                  placeholder="https://..."
                  className="h-12 text-base"
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
              disabled={saving || !editingItem?.websiteName || !editingItem?.websiteUrl}
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
                  {editingItem?.id && links.some((link: Link) => link.id === editingItem.id) 
                    ? 'Update Link' 
                    : 'Save Link'
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

