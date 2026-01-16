import { motion } from "framer-motion";
import { Lock, Sparkles } from "lucide-react";
import { useAppTranslation } from "@/i18n/hooks";
import { Trans } from "react-i18next";


const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: "easeOut",
    },
  },
};

export function Pricing() {
  const { t } = useAppTranslation('landing');
  
  const plans = [
    {
      id: 'starter',
      name: t('pricing.plans.starter.name'),
      price: t('pricing.plans.starter.price'),
      highlight: t('pricing.plans.starter.highlight'),
      features: t('pricing.plans.starter.features', { returnObjects: true }) as string[],
    },
    {
      id: 'pro',
      name: t('pricing.plans.pro.name'),
      price: t('pricing.plans.pro.price'),
      highlight: t('pricing.plans.pro.highlight'),
      features: t('pricing.plans.pro.features', { returnObjects: true }) as string[],
    },
    {
      id: 'company',
      name: t('pricing.plans.company.name'),
      price: t('pricing.plans.company.price'),
      highlight: t('pricing.plans.company.highlight'),
      features: t('pricing.plans.company.features', { returnObjects: true }) as string[],
    },
  ];
  return (
    <section
      id="pricing"
      className="py-16 md:py-24 xl:py-32 2xl:py-40 bg-slate-950 relative overflow-hidden"
    >
      {/* Funky background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-gradient-to-tr from-blue-500/25 via-cyan-400/15 to-fuchsia-500/10 blur-3xl" />
        <div className="absolute bottom-[-6rem] right-[-4rem] h-48 w-48 rounded-full bg-gradient-to-tr from-red-500/25 via-rose-500/20 to-orange-400/15 blur-3xl" />
      </div>

      <div className="container relative px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-12">
        <motion.div
          className="text-center max-w-3xl xl:max-w-4xl 2xl:max-w-5xl mx-auto mb-10 md:mb-14 xl:mb-18 2xl:mb-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 xl:gap-3 2xl:gap-4 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-4 py-1 xl:px-5 xl:py-1.5 2xl:px-6 2xl:py-2 text-xs xl:text-sm 2xl:text-base font-medium uppercase tracking-[0.18em] text-emerald-100 mb-4 xl:mb-5 2xl:mb-6"
          >
            <Sparkles className="h-3.5 w-3.5 xl:h-4 xl:w-4 2xl:h-5 2xl:w-5 text-emerald-300" />
            {t('pricing.badge')}
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-white mb-3 xl:mb-4 2xl:mb-5 leading-tight"
          >
            <Trans
              i18nKey="pricing.title"
              ns="landing"
              components={{
                gradient: <span className="bg-gradient-to-r from-emerald-300 via-cyan-300 to-sky-300 bg-clip-text text-transparent" />
              }}
            />
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl text-slate-300 leading-relaxed"
          >
            {t('pricing.subtitle')}
          </motion.p>
        </motion.div>

        {/* Disabled mock plans */}
        <motion.div
          className="grid gap-6 md:gap-8 xl:gap-10 2xl:gap-12 md:grid-cols-3 items-stretch"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
        >
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              variants={itemVariants}
              className="relative flex flex-col h-full rounded-2xl xl:rounded-3xl 2xl:rounded-[2rem] border border-slate-700/90 bg-slate-900/70 px-5 py-6 md:px-6 md:py-8 xl:px-8 xl:py-10 2xl:px-10 2xl:py-12 overflow-hidden group"
            >
              {/* Disabled overlay & big X */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="relative h-full w-full flex items-center justify-center">
                  <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px]" />
                  <svg
                    viewBox="0 0 100 100"
                    aria-hidden="true"
                    className="h-32 w-32 md:h-40 md:w-40 xl:h-48 xl:w-48 2xl:h-56 2xl:w-56 text-red-500/45 drop-shadow-[0_0_18px_rgba(248,113,113,0.55)]"
                  >
                    <line
                      x1="15"
                      y1="15"
                      x2="85"
                      y2="85"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeLinecap="round"
                    />
                    <line
                      x1="85"
                      y1="15"
                      x2="15"
                      y2="85"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>

              {/* Card content (dimmed) */}
              <div className="relative flex flex-col gap-4 xl:gap-5 2xl:gap-6 flex-1 opacity-40 group-hover:opacity-60 transition-opacity duration-300">
                <div className="flex items-center justify-between gap-3 xl:gap-4 2xl:gap-5">
                  <div>
                    <p className="text-xs xl:text-sm 2xl:text-base font-semibold uppercase tracking-[0.18em] text-slate-400">
                      {plan.name}
                    </p>
                    <p className="mt-1 text-lg md:text-xl xl:text-2xl 2xl:text-3xl font-semibold text-white">
                      {plan.price}
                    </p>
                  </div>
                  <Lock className="h-5 w-5 xl:h-6 xl:w-6 2xl:h-7 2xl:w-7 text-slate-500" />
                </div>
                <p className="text-xs md:text-sm xl:text-base 2xl:text-lg text-slate-400 leading-relaxed">
                  {plan.highlight}
                </p>
                {plan.features && (
                  <ul className="mt-3 xl:mt-4 2xl:mt-5 space-y-2 xl:space-y-3 2xl:space-y-4 text-xs md:text-sm xl:text-base 2xl:text-lg text-slate-300">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 xl:gap-3 2xl:gap-4 leading-relaxed"
                      >
                        <span className="mt-[5px] h-1.5 w-1.5 xl:h-2 xl:w-2 2xl:h-2.5 2xl:w-2.5 rounded-full bg-emerald-400" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-4 xl:mt-5 2xl:mt-6">
                  <p className="inline-flex items-center justify-center rounded-full border border-slate-700/80 bg-slate-900/70 px-3 py-1 xl:px-4 xl:py-1.5 2xl:px-5 2xl:py-2 text-[11px] xl:text-xs 2xl:text-sm font-medium uppercase tracking-[0.16em] text-slate-300">
                    {t('pricing.plans_disabled')}
                  </p>
                </div>
              </div>

              {/* Free badge removed to avoid overlap / visual clutter */}
            </motion.div>
          ))}
        </motion.div>

        {/* Explicit free message */}
        <motion.div
          className="mt-10 md:mt-12 xl:mt-16 2xl:mt-20 text-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.p
            variants={itemVariants}
            className="inline-flex flex-wrap items-center justify-center gap-2 xl:gap-3 2xl:gap-4 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-4 py-2 xl:px-5 xl:py-2.5 2xl:px-6 2xl:py-3 text-xs md:text-sm xl:text-base 2xl:text-lg text-emerald-100"
          >
            {t('pricing.all_free')}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}


