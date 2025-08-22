import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { 
  Award, 
  Calendar,
  Building,
  ExternalLink,
  Edit2,
  Save,
  X,
  Loader2,
  Plus,
  Trash2
} from 'lucide-react';
import apiClient from '@/lib/axios';

interface Certificate {
  id: string;
  name: string;
  organization: string;
  issueDate: string;
  certificateUrl?: string;
  description?: string;
}

interface AccountCertificationsSectionProps {
  data: any;
  onDataUpdate: () => void;
}

export function AccountCertificationsSection({ data, onDataUpdate }: AccountCertificationsSectionProps) {
  const [editingItem, setEditingItem] = useState<Certificate | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const certifications = data?.certifications || [];

  const defaultCertificate: Omit<Certificate, 'id'> = {
    name: '',
    organization: '',
    issueDate: '',
    certificateUrl: '',
    description: ''
  };

  const handleAdd = () => {
    setEditingItem({
      id: crypto.randomUUID(),
      ...defaultCertificate
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (certificate: Certificate) => {
    setEditingItem(certificate);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await apiClient.delete(`/api/v1/certification/${id}`);
      onDataUpdate();
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Failed to delete certification.');
    }
  };

  const handleSave = async () => {
    if (!editingItem) return;
    
    setSaving(true);
    setError(null);
    
    try {
      const payload = {
        name: editingItem.name,
        issuing_organization: editingItem.organization,
        issue_date: editingItem.issueDate,
        certificate_url: editingItem.certificateUrl,
        description: editingItem.description,
      };

      if (editingItem.id && certifications.some((cert: Certificate) => cert.id === editingItem.id)) {
        // Update existing
        await apiClient.put(`/api/v1/certification/${editingItem.id}`, payload);
      } else {
        // Create new
        await apiClient.post('/api/v1/certification', payload);
      }
      
      setIsDialogOpen(false);
      setEditingItem(null);
      onDataUpdate();
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Failed to save certification.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setEditingItem(null);
    setError(null);
  };

  const updateEditingItem = (field: keyof Certificate, value: any) => {
    if (!editingItem) return;
    setEditingItem({ ...editingItem, [field]: value });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString + '-01');
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  return (
    <div className="w-full border-b border-gray-200 dark:border-gray-700 pb-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Award className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold">Certifications</h2>
        </div>
        <Button 
          variant="outline" 
          onClick={handleAdd}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Certification
        </Button>
      </div>

      {/* Display Mode */}
      <div className="space-y-6">
        {certifications.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No certifications added yet.</p>
            <p className="text-sm">Click "Add Certification" to get started.</p>
          </div>
        ) : (
          certifications.map((certificate: Certificate) => (
            <div key={certificate.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="h-4 w-4 text-blue-600" />
                    <h3 className="text-lg font-semibold">{certificate.name}</h3>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Building className="h-3 w-3" />
                      <span className="font-medium">{certificate.organization}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Issued: {formatDate(certificate.issueDate)}
                    </div>
                    {certificate.certificateUrl && (
                      <div>
                        <a
                          href={certificate.certificateUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1"
                        >
                          <ExternalLink className="h-3 w-3" />
                          View Credential
                        </a>
                      </div>
                    )}
                    {certificate.description && (
                      <p className="mt-3 text-sm leading-relaxed">
                        {certificate.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEdit(certificate)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(certificate.id)}
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
              {editingItem?.id && certifications.some((cert: Certificate) => cert.id === editingItem.id) 
                ? 'Edit Certification' 
                : 'Add Certification'
              }
            </DialogTitle>
          </DialogHeader>
          
          {editingItem && (
            <div className="space-y-8 py-4">
              {/* Certificate Name */}
              <div className="space-y-3">
                <Label htmlFor="certName" className="text-sm font-semibold">Certificate Name *</Label>
                <Input
                  id="certName"
                  value={editingItem.name}
                  onChange={(e) => updateEditingItem('name', e.target.value)}
                  placeholder="e.g. AWS Certified Solutions Architect"
                  className="h-12 text-base"
                />
              </div>

              {/* Organization */}
              <div className="space-y-3">
                <Label htmlFor="organization" className="text-sm font-semibold">Issuing Organization *</Label>
                <Input
                  id="organization"
                  value={editingItem.organization}
                  onChange={(e) => updateEditingItem('organization', e.target.value)}
                  placeholder="e.g. Amazon Web Services"
                  className="h-12 text-base"
                />
              </div>

              {/* Issue Date */}
              <div className="space-y-3">
                <Label htmlFor="issueDate" className="text-sm font-semibold">Issue Date *</Label>
                <Input
                  id="issueDate"
                  type="month"
                  value={editingItem.issueDate}
                  onChange={(e) => updateEditingItem('issueDate', e.target.value)}
                  className="h-12 text-base"
                />
              </div>

              {/* Certificate URL */}
              <div className="space-y-3">
                <Label htmlFor="certificateUrl" className="text-sm font-semibold">Certificate URL</Label>
                <Input
                  id="certificateUrl"
                  type="url"
                  value={editingItem.certificateUrl}
                  onChange={(e) => updateEditingItem('certificateUrl', e.target.value)}
                  placeholder="https://..."
                  className="h-12 text-base"
                />
              </div>

              {/* Description */}
              <div className="space-y-3">
                <Label htmlFor="description" className="text-sm font-semibold">Description</Label>
                <Textarea
                  id="description"
                  value={editingItem.description}
                  onChange={(e) => updateEditingItem('description', e.target.value)}
                  placeholder="Describe what this certification covers or its significance..."
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
              disabled={saving || !editingItem?.name || !editingItem?.organization || !editingItem?.issueDate}
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
                  {editingItem?.id && certifications.some((cert: Certificate) => cert.id === editingItem.id) 
                    ? 'Update Certification' 
                    : 'Save Certification'
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