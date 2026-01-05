import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { 
  FileText, 
  Check,
  Eye,
  Palette,
  Download,
  Loader2
} from 'lucide-react';
import simpleTemplate from '@/assets/images/simple_template.jpg';
import jobscanTemplate from '@/assets/images/jobscan_template.jpg';
import moeyTemplate from '@/assets/images/moey_template.jpg';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  features: string[];
  isPremium: boolean;
}

interface ExportResumeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExport: (templateId: string) => void;
  isExporting?: boolean;
}

const TEMPLATES: Template[] = [
  {
    id: 'moey',
    name: 'MOEY',
    description: 'A clean and professional resume template with modern design.',
    category: 'Default',
    thumbnail: moeyTemplate,
    features: ['Professional Layout', 'ATS-Friendly', 'Clean Design'],
    isPremium: false,
  },
  {
    id: 'simple',
    name: 'SIMPLE',
    description: 'Single-column, print-friendly style with concise contact row, bold section titles, and ATS-safe typography.',
    category: 'Default',
    thumbnail: simpleTemplate,
    features: ['Print-Friendly', 'ATS-Optimized', 'Clean Design'],
    isPremium: false,
  },
  {
    id: 'jobscan',
    name: 'JOBSCAN',
    description: 'ATS-friendly template optimized for job scanning systems.',
    category: 'Default',
    thumbnail: jobscanTemplate,
    features: ['ATS-Optimized', 'Professional', 'Structured Layout'],
    isPremium: false,
  },
];

export function ExportResumeDialog({ 
  open, 
  onOpenChange, 
  onExport,
  isExporting = false 
}: ExportResumeDialogProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  const handlePreview = (templateId: string) => {
    const template = TEMPLATES.find(t => t.id === templateId);
    if (template) {
      setPreviewTemplate(template);
    }
  };

  const handleExport = () => {
    if (selectedTemplate) {
      onExport(selectedTemplate);
    }
  };

  const handleClose = () => {
    if (!isExporting) {
      setSelectedTemplate(null);
      onOpenChange(false);
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
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Export Resume / CV
            </DialogTitle>
            <DialogDescription>
              Select a template for your resume. Your current account data will be used to generate the PDF.
            </DialogDescription>
          </DialogHeader>

          <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
              {TEMPLATES.map((template) => (
                <motion.div
                  key={template.id}
                  variants={itemVariants}
                >
                  <Card 
                    className={`relative cursor-pointer transition-all hover:shadow-lg group w-full flex flex-col ${
                      selectedTemplate === template.id 
                        ? 'ring-2 ring-blue-500 shadow-lg' 
                        : 'hover:shadow-md'
                    } ${isExporting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => !isExporting && handleTemplateSelect(template.id)}
                  >
                    {selectedTemplate === template.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2 z-10 bg-blue-500 text-white rounded-full p-1"
                      >
                        <Check className="h-4 w-4" />
                      </motion.div>
                    )}

                    <CardContent className="p-0 flex flex-col h-full">
                      {/* Template Thumbnail */}
                      <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-t-lg overflow-hidden group">
                        <img
                          src={template.thumbnail}
                          alt={`${template.name} template preview`}
                          className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/5 rounded-t-lg" />
                        
                        {/* Preview Button */}
                        <Button
                          variant="secondary"
                          size="sm"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isExporting) {
                              handlePreview(template.id);
                            }
                          }}
                          disabled={isExporting}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Preview
                        </Button>
                      </div>

                      {/* Template Info */}
                      <div className="p-4 flex-1 flex flex-col min-h-32">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-sm">{template.name}</h4>
                        </div>
                        
                        <p className="text-xs text-muted-foreground mb-3 leading-relaxed line-clamp-3 overflow-hidden">
                          {template.description}
                        </p>
                        
                        {/* Features */}
                        <div className="flex flex-wrap gap-1">
                          {template.features.map((feature, index) => (
                            <span
                              key={index}
                              className="text-xs bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 px-2 py-1 rounded-full whitespace-nowrap"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Selection Status */}
            {selectedTemplate && !isExporting && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Check className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-800 dark:text-blue-300">
                    Template Selected
                  </span>
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  You've selected{' '}
                  <strong>
                    {TEMPLATES.find(t => t.id === selectedTemplate)?.name}
                  </strong>
                  . Click Export to generate your resume.
                </p>
              </motion.div>
            )}

            {!selectedTemplate && !isExporting && (
              <motion.div
                variants={itemVariants}
                className="text-center p-8 border-2 border-dashed border-muted-foreground/20 rounded-lg"
              >
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-muted-foreground">
                  Click on a template to select it
                </p>
              </motion.div>
            )}

            {isExporting && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
              >
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                  <span className="font-medium text-blue-800 dark:text-blue-300">
                    Generating your resume PDF...
                  </span>
                </div>
              </motion.div>
            )}
          </motion.div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isExporting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleExport}
              disabled={!selectedTemplate || isExporting}
            >
              {isExporting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Export Resume
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Template Preview Modal */}
      <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              {previewTemplate?.name} Template Preview
            </DialogTitle>
            <DialogDescription>
              {previewTemplate?.description}
            </DialogDescription>
          </DialogHeader>
          
          {previewTemplate && (
            <div className="space-y-4">
              {/* Template Image */}
              <div className="relative bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden">
                <img
                  src={previewTemplate.thumbnail}
                  alt={`${previewTemplate.name} template preview`}
                  className="w-full h-auto object-contain"
                />
              </div>
              
              {/* Template Features */}
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Template Features:</h4>
                <div className="flex flex-wrap gap-2">
                  {previewTemplate.features.map((feature, index) => (
                    <span
                      key={index}
                      className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-3 py-1 rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setPreviewTemplate(null)}
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    handleTemplateSelect(previewTemplate.id);
                    setPreviewTemplate(null);
                  }}
                >
                  Select This Template
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

