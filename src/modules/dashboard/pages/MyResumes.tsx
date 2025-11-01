import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGetMyResumes, useRenameResume } from '@/services/resume/hook';
import { ResumeListItem } from '@/services/resume/types';
import { 
  FileText, 
  Download, 
  Eye, 
  Trash2, 
  Calendar, 
  Clock, 
  MoreVertical,
  Search,
  Filter,
  Grid3X3,
  List,
  Plus,
  FilePlus,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Edit3
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { useGetResumeDetails } from '@/services/resume/hook';
import { ResumePreview } from '../components/resume-generator/ResumePreview';
import { useState } from 'react';
import apiClient from '@/lib/axios';
import { mapBackendResumeToFrontend } from '@/utils/resume-mapper';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export default function MyResumes() {
  const navigate = useNavigate();
  const { data, isLoading, error, refetch } = useGetMyResumes();
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'modified'>('modified');
  const [selectedResumes, setSelectedResumes] = useState<string[]>([]);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [renameError, setRenameError] = useState<string | null>(null);
  const {
    data: previewData,
    isLoading: previewLoading,
    error: previewError,
  } = useGetResumeDetails(previewId ?? '', !!previewId);
  
  const renameResumeMutation = useRenameResume();

  // Helper functions
  const getResumeStatus = (resume: ResumeListItem) => {
    if (!resume.updated_at || resume.updated_at === resume.created_at) {
      return 'draft';
    }
    return 'complete';
  };

  const getResumeWordCount = (_resume: ResumeListItem) => {
    // This would be calculated from resume data, for now return mock data
    return Math.floor(Math.random() * 500) + 200;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const filteredAndSortedResumes = () => {
    if (!data?.data.resumes) return [];
    
    let filtered = data.data.resumes.filter((resume: ResumeListItem) =>
      resume.resume_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort resumes
    filtered.sort((a: ResumeListItem, b: ResumeListItem) => {
      switch (sortBy) {
        case 'name':
          return a.resume_name.localeCompare(b.resume_name);
        case 'date':
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
        case 'modified':
        default:
          return new Date(b.updated_at || b.created_at || 0).getTime() - new Date(a.updated_at || a.created_at || 0).getTime();
      }
    });

    return filtered;
  };

  const handleSelectResume = (resumeId: string) => {
    setSelectedResumes(prev => 
      prev.includes(resumeId) 
        ? prev.filter(id => id !== resumeId)
        : [...prev, resumeId]
    );
  };

  const handleRenameResume = async () => {
    if (!renamingId || !newName.trim()) {
      setRenameError('Please enter a valid name');
      return;
    }

    try {
      setRenameError(null);
      await renameResumeMutation.mutateAsync({
        resumeId: renamingId,
        payload: { new_name: newName.trim() }
      });
      
      // Close dialog and reset state
      setRenamingId(null);
      setNewName('');
      setRenameError(null);
    } catch (error) {
      // Error is handled by the hook's onError callback
    }
  };

  const openRenameDialog = (resume: ResumeListItem) => {
    setRenamingId(resume.id);
    setNewName(resume.resume_name);
    setRenameError(null);
  };

  const handleSelectAll = () => {
    const resumes = filteredAndSortedResumes();
    if (selectedResumes.length === resumes.length) {
      setSelectedResumes([]);
    } else {
      setSelectedResumes(resumes.map((r: ResumeListItem) => r.id));
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
        
        {/* Search and filters skeleton */}
        <div className="flex gap-4">
          <div className="h-10 w-80 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-24 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-24 bg-gray-200 rounded animate-pulse" />
        </div>
        
        {/* Cards skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="h-48 animate-pulse">
              <CardContent className="p-6 space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
                <div className="h-3 bg-gray-200 rounded w-2/3" />
                <div className="flex gap-2">
                  <div className="h-8 bg-gray-200 rounded flex-1" />
                  <div className="h-8 bg-gray-200 rounded flex-1" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
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

  const resumes = filteredAndSortedResumes();

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="h-8 w-8 text-blue-600" />
            My Resumes
          </h2>
          <p className="text-muted-foreground mt-1">
            {resumes.length} resume{resumes.length !== 1 ? 's' : ''} • Manage and export your resumes
          </p>
        </div>
        <Button 
          onClick={() => navigate('/dashboard/generate')}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Resume
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search resumes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {resumes.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
              className="gap-2"
            >
              {selectedResumes.length === resumes.length ? 'Deselect All' : 'Select All'}
            </Button>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Sort by {sortBy}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSortBy('modified')}>
                Last Modified
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('date')}>
                Created Date
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('name')}>
                Name
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedResumes.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-blue-600" />
            <span className="font-medium text-blue-800 dark:text-blue-300">
              {selectedResumes.length} resume{selectedResumes.length !== 1 ? 's' : ''} selected
            </span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Export Selected
            </Button>
            <Button variant="destructive" size="sm">
              Delete Selected
            </Button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {resumes.length === 0 ? (
        <div className="text-center py-20">
          <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
            <FilePlus className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No resumes yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Create your first professional resume in minutes. Choose from our templates and start building your career.
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => navigate('/dashboard/generate')} className="gap-2">
              <Sparkles className="h-4 w-4" />
              Create Resume
            </Button>
            <Button variant="outline" onClick={() => navigate('/dashboard/generate')}>
              Start from Template
            </Button>
          </div>
        </div>
      ) : (
        <div className={cn(
          "gap-6",
          viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" 
            : "space-y-4"
        )}>
          {resumes.map((resume: ResumeListItem) => {
            const status = getResumeStatus(resume);
            const wordCount = getResumeWordCount(resume);
            const isSelected = selectedResumes.includes(resume.id);
            
            return (
              <Card 
                key={resume.id} 
                className={cn(
                  "group relative transition-all duration-200 hover:shadow-lg",
                  isSelected && "ring-2 ring-blue-500 shadow-lg",
                  viewMode === 'list' && "flex"
                )}
              >
                {/* Selection Checkbox */}
                <div className="absolute top-3 left-3 z-10">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleSelectResume(resume.id)}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                </div>

                {/* Actions Menu */}
                <div className="absolute top-3 right-3 z-20">
                  <DropdownMenu modal={true}>
                    <DropdownMenuTrigger 
                      className="inline-flex items-center justify-center h-8 w-8 p-0 rounded-md transition-opacity opacity-30 group-hover:opacity-100 data-[state=open]:opacity-100 focus:opacity-100 hover:bg-accent hover:text-accent-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      type="button"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onSelect={() => {
                        setPreviewId(resume.id);
                        setModalOpen(true);
                      }}>
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => {
                        navigate(`/dashboard/generate/${resume.id}`);
                      }}>
                        <Download className="h-4 w-4 mr-2" />
                        Edit & Download
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => {
                        openRenameDialog(resume);
                      }}>
                        <Edit3 className="h-4 w-4 mr-2" />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onSelect={() => {
                          setDeletingId(resume.id);
                        }}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {viewMode === 'grid' ? (
                  <>
                    <CardHeader className="pb-3">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg font-semibold truncate">
                    {resume.resume_name}
                  </CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge 
                              variant={status === 'complete' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {status === 'complete' ? (
                                <>
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Complete
                                </>
                              ) : (
                                <>
                                  <AlertCircle className="h-3 w-3 mr-1" />
                                  Draft
                                </>
                              )}
                            </Badge>
                          </div>
                        </div>
                </div>
              </CardHeader>
                    
              <CardContent className="space-y-4">
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>Created {formatDate(resume.created_at || '')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>Modified {formatDate(resume.updated_at || resume.created_at || '')}</span>
                        </div>
                      </div>
                      
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
                          onClick={() => navigate(`/dashboard/generate/${resume.id}`)}
                  >
                    <Download className="h-4 w-4" />
                          Edit
                  </Button>
                </div>
              </CardContent>
                  </>
                ) : (
                  // List view
                  <div className="flex items-center p-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 mr-4">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold truncate">{resume.resume_name}</h3>
                        <Badge 
                          variant={status === 'complete' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {status === 'complete' ? 'Complete' : 'Draft'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span>Created {formatDate(resume.created_at || '')}</span>
                        <span>• Modified {formatDate(resume.updated_at || resume.created_at || '')}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setPreviewId(resume.id);
                          setModalOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => navigate(`/dashboard/generate/${resume.id}`)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                )}
            </Card>
            );
          })}
        </div>
      )}

      {/* Enhanced Preview Modal */}
      <Dialog open={modalOpen} onOpenChange={(open) => {
        setModalOpen(open);
        if (!open) setPreviewId(null);
      }}>
        <DialogContent className="max-w-6xl overflow-y-auto max-h-[95vh]">
          <DialogHeader className="pb-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Resume Preview
              </DialogTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (previewId) {
                      navigate(`/dashboard/generate/${previewId}`);
                    }
                  }}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Edit Resume
                </Button>
            <DialogClose asChild>
                  <Button variant="outline" size="sm">Close</Button>
            </DialogClose>
              </div>
            </div>
          </DialogHeader>
          
          <div className="space-y-4">
            {previewLoading && (
              <div className="py-20 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading resume preview...</p>
              </div>
            )}
            
            {previewError && (
              <div className="py-20 text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <p className="text-destructive font-medium mb-2">Failed to load preview</p>
                <p className="text-muted-foreground">{previewError.message}</p>
              </div>
            )}
            
          {previewData && previewData.resume && (
              <div className="border rounded-lg overflow-hidden">
            <ResumePreview
              data={mapBackendResumeToFrontend(previewData.resume)}
              onUpdate={() => {}}
              onNext={() => {}}
              onPrevious={() => {}}
              isFirstStep={false}
              isLastStep={false}
            />
              </div>
          )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Rename Dialog */}
      <Dialog open={!!renamingId} onOpenChange={(open) => { 
        if (!open) {
          setRenamingId(null);
          setNewName('');
          setRenameError(null);
        }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit3 className="h-5 w-5" />
              Rename Resume
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div>
                <label htmlFor="resume-name" className="block text-sm font-medium mb-2">
                  Resume Name
                </label>
                <Input
                  id="resume-name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Enter new resume name"
                  maxLength={100}
                  className={renameError ? 'border-red-500' : ''}
                />
                {renameError && (
                  <p className="text-sm text-red-600 mt-1">{renameError}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {newName.length}/100 characters
                </p>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-3">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Note:</strong> If a resume with this name already exists, a number will be automatically added (e.g., "My Resume (1)").
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setRenamingId(null);
                setNewName('');
                setRenameError(null);
              }}
              disabled={renameResumeMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRenameResume}
              disabled={renameResumeMutation.isPending || !newName.trim()}
            >
              {renameResumeMutation.isPending ? 'Renaming...' : 'Rename'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Enhanced Delete Confirmation Dialog */}
      <Dialog open={!!deletingId} onOpenChange={(open) => { if (!open) setDeletingId(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-5 w-5" />
              Delete Resume
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="font-medium mb-1">Are you sure you want to delete this resume?</p>
                <p className="text-sm text-muted-foreground">
                  This action cannot be undone. The resume will be permanently removed from your account.
                </p>
              </div>
            </div>
          </div>
          {deleteError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm text-red-800 dark:text-red-300">{deleteError}</span>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeletingId(null)}>
              Cancel
            </Button>
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
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete Resume
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 