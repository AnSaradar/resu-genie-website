import apiClient from '@/lib/axios';
import {
  CertificationData,
  CertificationUpdateData,
  CertificationResponse,
  CertificationApiResponse,
  Certification,
} from './types';

/**
 * Convert CertificationResponse to frontend Certification interface
 */
export const flattenCertification = (cert: CertificationResponse): Certification => {
  return {
    id: cert.id,
    name: cert.name,
    organization: cert.issuing_organization,
    issueDate: cert.issue_date,
    certificateUrl: cert.certificate_url || '',
    description: cert.description || ''
  };
};

/**
 * Convert frontend Certification to CertificationData for API calls
 */
export const prepareCertificationData = (cert: Certification): CertificationData => {
  return {
    name: cert.name,
    issuing_organization: cert.organization,
    issue_date: cert.issueDate,
    certificate_url: cert.certificateUrl || undefined,
    description: cert.description || undefined
  };
};

/** POST /api/v1/certification/ */
export const addCertifications = async (certs: CertificationData[]): Promise<CertificationResponse[]> => {
  try {
    const response = await apiClient.post<CertificationApiResponse>('/api/v1/certification/', certs);
    return response.data.certifications || [];
  } catch (error: any) {
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error('Failed to add certifications');
  }
};

/** PUT /api/v1/certification/{cert_id} */
export const updateCertification = async (
  certId: string,
  updateData: CertificationUpdateData
): Promise<CertificationResponse> => {
  try {
    const response = await apiClient.put<CertificationApiResponse>(`/api/v1/certification/${certId}`, updateData);
    return response.data.certification!;
  } catch (error: any) {
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error('Failed to update certification');
  }
};

/** DELETE /api/v1/certification/{cert_id} */
export const deleteCertification = async (certId: string): Promise<void> => {
  try {
    await apiClient.delete(`/api/v1/certification/${certId}`);
  } catch (error: any) {
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error('Failed to delete certification');
  }
};

/** GET /api/v1/certification/ */
export const getAllCertifications = async (): Promise<CertificationResponse[]> => {
  try {
    const response = await apiClient.get<CertificationApiResponse>('/api/v1/certification/');
    return response.data.certifications || [];
  } catch (error: any) {
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error('Failed to get certifications');
  }
}; 