import { ResumeData, PersonalInfo } from '@/modules/dashboard/pages/ResumeGenerator';
import { ResumeCreateRequest } from '@/services/resume/types';

/**
 * Convert a YYYY-MM string coming from a <input type="month"> into YYYY-MM-DD (day = 01).
 * If the input is empty or already full ISO date, it returns the input unchanged.
 * Ensures the date is in proper ISO format for backend serialization.
 */
const normalizeMonthString = (value?: string): string | undefined => {
  if (!value) return undefined;
  // If value already length 10 (YYYY-MM-DD) just return
  if (value.length >= 10) return value;
  // Convert YYYY-MM to YYYY-MM-DD (backend expects full date)
  // Ensure proper ISO format with leading zeros
  const [year, month] = value.split('-');
  if (year && month) {
    // Pad month with leading zero if needed and append day
    const paddedMonth = month.padStart(2, '0');
    return `${year}-${paddedMonth}-01`;
  }
  return value;
};

/**
 * Ensure a date string is in proper ISO format (YYYY-MM-DD)
 * This function validates and normalizes dates to prevent backend serialization errors
 */
const ensureValidISODate = (dateString?: string): string | undefined => {
  if (!dateString) return undefined;
  
  // Debug logging to identify problematic dates
  console.log('Processing date:', dateString, 'Type:', typeof dateString);
  
  // If it's already a valid ISO date, return as is
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    console.log('Date is already valid ISO format:', dateString);
    return dateString;
  }
  
  // If it's a month format (YYYY-MM), convert to YYYY-MM-01
  if (/^\d{4}-\d{1,2}$/.test(dateString)) {
    const [year, month] = dateString.split('-');
    if (year && month) {
      const paddedMonth = month.padStart(2, '0');
      const result = `${year}-${paddedMonth}-01`;
      console.log('Converted month format:', dateString, '->', result);
      return result;
    }
  }
  
  // If it's a valid date string, try to format it
  try {
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      const result = date.toISOString().split('T')[0]; // Convert to YYYY-MM-DD
      console.log('Converted date object:', dateString, '->', result);
      return result;
    }
  } catch (e) {
    console.warn('Invalid date format:', dateString);
  }
  
  // Return undefined for invalid dates
  console.warn('Could not process date, returning undefined:', dateString);
  return undefined;
};

/**
 * Convert backend date (YYYY-MM-DD) to frontend month format (YYYY-MM) for form inputs
 */
const convertBackendDateToFrontend = (dateString?: string): string | undefined => {
  if (!dateString) return undefined;
  // If it's already YYYY-MM format, return as is
  if (dateString.length === 7) return dateString;
  // Convert YYYY-MM-DD to YYYY-MM
  return dateString.substring(0, 7);
};

/** Map UI language proficiency labels to CEFR enum used by backend */
// const mapLanguageProficiency = (value: string): string => {
//   const mapping: Record<string, string> = {
//     elementary: 'A1',
//     limited: 'A2',
//     professional: 'B2',
//     full: 'C1',
//     native: 'C2', // Map native to C2 (highest level)
//   };
//   return mapping[value] ?? 'A1';
// };

/** Map backend CEFR levels to frontend descriptive labels */
// const mapBackendLanguageProficiency = (cefrLevel: string): string => {
//   const mapping: Record<string, string> = {
//     'A1': 'elementary',
//     'A2': 'limited',
//     'B1': 'limited', // Map B1 to limited as there's no exact match
//     'B2': 'professional',
//     'C1': 'full',
//     'C2': 'native', // Map C2 to native (highest level)
//   };
//   return mapping[cefrLevel] ?? 'elementary';
// };

/**
 * Split the skills array into technical_skills & soft_skills lists expected by backend.
 */
const splitSkills = (skills: any[]) => {
  const technical: any[] = [];
  const soft: any[] = [];
  skills.forEach((s) => {
    const dto = {
      name: s.name,
      // TODO: map numeric level 1-5 → enum string if backend requires, else undefined
      proficiency: undefined,
      is_soft_skill: s.is_soft_skill,
    };
    if (s.is_soft_skill) soft.push(dto);
    else technical.push(dto);
  });
  return { technical, soft };
};

/**
 * Map backend resume data to frontend format for display purposes
 * This function transforms the backend Resume schema to frontend ResumeData interface
 */
export function mapBackendResumeToFrontend(backendResume: any): ResumeData {
  // Transform personal info
  const personalInfo: PersonalInfo = {
    firstName: backendResume.personal_info?.first_name || '',
    lastName: backendResume.personal_info?.last_name || '',
    email: backendResume.personal_info?.email || '',
    phone: backendResume.personal_info?.phone || '',
    city: backendResume.personal_info?.address?.city || '',
    country: backendResume.personal_info?.address?.country || backendResume.personal_info?.country_of_residence || '',
    linkedinUrl: backendResume.personal_info?.linkedin_url || '',
    websiteUrl: backendResume.personal_info?.website_url || '',
    currentPosition: backendResume.personal_info?.current_position || '',
    profileSummary: backendResume.personal_info?.profile_summary || '',
    seniorityLevel: backendResume.personal_info?.current_seniority_level || '',
    workField: backendResume.personal_info?.work_field || '',
    yearsOfExperience: backendResume.personal_info?.years_of_experience || '',
    birthDate: backendResume.personal_info?.birth_date || '',
  };

  // Transform experiences (combine career and volunteering) - Convert dates to frontend format
  const experience = [
    ...(backendResume.career_experiences || []).map((exp: any) => ({
      ...exp,
      start_date: convertBackendDateToFrontend(exp.start_date),
      end_date: convertBackendDateToFrontend(exp.end_date),
      is_volunteer: false,
      // Ensure work_type and work_model are preserved
      work_type: exp.work_type,
      work_model: exp.work_model,
    })),
    ...(backendResume.volunteering_experiences || []).map((exp: any) => ({
      ...exp,
      start_date: convertBackendDateToFrontend(exp.start_date),
      end_date: convertBackendDateToFrontend(exp.end_date),
      is_volunteer: true,
      // Ensure work_type and work_model are preserved
      work_type: exp.work_type,
      work_model: exp.work_model,
    })),
  ];

  // Transform skills (combine technical and soft skills)
  const skills = [
    ...(backendResume.technical_skills || []).map((skill: any) => ({
      ...skill,
      is_soft_skill: false,
    })),
    ...(backendResume.soft_skills || []).map((skill: any) => ({
      ...skill,
      is_soft_skill: true,
    })),
  ];

  // Transform education - Convert dates to frontend format
  const education = (backendResume.education || []).map((edu: any) => ({
    ...edu,
    start_date: convertBackendDateToFrontend(edu.start_date),
    end_date: convertBackendDateToFrontend(edu.end_date),
  }));

  // Transform languages - Convert CEFR levels to frontend labels
  const languages = (backendResume.languages || []).map((lang: any) => ({
    ...lang,
    proficiency: lang.proficiency, // Backend already sends CEFR levels, no need to convert
    isNative: lang.is_native,
  }));

  // Transform certificates - Map backend field names to frontend field names
  const certificates = (backendResume.certifications || []).map((cert: any) => ({
    ...cert,
    organization: cert.issuing_organization || cert.organization || '',
    issueDate: cert.issue_date || cert.issueDate || '',
    certificateUrl: cert.certificate_url || cert.certificateUrl || '',
  }));
  
  // Transform personal projects - Convert dates to frontend format and map URL fields
  const personalProjects = (backendResume.personal_projects || []).map((project: any) => ({
    ...project,
    startDate: project.start_date ? convertBackendDateToFrontend(project.start_date) : undefined,
    endDate: project.end_date ? convertBackendDateToFrontend(project.end_date) : undefined,
    liveUrl: project.url,        // Map backend 'url' to frontend 'liveUrl'
    projectUrl: project.repository_url,  // Map backend 'repository_url' to frontend 'projectUrl'
  }));

  return {
    personalInfo,
    experience,
    education,
    skills,
    languages,
    certificates,
    personalProjects,
    selectedTemplate: undefined, // Not stored in backend
    resumeName: backendResume.resume_name, // Add resume name mapping
  };
}

export function mapResumeDataToCreateRequest(data: ResumeData): ResumeCreateRequest {
  // Personal info mapping (snake_case keys)
  const p: PersonalInfo = data.personalInfo || ({} as any);
  const personal_info = {
    first_name: p.firstName,
    last_name: p.lastName,
    email: p.email,
    phone: p.phone,
    birth_date: ensureValidISODate(p.birthDate),
    linkedin_url: p.linkedinUrl,
    website_url: p.websiteUrl,
    profile_summary: p.profileSummary,
    country_of_residence: p.country,
    address: p.city || p.country ? { city: p.city, country: p.country } : undefined,
    current_position: p.currentPosition,
    work_field: p.workField,
    years_of_experience: typeof p.yearsOfExperience === 'number' ? p.yearsOfExperience : undefined,
    current_seniority_level: p.seniorityLevel,
  };

  // Experiences - Include all fields including work_type and work_model
  const career_experiences = (data.experience || []).map((e) => {
    const location = e.city || e.country ? { city: e.city, country: e.country } : undefined;
    return {
      title: e.title,
      seniority_level: e.seniority_level,
      company: e.company,
      location,
      start_date: ensureValidISODate(e.start_date),
      end_date: ensureValidISODate(e.end_date),
      currently_working: e.currently_working,
      description: e.description,
      is_volunteer: e.is_volunteer,
      work_type: e.work_type,  // Include work_type field
      work_model: e.work_model  // Include work_model field
    };
  });

  // Education
  const education = (data.education || []).map((edu: any) => ({
    institution: edu.institution,
    degree: edu.degree,
    field: edu.field,
    start_date: ensureValidISODate(edu.start_date),
    end_date: ensureValidISODate(edu.end_date),
    currently_studying: edu.currently_studying,
    description: edu.description,
  }));

  // Skills
  const { technical, soft } = splitSkills(data.skills || []);

  // Certifications
  const certifications = (data.certificates || []).map((c: any) => ({
    name: c.name,
    issuing_organization: c.organization,
    issue_date: ensureValidISODate(c.issueDate),
    certificate_url: c.certificateUrl,
    description: c.description,
  }));

  // Languages - Map to correct CEFR levels
  const languages = (data.languages || []).map((l: any) => ({
    name: l.name,
    proficiency: l.proficiency, // Frontend now sends CEFR levels directly (A1, A2, B1, B2, C1, C2)
    is_native: l.isNative,
  }));

  // Personal projects - Fix field mapping (title vs name)
  const personal_projects = (data.personalProjects || []).map((p: any) => ({
    title: p.title || p.name, // Support both title and name for backward compatibility
    description: p.description,
    technologies: p.technologies,
    start_date: ensureValidISODate(p.startDate),
    end_date: ensureValidISODate(p.endDate),
    is_ongoing: p.isOngoing,
    url: p.liveUrl,
    repository_url: p.projectUrl,
  }));

  const result: ResumeCreateRequest = {
    resume_name: personal_info.first_name ? `${personal_info.first_name}'s Resume` : 'My Resume',
    personal_info,
    career_experiences,
    education,
    technical_skills: technical,
    soft_skills: soft,
    certifications,
    languages,
    personal_projects,
  } as ResumeCreateRequest;

  return result;
} 