import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Award, 
  X,
  Save,
  Calendar,
  Building,
  ExternalLink,
  Sparkles,
  CheckCircle
} from 'lucide-react';
import { ResumeData } from '../../pages/ResumeGenerator';
import { useGetAllCertifications } from '../../../../services/certification/hook';

export interface Certificate {
  id: string;
  name: string;
  organization: string;
  issueDate: string;
  certificateUrl?: string;
  description?: string;
}

interface CertificatesStepProps {
  data: ResumeData;
  onUpdate: (data: Partial<ResumeData>) => void;
  onNext: () => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export function CertificatesStep({ data, onUpdate, onNext, onPrevious, isFirstStep, isLastStep }: CertificatesStepProps) {
  const { data: userCertifications = [], isLoading: certificationsLoading } = useGetAllCertifications();

  const [editingItem, setEditingItem] = useState<Certificate | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAutoFilled, setIsAutoFilled] = useState(false);

  const certificates = data.certificates || [];

  // Sync with updated data prop (for edit mode)
  useEffect(() => {
    if (data.certificates && data.certificates.length > 0) {
      // Data is already synced via the certificates variable
      // This effect ensures we're aware of data changes
    }
  }, [data.certificates]);

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

  const handleDelete = (id: string) => {
    const updatedCertificates = certificates.filter((cert: Certificate) => cert.id !== id);
    onUpdate({ certificates: updatedCertificates });
  };

  const handleSave = () => {
    if (!editingItem) return;

    const existingIndex = certificates.findIndex((cert: Certificate) => cert.id === editingItem.id);
    let updatedCertificates;

    if (existingIndex >= 0) {
      updatedCertificates = [...certificates];
      updatedCertificates[existingIndex] = editingItem;
    } else {
      updatedCertificates = [...certificates, editingItem];
    }

    onUpdate({ certificates: updatedCertificates });
    setIsDialogOpen(false);
    setEditingItem(null);
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setEditingItem(null);
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

  // Removed expiration-related logic as per updated requirements

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

  // Auto-fill functionality - loads ALL user certification entries
  const handleAutoFillAll = () => {
    if (userCertifications.length > 0) {
      const convertedCerts: Certificate[] = userCertifications.map((cert: any) => ({
        id: cert.id,
        name: cert.name,
        organization: cert.issuing_organization,
        issueDate: cert.issue_date,
        certificateUrl: cert.certificate_url || '',
        description: cert.description || ''
      }));

      onUpdate({ certificates: [...certificates, ...convertedCerts] });
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
          <h3 className="text-lg font-semibold">Certificates</h3>
          <p className="text-sm text-muted-foreground">
            Add professional certifications, licenses, and credentials.
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleAutoFillAll} 
            variant="outline"
            disabled={certificationsLoading || userCertifications.length === 0}
            className="gap-2"
          >
            {certificationsLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent" />
                Loading...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Auto-fill All ({userCertifications.length})
              </>
            )}
          </Button>
          <Button onClick={handleAdd} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Certificate
          </Button>
        </div>
      </div>

      {/* Certificates List */}
      <div className="space-y-4">
        <AnimatePresence>
          {certificates.map((certificate: Certificate) => (
            <motion.div
              key={certificate.id}
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
                        <Award className="h-4 w-4 text-blue-600" />
                        <h4 className="font-semibold">{certificate.name}</h4>
                        {/* Expiration removed */}
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
                          <p className="mt-2 text-sm leading-relaxed">
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
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {certificates.length === 0 && (
          <motion.div
            variants={itemVariants}
            className="text-center py-12 text-muted-foreground"
          >
            <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No certificates added yet.</p>
            <p className="text-sm">Click "Add Certificate" to get started.</p>
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
            <span className="text-sm">Successfully auto-filled {userCertifications.length} certification{userCertifications.length > 1 ? 's' : ''} from your profile!</span>
          </motion.div>
        )}
      </div>

      {/* Edit/Add Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingItem?.id && certificates.some((cert: Certificate) => cert.id === editingItem.id) 
                ? 'Edit Certificate' 
                : 'Add Certificate'
              }
            </DialogTitle>
          </DialogHeader>
          
          {editingItem && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="certName">Certificate Name *</Label>
                <Input
                  id="certName"
                  value={editingItem.name}
                  onChange={(e) => updateEditingItem('name', e.target.value)}
                  placeholder="e.g. AWS Certified Solutions Architect"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="organization">Issuing Organization *</Label>
                <Input
                  id="organization"
                  value={editingItem.organization}
                  onChange={(e) => updateEditingItem('organization', e.target.value)}
                  placeholder="e.g. Amazon Web Services"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="issueDate">Issue Date *</Label>
                <Input
                  id="issueDate"
                  type="month"
                  value={editingItem.issueDate}
                  onChange={(e) => updateEditingItem('issueDate', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="certificateUrl">Certificate URL</Label>
                <Input
                  id="certificateUrl"
                  type="url"
                  value={editingItem.certificateUrl}
                  onChange={(e) => updateEditingItem('certificateUrl', e.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editingItem.description}
                  onChange={(e) => updateEditingItem('description', e.target.value)}
                  placeholder="Describe what this certification covers or its significance..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave}
                  disabled={!editingItem.name || !editingItem.organization || !editingItem.issueDate}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Certificate
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