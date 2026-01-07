/**
 * Field label mappings to convert camelCase/snake_case field names
 * to proper display labels matching account data sections
 */

export const getFieldLabel = (fieldName: string, sectionType?: string): string => {
  // Personal Info fields
  if (sectionType === 'personalInfo') {
    const personalInfoLabels: Record<string, string> = {
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      phone: 'Phone',
      city: 'City',
      country: 'Country',
      linkedinUrl: 'LinkedIn',
      websiteUrl: 'Website',
      currentPosition: 'Current Position',
      profileSummary: 'Professional Summary',
      seniorityLevel: 'Seniority Level',
      workField: 'Work Field',
      yearsOfExperience: 'Years of Experience',
      birthDate: 'Birth Date',
    };
    return personalInfoLabels[fieldName] || fieldName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  }

  // Experience fields
  if (sectionType === 'experience') {
    const experienceLabels: Record<string, string> = {
      title: 'Job Title',
      company: 'Company',
      city: 'City',
      country: 'Country',
      start_date: 'Start Date',
      end_date: 'End Date',
      currently_working: 'Currently Working',
      description: 'Description',
      seniority_level: 'Seniority Level',
      work_type: 'Work Type',
      work_model: 'Work Model',
      is_volunteer: 'Type',
    };
    return experienceLabels[fieldName] || fieldName.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').replace(/^./, str => str.toUpperCase());
  }

  // Education fields
  if (sectionType === 'education') {
    const educationLabels: Record<string, string> = {
      institution: 'Institution',
      degree: 'Degree Type',
      field: 'Field of Study',
      start_date: 'Start Date',
      end_date: 'End Date',
      currently_studying: 'Currently Studying',
      description: 'Description',
    };
    return educationLabels[fieldName] || fieldName.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').replace(/^./, str => str.toUpperCase());
  }

  // Skills fields
  if (sectionType === 'skills') {
    const skillsLabels: Record<string, string> = {
      name: 'Skill Name',
      proficiency: 'Proficiency Level',
      is_soft_skill: 'Skill Type',
    };
    return skillsLabels[fieldName] || fieldName.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').replace(/^./, str => str.toUpperCase());
  }

  // Languages fields
  if (sectionType === 'languages') {
    const languagesLabels: Record<string, string> = {
      name: 'Language',
      proficiency: 'Proficiency',
      isNative: 'Native Speaker',
      is_native: 'Native Speaker',
    };
    return languagesLabels[fieldName] || fieldName.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').replace(/^./, str => str.toUpperCase());
  }

  // Certifications fields
  if (sectionType === 'certificates') {
    const certificatesLabels: Record<string, string> = {
      name: 'Certificate Name',
      organization: 'Issuing Organization',
      issueDate: 'Issue Date',
      issue_date: 'Issue Date',
      certificateUrl: 'Certificate URL',
      certificate_url: 'Certificate URL',
      description: 'Description',
    };
    return certificatesLabels[fieldName] || fieldName.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').replace(/^./, str => str.toUpperCase());
  }

  // Links fields
  if (sectionType === 'links') {
    const linksLabels: Record<string, string> = {
      websiteName: 'Website Name',
      website_name: 'Website Name',
      websiteUrl: 'Website URL',
      website_url: 'Website URL',
    };
    return linksLabels[fieldName] || fieldName.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').replace(/^./, str => str.toUpperCase());
  }

  // Personal Projects fields
  if (sectionType === 'personalProjects') {
    const projectsLabels: Record<string, string> = {
      title: 'Project Title',
      name: 'Project Name',
      description: 'Description',
      technologies: 'Technologies',
      startDate: 'Start Date',
      start_date: 'Start Date',
      endDate: 'End Date',
      end_date: 'End Date',
      isOngoing: 'Ongoing',
      is_ongoing: 'Ongoing',
      liveUrl: 'Live URL',
      live_url: 'Live URL',
      url: 'Live URL',
      projectUrl: 'Repository URL',
      project_url: 'Repository URL',
      repository_url: 'Repository URL',
    };
    return projectsLabels[fieldName] || fieldName.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').replace(/^./, str => str.toUpperCase());
  }

  // Default: capitalize and add spaces
  return fieldName.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').replace(/^./, str => str.toUpperCase());
};

/**
 * Format field value for display
 */
export const formatFieldValue = (fieldName: string, value: any, sectionType?: string): string => {
  // Handle dates
  if (fieldName.includes('date') || fieldName.includes('Date')) {
    if (!value) return '';
    try {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
      }
    } catch (e) {
      // If date parsing fails, return as string
    }
  }

  // Handle special cases first (before general boolean handler)
  if (sectionType === 'skills' && fieldName === 'is_soft_skill') {
    return value ? 'Soft' : 'Career';
  }

  if (sectionType === 'experience' && fieldName === 'is_volunteer') {
    return value ? 'Volunteer' : 'Work Experience';
  }

  // Handle boolean values
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  // Handle URLs - show as clickable links in display
  if (fieldName.includes('url') || fieldName.includes('Url') || fieldName.includes('URL')) {
    return value || '';
  }

  if (sectionType === 'languages' && (fieldName === 'isNative' || fieldName === 'is_native')) {
    return value ? 'Yes' : 'No';
  }

  if (sectionType === 'personalProjects' && (fieldName === 'isOngoing' || fieldName === 'is_ongoing')) {
    return value ? 'Yes' : 'No';
  }

  if (sectionType === 'experience' && fieldName === 'currently_working') {
    return value ? 'Yes' : 'No';
  }

  if (sectionType === 'education' && fieldName === 'currently_studying') {
    return value ? 'Yes' : 'No';
  }

  // Default: return as string
  return String(value || '');
};

