import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { 
  FileText, 
  Check,
  Eye,
  Palette
} from 'lucide-react';
import { ResumeData } from '../../pages/ResumeGenerator';
import imagineTemplate from '@/assets/images/imagine_template.jpg';
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

interface TemplateSelectionStepProps {
  data: ResumeData;
  onUpdate: (data: Partial<ResumeData>) => void;
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
    id: 'imagine',
    name: 'IMAGINE',
    description: 'A modern and visually engaging resume template with creative layout.',
    category: 'Default',
    thumbnail: imagineTemplate,
    features: ['Creative Layout', 'Visual Appeal', 'Modern Design'],
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

export function TemplateSelectionStep({ data, onUpdate }: TemplateSelectionStepProps) {
  const selectedTemplate = data.selectedTemplate;
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  const filteredTemplates = TEMPLATES;

  const handleTemplateSelect = (templateId: string) => {
    onUpdate({ selectedTemplate: templateId });
  };

  const handlePreview = (templateId: string) => {
    const template = TEMPLATES.find(t => t.id === templateId);
    if (template) {
      setPreviewTemplate(template);
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
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Palette className="h-6 w-6 text-blue-600" />
          <h3 className="text-lg font-semibold">Choose Your Template</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Select a template that best represents your professional style
        </p>
      </div>

      {/* Category Filter removed for demo simplicity */}

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        <AnimatePresence mode="wait">
          {filteredTemplates.map((template) => (
            <motion.div
              key={template.id}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, scale: 0.8 }}
              layout
            >
              <Card 
                className={`relative cursor-pointer transition-all hover:shadow-lg group w-full flex flex-col ${
                  selectedTemplate === template.id 
                    ? 'ring-2 ring-blue-500 shadow-lg' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => handleTemplateSelect(template.id)}
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
                
                {/* Premium badge removed for demo */}

                <CardContent className="p-0 flex flex-col h-full">
                  {/* Template Thumbnail - Original Size */}
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
                        handlePreview(template.id);
                      }}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Preview
                    </Button>
                  </div>

                  {/* Template Info - Flexible Height */}
                  <div className="p-4 flex-1 flex flex-col min-h-32">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-sm">{template.name}</h4>
                      {/* Category badge removed */}
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-3 leading-relaxed line-clamp-3 overflow-hidden">
                      {template.description}
                    </p>
                    
                    {/* Features - Flexible Height */}
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
        </AnimatePresence>
      </div>

      {/* Selection Status */}
      {selectedTemplate && (
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
            . You can change this anytime.
          </p>
        </motion.div>
      )}

      {!selectedTemplate && (
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

      {/* Navigation handled by StepNavigation component */}

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
    </motion.div>
  );
} 