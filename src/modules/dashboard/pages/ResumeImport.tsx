import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { FileText, Plus } from 'lucide-react';
import CVUploadForm from '@/components/resume/CVUploadForm';

const ResumeImport: React.FC = () => {
  const navigate = useNavigate();

  const handleResumeCreated = (resumeId: string) => {
    navigate(`/dashboard/resume/${resumeId}`);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Create Resume</h1>
      
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid grid-cols-2 mb-8">
          <TabsTrigger value="upload">Import from CV</TabsTrigger>
          <TabsTrigger value="scratch">Create from Scratch</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload">
          <div className="max-w-2xl mx-auto">
            <CVUploadForm />
          </div>
        </TabsContent>
        
        <TabsContent value="scratch">
          <div className="max-w-2xl mx-auto">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Create Resume from Scratch</CardTitle>
                <CardDescription>
                  Build your resume by manually entering your information step by step
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/40">
                      <Plus className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold">Start from a Blank Canvas</h3>
                      <p className="text-sm text-muted-foreground">
                        Build your resume by filling out each section manually
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4 w-full max-w-md">
                    <div className="text-center text-sm text-muted-foreground mb-4">
                      This option allows you to create a resume by entering your information step by step through our guided process.
                    </div>
                    
                    <Button 
                      onClick={() => navigate('/dashboard/resume/new')}
                      className="w-full gap-2"
                      size="lg"
                    >
                      <FileText className="h-4 w-4" />
                      Start Creating Resume
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResumeImport;
