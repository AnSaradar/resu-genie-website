import { ResumeData, PersonalInfo } from '@/modules/dashboard/pages/ResumeGenerator';
import { ResumeCreateRequest } from '@/services/resume/types';

/**
 * Convert a YYYY-MM string coming from a <input type="month"> into YYYY-MM-DD (day = 01).
 * If the input is empty or already full ISO date, it returns the input unchanged.
 */
const normalizeMonthString = (value?: string): string | undefined => {
  if (!value) return undefined;
  // If value already length 10 (YYYY-MM-DD) just return
  if (value.length >= 10) return value;
  return `${value}-01`;
};

/** Map UI language proficiency labels to CEFR enum used by backend */
const mapLanguageProficiency = (value: string): string => {
  const mapping: Record<string, string> = {
    elementary: 'A1',
    limited: 'A2',
    professional: 'B2',
    full: 'C1',
    native: 'C2',
  };
  return mapping[value] ?? 'A1';
};

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

export function mapResumeDataToCreateRequest(data: ResumeData): ResumeCreateRequest {
  // Personal info mapping (snake_case keys)
  const p: PersonalInfo = data.personalInfo || ({} as any);
  const personal_info = {
    first_name: p.firstName,
    last_name: p.lastName,
    email: p.email,
    phone: p.phone,
    birth_date: p.birthDate,
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

  // Experiences
  const career_experiences = (data.experience || []).map((e) => {
    const location = e.city || e.country ? { city: e.city, country: e.country } : undefined;
    return {
      title: e.title,
      seniority_level: e.seniority_level,
      company: e.company,
      location,
      start_date: normalizeMonthString(e.start_date),
      end_date: normalizeMonthString(e.end_date),
      currently_working: e.currently_working,
      description: e.description,
      is_volunteer: e.is_volunteer,
    };
  });

  // Education
  const education = (data.education || []).map((edu: any) => ({
    institution: edu.institution,
    degree: edu.degree,
    field: edu.field,
    start_date: normalizeMonthString(edu.start_date),
    end_date: normalizeMonthString(edu.end_date),
    currently_studying: edu.currently_studying,
    description: edu.description,
  }));

  // Skills
  const { technical, soft } = splitSkills(data.skills || []);

  // Certifications
  const certifications = (data.certificates || []).map((c: any) => ({
    name: c.name,
    issuing_organization: c.organization,
    issue_date: normalizeMonthString(c.issueDate),
    certificate_url: c.certificateUrl,
    description: c.description,
  }));

  // Languages
  const languages = (data.languages || []).map((l: any) => ({
    name: l.name,
    proficiency: mapLanguageProficiency(l.proficiency),
    is_native: l.isNative,
  }));

  // Personal projects
  const personal_projects = (data.personalProjects || []).map((p: any) => ({
    title: p.name ?? p.title,
    description: p.description,
    technologies: p.technologies,
    start_date: p.startDate ? p.startDate : undefined,
    end_date: p.endDate ? p.endDate : undefined,
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