import { ResumeData } from '@/modules/dashboard/pages/ResumeGenerator';
import { ResumeCreateRequest } from '@/services/resume/types';

// Helper mappers
const toMonth = (iso?: string): string => {
  if (!iso) return '';
  return iso.length >= 7 ? iso.substring(0, 7) : iso;
};

const mapSkillLevel = (level?: string): number => {
  switch ((level || '').toLowerCase()) {
    case 'beginner': return 1;
    case 'intermediate': return 3;
    case 'advanced': return 4;
    case 'expert': return 5;
    default: return 3;
  }
};

const mapLanguageLevelToCEFR = (level?: string): string => {
  switch ((level || '').toLowerCase()) {
    case 'basic': return 'A1';
    case 'conversational': return 'B1';
    case 'fluent': return 'C1';
    case 'native': return 'C2';
    default: return 'A2';
  }
};

export function mapCVDataToFrontend(cvData: ResumeCreateRequest): ResumeData {
  const p = cvData.personal_info || ({} as any);

  const experience = [
    ...((cvData.career_experiences || []).map((exp: any) => ({
      id: crypto.randomUUID(),
      title: exp.title || exp.position || '',
      seniority_level: exp.seniority_level || '',
      company: exp.company_name || exp.company || '',
      city: exp.location?.city || '',
      country: exp.location?.country || '',
      start_date: toMonth(exp.start_date || ''),
      end_date: toMonth(exp.end_date || ''),
      currently_working: !!exp.is_current,
      description: exp.description || '',
      is_volunteer: false,
      work_type: exp.work_type || '',
      work_model: exp.work_model || '',
      duration: ''
    })) as any[]),
    ...((cvData.volunteering_experiences || []).map((exp: any) => ({
      id: crypto.randomUUID(),
      title: exp.title || exp.position || '',
      seniority_level: exp.seniority_level || '',
      company: exp.organization || exp.company || '',
      city: exp.location?.city || '',
      country: exp.location?.country || '',
      start_date: toMonth(exp.start_date || ''),
      end_date: toMonth(exp.end_date || ''),
      currently_working: !!exp.is_current,
      description: exp.description || '',
      is_volunteer: true,
      work_type: exp.work_type || '',
      work_model: exp.work_model || '',
      duration: ''
    })) as any[]),
  ];

  const education = (cvData.education || []).map((edu: any) => ({
    id: crypto.randomUUID(),
    institution: edu.institution_name || edu.institution || '',
    degree: edu.degree || '',
    field: edu.field_of_study || edu.field || '',
    start_date: toMonth(edu.start_date || ''),
    end_date: toMonth(edu.graduation_date || edu.end_date || ''),
    currently_studying: !!edu.is_current,
    description: edu.description || '',
  }));

  const skills = [
    ...((cvData.technical_skills || []).map((s: any) => ({
      id: crypto.randomUUID(),
      name: s.name || '',
      level: mapSkillLevel(s.proficiency_level),
      is_soft_skill: false,
    })) as any[]),
    ...((cvData.soft_skills || []).map((s: any) => ({
      id: crypto.randomUUID(),
      name: s.name || '',
      level: mapSkillLevel(s.proficiency_level),
      is_soft_skill: true,
    })) as any[]),
  ];

  const languages = (cvData.languages || []).map((l: any) => ({
    id: crypto.randomUUID(),
    name: l.name || '',
    proficiency: mapLanguageLevelToCEFR(l.proficiency_level),
    isNative: !!l.is_native,
  }));

  const certificates = (cvData.certifications || []).map((c: any) => ({
    id: crypto.randomUUID(),
    name: c.name || '',
    organization: c.issuing_organization || '',
    issueDate: toMonth(c.issue_date || ''),
    certificateUrl: c.credential_url || c.certificate_url || '',
    description: c.description || '',
  }));

  const personalProjects = (cvData.personal_projects || []).map((p: any) => ({
    id: crypto.randomUUID(),
    title: p.title || p.name || '',
    description: p.description || '',
    technologies: Array.isArray(p.technologies) ? p.technologies : [],
    startDate: p.start_date || '',
    endDate: p.end_date || '',
    isOngoing: !!p.is_current || !!p.is_ongoing,
    liveUrl: p.url || '',
    projectUrl: p.repository_url || '',
  }));

  const result: ResumeData = {
    personalInfo: {
      firstName: p.first_name || '',
      lastName: p.last_name || '',
      email: p.email || '',
      phone: p.phone || '',
      city: p.address?.city || '',
      country: p.address?.country || p.country_of_residence || '',
      linkedinUrl: p.linkedin_url || '',
      websiteUrl: p.website_url || '',
      currentPosition: p.current_position || '',
      profileSummary: p.profile_summary || '',
      seniorityLevel: p.current_seniority_level || '',
      workField: p.work_field || '',
      yearsOfExperience: p.years_of_experience || '',
      birthDate: p.birth_date || '',
    },
    experience,
    education,
    skills,
    languages,
    certificates,
    personalProjects,
    selectedTemplate: 'moey',
    resumeName: cvData.resume_name || 'Imported Resume',
  };

  return result;
}
