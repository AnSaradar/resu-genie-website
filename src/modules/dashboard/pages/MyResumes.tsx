import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGetMyResumes } from '@/services/resume/hook';
import { ResumeListItem } from '@/services/resume/types';
import { FileText, Download, Eye, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { useGetResumeDetails } from '@/services/resume/hook';
import { ResumePreview } from '../components/resume-generator/ResumePreview';
import { useState } from 'react';
import apiClient from '@/lib/axios';
import { mapBackendResumeToFrontend } from '@/utils/resume-mapper';

export default function MyResumes() {
  const navigate = useNavigate();
  const { data, isLoading, error, refetch } = useGetMyResumes();
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const {
    data: previewData,
    isLoading: previewLoading,
    error: previewError,
  } = useGetResumeDetails(previewId ?? '', !!previewId);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="h-40" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-destructive py-10">
        {error.message}
      </div>
    );
  }

  const resumes = data?.data.resumes ?? [];

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold">My Resumes</h2>
      {resumes.length === 0 ? (
        <div className="text-muted-foreground text-center py-20">
          You have not created any resumes yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((resume: ResumeListItem) => (
            <Card key={resume.id} className="hover:shadow-xl transition-shadow group relative">
              {/* Delete Icon Button in top-right */}
              <button
                className="absolute top-2 right-2 z-10 p-2 rounded-full hover:bg-red-100 text-red-600 hover:text-red-800 transition-colors"
                aria-label="Delete Resume"
                onClick={() => setDeletingId(resume.id)}
              >
                <Trash2 className="h-5 w-5" />
              </button>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-base font-semibold truncate max-w-[180px]">
                    {resume.resume_name}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {resume.created_at && (
                  <p className="text-xs text-muted-foreground">
                    Created: {new Date(resume.created_at).toLocaleDateString()}
                  </p>
                )}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 gap-1"
                    onClick={() => {
                      setPreviewId(resume.id);
                      setModalOpen(true);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                    Preview
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 gap-1"
                    onClick={() => {
                      try {
                        navigate(`/dashboard/generate/${resume.id}`);
                      } catch (err) {
                        alert('Failed to open resume for editing. Please try again.');
                      }
                    }}
                  >
                    <Download className="h-4 w-4" />
                    Edit & Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      <Dialog open={modalOpen} onOpenChange={(open) => {
        setModalOpen(open);
        if (!open) setPreviewId(null);
      }}>
        <DialogContent className="max-w-4xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Resume Preview</DialogTitle>
            <DialogClose asChild>
              <Button variant="outline" className="absolute top-4 right-4">Close</Button>
            </DialogClose>
          </DialogHeader>
          {previewLoading && <div className="py-10 text-center">Loading...</div>}
          {previewError && <div className="py-10 text-center text-destructive">{previewError.message}</div>}
          {previewData && previewData.resume && (
            <ResumePreview
              data={mapBackendResumeToFrontend(previewData.resume)}
              onUpdate={() => {}}
              onNext={() => {}}
              onPrevious={() => {}}
              isFirstStep={false}
              isLastStep={false}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingId} onOpenChange={(open) => { if (!open) setDeletingId(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Resume</DialogTitle>
          </DialogHeader>
          <div className="py-4">Are you sure you want to delete this resume? This action cannot be undone.</div>
          {deleteError && <div className="text-destructive mb-2">{deleteError}</div>}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeletingId(null)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={async () => {
                setDeleteError(null);
                try {
                  await apiClient.delete(`/api/v1/resume/${deletingId}`);
                  setDeletingId(null);
                  refetch();
                } catch (err: any) {
                  setDeleteError(err?.response?.data?.message || 'Failed to delete resume.');
                }
              }}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 