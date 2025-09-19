import { Step } from 'react-joyride';

export const getDashboardSteps = (language: 'en' | 'ar'): Step[] => {
  const isArabic = language === 'ar';
  
  return [
    {
      target: '[data-tour="profile-widget"]',
      content: isArabic 
        ? 'هذا هو مؤشر إكمال الملف الشخصي. يظهر لك تقدمك في ملء معلوماتك الأساسية التي ستستخدم لملء السيرة الذاتية تلقائياً.'
        : 'This is your profile completion widget. It shows your progress in filling out your basic information that will be used to auto-fill your resume.',
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '[data-tour="platform-features"]',
      content: isArabic
        ? 'هنا يمكنك الوصول إلى الميزات الرئيسية: بناء السيرة الذاتية، تقييم السيرة الذاتية، والقوالب (قريباً).'
        : 'Here you can access the main features: Build Resume, Resume Evaluator, and Templates (coming soon).',
      placement: 'bottom',
    },
    {
      target: '[data-tour="quick-actions"]',
      content: isArabic
        ? 'الإجراءات السريعة تساعدك على البدء بسرعة في المهام الأساسية مثل إنشاء سيرة ذاتية جديدة أو إكمال ملفك الشخصي.'
        : 'Quick actions help you get started quickly with essential tasks like creating a new resume or completing your profile.',
      placement: 'top',
    },
    {
      target: '[data-tour="recent-activity"]',
      content: isArabic
        ? 'هنا يمكنك رؤية السير الذاتية والتقييمات الأخيرة. سيساعدك هذا على تتبع عملك.'
        : 'Here you can see your recent resumes and evaluations. This will help you track your work.',
      placement: 'top',
    }
  ];
};
