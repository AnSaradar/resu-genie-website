import api from '@/lib/axios';
import { AxiosProgressEvent } from 'axios';
import { ResumeCreateRequest } from './types';

export interface UploadResponse {
  signal: string;
  message: string;
  file_id: string;
  original_filename: string;
}

export interface ExtractResponse {
  signal: string;
  message: string;
  resume_data: ResumeCreateRequest;
}

export interface CreateFromCVResponse {
  signal: string;
  message: string;
  resume_id: string;
}

const cvUploadService = {
  /**
   * Upload a CV file and extract data in a single operation
   * @param file The CV file to upload
   * @param llmModel Optional LLM model to use for parsing
   * @param onUploadProgress Callback for upload progress tracking
   * @returns Promise with extracted resume data
   */
  uploadAndExtractCV: async (
    file: File, 
    llmModel?: string,
    onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
  ): Promise<ExtractResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    
    if (llmModel) {
      formData.append('llm_model', llmModel);
    }
    
    const response = await api.post<ExtractResponse>('/api/v1/cv-upload/upload-and-extract', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
    
    return response.data;
  },
  
  /**
   * Create a new resume from extracted CV data
   * @param resumeData The structured resume data
   * @returns Promise with created resume ID
   */
  createResumeFromCV: async (resumeData: ResumeCreateRequest): Promise<CreateFromCVResponse> => {
    const response = await api.post<CreateFromCVResponse>('/api/v1/cv-upload/create-resume', resumeData);
    return response.data;
  }
};

export default cvUploadService;
