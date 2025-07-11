import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  FileText, 
  Check,
  Eye,
  Palette
} from 'lucide-react';
import { ResumeData } from '../../pages/ResumeGenerator';

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
  onNext: () => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

const TEMPLATES: Template[] = [
  {
    id: 'moey',
    name: 'MOEY',
    description: 'A clean and professional resume template.',
    category: 'Default',
    thumbnail: '/templates/not-found.png',
    features: [],
    isPremium: false,
  },
  {
    id: 'imagine',
    name: 'IMAGINE',
    description: 'A modern and visually engaging resume template.',
    category: 'Default',
    thumbnail: '/templates/not-found.png',
    features: [],
    isPremium: false,
  },
  {
    id: 'jobscan',
    name: 'JOBSCAN',
    description: 'ATS-friendly template optimized for job scanning systems.',
    category: 'Default',
    thumbnail: '/templates/not-found.png',
    features: [],
    isPremium: false,
  },
];

export function TemplateSelectionStep({ data, onUpdate, onNext, onPrevious, isFirstStep, isLastStep }: TemplateSelectionStepProps) {
  const selectedTemplate = data.selectedTemplate;

  const filteredTemplates = TEMPLATES;

  const handleTemplateSelect = (templateId: string) => {
    onUpdate({ selectedTemplate: templateId });
  };

  const handlePreview = (templateId: string) => {
    // TODO: Implement template preview functionality
    console.log('Preview template:', templateId);
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                className={`relative cursor-pointer transition-all hover:shadow-lg ${
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

                <CardContent className="p-0">
                  {/* Template Thumbnail */}
                  <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-t-lg flex items-center justify-center">
                    <FileText className="h-16 w-16 text-gray-400" />
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

                  {/* Template Info */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-sm">{template.name}</h4>
                      {/* Category badge removed */}
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                      {template.description}
                    </p>
                    
                    {/* Features */}
                    <div className="flex flex-wrap gap-1">
                      {template.features.map((feature, index) => (
                        <span
                          key={index}
                          className="text-xs bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 px-2 py-1 rounded-full"
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

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={isFirstStep}
        >
          Previous
        </Button>
        <Button 
          onClick={onNext}
          disabled={!selectedTemplate}
        >
          Next: Preview & Generate
        </Button>
      </div>
    </motion.div>
  );
} 