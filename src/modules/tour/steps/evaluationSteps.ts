import { Step } from 'react-joyride';

export const getEvaluationSteps = (language: 'en' | 'ar'): Step[] => {
  const isArabic = language === 'ar';
  
  return [
    {
      target: '[data-tour="resume-selector"]',
      content: isArabic
        ? 'اختر السيرة الذاتية التي تريد تقييمها من القائمة المنسدلة.'
        : 'Select the resume you want to evaluate from the dropdown menu.',
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '[data-tour="evaluation-types"]',
      content: isArabic
        ? 'أنواع التقييم: اختر التقييم الشامل (مُوصى به) أو التقييم القياسي للتحليل المتقدم.'
        : 'Evaluation Types: Choose comprehensive evaluation (recommended) or standard evaluation for advanced analysis.',
      placement: 'bottom',
    },
    {
      target: '[data-tour="evaluate-button"]',
      content: isArabic
        ? 'اضغط هنا لبدء التقييم. سيحلل الذكاء الاصطناعي سيرتك الذاتية ويعطيك تقرير مفصل.'
        : 'Click here to start the evaluation. AI will analyze your resume and give you a detailed report.',
      placement: 'top',
    },
    {
      target: '[data-tour="evaluation-results"]',
      content: isArabic
        ? 'نتائج التقييم: ستظهر هنا النتائج التفصيلية مع النقاط والتوصيات والتحليل الشامل لتحسين سيرتك الذاتية.'
        : 'Evaluation Results: Detailed results with scores, recommendations, and comprehensive analysis to improve your resume will appear here.',
      placement: 'top',
    },
    {
      target: '[data-tour="evaluation-history"]',
      content: isArabic
        ? 'تاريخ التقييمات: يمكنك رؤية جميع التقييمات السابقة ومقارنة النتائج.'
        : 'Evaluation History: You can see all previous evaluations and compare results.',
      placement: 'left',
    },
    {
      target: '[data-tour="download-report"]',
      content: isArabic
        ? 'تحميل التقرير: يمكنك تحميل تقرير التقييم كملف PDF للمراجعة لاحقاً.'
        : 'Download Report: You can download the evaluation report as a PDF for later review.',
      placement: 'top',
    }
  ];
};
