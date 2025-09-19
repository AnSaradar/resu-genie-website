import { Step } from 'react-joyride';

export const getResumeSteps = (language: 'en' | 'ar'): Step[] => {
  const isArabic = language === 'ar';
  
  return [
    {
      target: '[data-tour="resume-steps"]',
      content: isArabic
        ? 'هذا هو منشئ السيرة الذاتية. سيرشدك خلال 9 خطوات لإنشاء سيرة ذاتية احترافية.'
        : 'This is the resume builder. It will guide you through 9 steps to create a professional resume.',
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '[data-tour="step-navigation"]',
      content: isArabic
        ? 'شريط التنقل بين الخطوات. يمكنك الانتقال بين الخطوات أو العودة لتعديل أي قسم.'
        : 'Step navigation bar. You can move between steps or go back to edit any section.',
      placement: 'bottom',
    },
    {
      target: '[data-tour="current-step"]',
      content: isArabic
        ? 'الخطوة الحالية: المعلومات الشخصية. سيتم ملؤها تلقائياً من ملفك الشخصي.'
        : 'Current step: Personal Information. This will be auto-filled from your profile data.',
      placement: 'right',
    },
    {
      target: '[data-tour="step-progress"]',
      content: isArabic
        ? 'مؤشر التقدم يظهر لك كم خطوة أكملت من إجمالي الخطوات.'
        : 'Progress indicator shows how many steps you\'ve completed out of the total steps.',
      placement: 'left',
    },
    {
      target: '[data-tour="auto-fill-button"]',
      content: isArabic
        ? 'زر الملء التلقائي: يملأ هذا القسم تلقائياً من بيانات ملفك الشخصي.'
        : 'Auto-fill button: Fills this section automatically from your profile data.',
      placement: 'top',
    },
    {
      target: '[data-tour="next-step-button"]',
      content: isArabic
        ? 'زر "التالي" للانتقال للخطوة التالية. تأكد من حفظ بياناتك أولاً.'
        : 'Next button to move to the next step. Make sure to save your data first.',
      placement: 'top',
    },
    {
      target: '[data-tour="template-preview"]',
      content: isArabic
        ? 'معاينة القالب: ستظهر هنا معاينة مباشرة لسيرتك الذاتية أثناء إنشائها.'
        : 'Template preview: A live preview of your resume will appear here as you build it.',
      placement: 'left',
    }
  ];
};
