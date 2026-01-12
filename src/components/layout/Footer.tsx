import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { useAppTranslation } from "@/i18n/hooks";

export function Footer() {
  const { t } = useAppTranslation('common');
  const currentYear = new Date().getFullYear();

  const handleSocialMediaClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    toast(t('footer.social_coming_soon'), {
      duration: 3000,
      icon: "ℹ️",
    });
  };

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      const headerOffset = 80; // Account for sticky navbar height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <footer className="bg-background border-t">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                {t('app.name')}
              </span>
            </motion.div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">{t('footer.product')}</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#features"
                  onClick={(e) => handleSmoothScroll(e, 'features')}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  {t('footer.features')}
                </a>
              </li>
              <li>
                <a
                  href="#templates"
                  onClick={(e) => handleSmoothScroll(e, 'templates')}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  {t('footer.templates')}
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  onClick={(e) => handleSmoothScroll(e, 'pricing')}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  {t('footer.pricing')}
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">{t('footer.resources')}</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#blog"
                  onClick={(e) => {
                    e.preventDefault();
                    toast(t('footer.social_coming_soon'), {
                      duration: 3000,
                      icon: "ℹ️",
                    });
                  }}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  {t('footer.blog')}
                </a>
              </li>
              <li>
                <a
                  href="#guides"
                  onClick={(e) => {
                    e.preventDefault();
                    toast(t('footer.social_coming_soon'), {
                      duration: 3000,
                      icon: "ℹ️",
                    });
                  }}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  {t('footer.guides')}
                </a>
              </li>
              <li>
                <a
                  href="#examples"
                  onClick={(e) => {
                    e.preventDefault();
                    toast(t('footer.social_coming_soon'), {
                      duration: 3000,
                      icon: "ℹ️",
                    });
                  }}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  {t('footer.examples')}
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">{t('footer.company')}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t('footer.about')}
                </Link>
              </li>
              <li>
                <Link
                  to="/about#contact"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t('footer.contact')}
                </Link>
              </li>
              <li>
                <Link
                  to="/policy#policy"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t('footer.privacy')}
                </Link>
              </li>
              <li>
                <Link
                  to="/policy#terms"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t('footer.terms')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            {t('footer.copyright', { year: currentYear })}
          </p>
          <div className="flex items-center gap-4">
            <a
              href="#"
              onClick={handleSocialMediaClick}
              className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              aria-label="Follow us on Twitter"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
              </svg>
            </a>
            <a
              href="#"
              onClick={handleSocialMediaClick}
              className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              aria-label="Follow us on Facebook"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            <a
              href="#"
              onClick={handleSocialMediaClick}
              className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              aria-label="Follow us on Instagram"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </a>
            <a
              href="#"
              onClick={handleSocialMediaClick}
              className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              aria-label="Follow us on LinkedIn"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect width="4" height="12" x="2" y="9" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
} 