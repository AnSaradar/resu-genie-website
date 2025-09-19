import { Step } from 'react-joyride';

export const getProfileSteps = (language: 'en' | 'ar'): Step[] => {
  const isArabic = language === 'ar';
  
  return [
    {
      target: '[data-tour="profile-nav"]',
      content: isArabic
        ? 'هذا هو مركز البيانات الخاص بك. هنا يمكنك إدارة جميع معلوماتك الشخصية والمهنية.'
        : 'This is your data center. Here you can manage all your personal and professional information.',
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '[data-tour="personal-info"]',
      content: isArabic
        ? 'المعلومات الشخصية: الاسم، البريد الإلكتروني، الهاتف، العنوان. هذه المعلومات ستستخدم في جميع سيرك الذاتية.'
        : 'Personal Information: Name, email, phone, address. This information will be used in all your resumes.',
      placement: 'right',
    },
    {
      target: '[data-tour="work-experience"]',
      content: isArabic
        ? 'الخبرة العملية: أضف جميع وظائفك السابقة. هذه البيانات ستستخدم لملء قسم الخبرة في سيرك الذاتية تلقائياً.'
        : 'Work Experience: Add all your previous jobs. This data will be used to auto-fill the experience section in your resumes.',
      placement: 'right',
    },
    {
      target: '[data-tour="education"]',
      content: isArabic
        ? 'التعليم: أضف شهاداتك الأكاديمية. سيساعدك هذا في الحصول على توصيات وظائف ودورات مناسبة.'
        : 'Education: Add your academic degrees. This will help you get relevant job and course recommendations.',
      placement: 'right',
    },
    {
      target: '[data-tour="skills"]',
      content: isArabic
        ? 'المهارات: أضف مهاراتك التقنية والشخصية. هذا مهم جداً للحصول على توصيات دقيقة.'
        : 'Skills: Add your technical and soft skills. This is very important for getting accurate recommendations.',
      placement: 'right',
    },
    {
      target: '[data-tour="languages"]',
      content: isArabic
        ? 'اللغات: أضف اللغات التي تتحدثها ومستوى إتقانك لكل منها.'
        : 'Languages: Add the languages you speak and your proficiency level in each.',
      placement: 'right',
    },
    {
      target: '[data-tour="certifications"]',
      content: isArabic
        ? 'الشهادات: أضف شهاداتك المهنية والدورات التدريبية. هذا يزيد من قوة ملفك الشخصي.'
        : 'Certifications: Add your professional certificates and training courses. This strengthens your profile.',
      placement: 'right',
    },
    {
      target: '[data-tour="personal-projects"]',
      content: isArabic
        ? 'المشاريع الشخصية: أضف مشاريعك الشخصية والعمل التطوعي. هذا يظهر مهاراتك العملية.'
        : 'Personal Projects: Add your personal projects and volunteer work. This shows your practical skills.',
      placement: 'right',
    },
    {
      target: '[data-tour="links"]',
      content: isArabic
        ? 'الروابط: أضف روابط LinkedIn، الموقع الشخصي، GitHub. هذا يساعد أصحاب العمل في معرفة المزيد عنك.'
        : 'Links: Add LinkedIn, personal website, GitHub links. This helps employers learn more about you.',
      placement: 'right',
    }
  ];
};
