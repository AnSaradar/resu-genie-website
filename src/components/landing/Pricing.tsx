import { motion } from "framer-motion";
import { Lock, Sparkles } from "lucide-react";


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

const plans = [
  {
    name: "Starter",
    price: "$0 / mo",
    highlight: "Perfect for your first AI‑powered resume",
    features: [
      "Generate ATS‑friendly resumes with guided prompts",
      "Create tailored cover letters for each application",
      "Get instant resume feedback & improvement suggestions",
    ],
  },
  {
    name: "Pro",
    price: "$9 / mo",
    highlight: "For power job hunters who live on LinkedIn",
    features: [
      "Everything in Starter, plus deeper resume insights",
      "AI job‑match scoring for every posting you paste in",
      "Keep multiple role/market‑specific resume versions",
    ],
  },
  {
    name: "Company Bundle",
    price: "$49 / mo",
    highlight: "For teams who shortlist candidates at scale",
    features: [
      "Upload role descriptions for open positions",
      "Get an AI‑curated shortlist of suitable candidates",
      "Share structured feedback with hiring managers",
    ],
  },
];

export function Pricing() {
  return (
    <section
      id="pricing"
      className="py-16 md:py-24 bg-slate-950 relative overflow-hidden"
    >
      {/* Funky background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-gradient-to-tr from-blue-500/25 via-cyan-400/15 to-fuchsia-500/10 blur-3xl" />
        <div className="absolute bottom-[-6rem] right-[-4rem] h-48 w-48 rounded-full bg-gradient-to-tr from-red-500/25 via-rose-500/20 to-orange-400/15 blur-3xl" />
      </div>

      <div className="container relative px-4 md:px-6 lg:px-8">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-10 md:mb-14"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-4 py-1 text-xs font-medium uppercase tracking-[0.18em] text-emerald-100 mb-4"
          >
            <Sparkles className="h-3.5 w-3.5 text-emerald-300" />
            100% Free – All Genies Unleashed
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3"
          >
            No paywall. No trial.{" "}
            <span className="bg-gradient-to-r from-emerald-300 via-cyan-300 to-sky-300 bg-clip-text text-transparent">
              Just magic.
            </span>
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-sm md:text-base lg:text-lg text-slate-300"
          >
            Every feature – Cover Letter, Job Matcher, Resume Evaluator – is{" "}
            <span className="font-semibold text-emerald-200">
              fully unlocked
            </span>{" "}
            while we&apos;re in early access. Use it like a premium tool, pay
            exactly <span className="font-semibold text-emerald-300">$0</span>.
          </motion.p>
        </motion.div>

        {/* Disabled mock plans */}
        <motion.div
          className="grid gap-6 md:gap-8 md:grid-cols-3 items-stretch"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
        >
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              variants={itemVariants}
              className="relative flex flex-col h-full rounded-2xl border border-slate-700/90 bg-slate-900/70 px-5 py-6 md:px-6 md:py-8 overflow-hidden group"
            >
              {/* Disabled overlay & big X */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="relative h-full w-full flex items-center justify-center">
                  <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px]" />
                  <svg
                    viewBox="0 0 100 100"
                    aria-hidden="true"
                    className="h-32 w-32 md:h-40 md:w-40 text-red-500/45 drop-shadow-[0_0_18px_rgba(248,113,113,0.55)]"
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
              <div className="relative flex flex-col gap-4 flex-1 opacity-40 group-hover:opacity-60 transition-opacity duration-300">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      {plan.name}
                    </p>
                    <p className="mt-1 text-lg md:text-xl font-semibold text-white">
                      {plan.price}
                    </p>
                  </div>
                  <Lock className="h-5 w-5 text-slate-500" />
                </div>
                <p className="text-xs md:text-sm text-slate-400">
                  {plan.highlight}
                </p>
                {plan.features && (
                  <ul className="mt-3 space-y-2 text-xs md:text-sm text-slate-300">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2"
                      >
                        <span className="mt-[5px] h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-4">
                  <p className="inline-flex items-center justify-center rounded-full border border-slate-700/80 bg-slate-900/70 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-slate-300">
                    Coming later – when the magic graduates
                  </p>
                </div>
              </div>

              {/* Free badge removed to avoid overlap / visual clutter */}
            </motion.div>
          ))}
        </motion.div>

        {/* Explicit free message */}
        <motion.div
          className="mt-10 md:mt-12 text-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.p
            variants={itemVariants}
            className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-4 py-2 text-xs md:text-sm text-emerald-100"
          >
            <span>
              All future subscription bundles are{" "}
              <span className="font-semibold text-emerald-300">disabled</span>{" "}
              for now.
            </span>
            <span className="font-semibold text-emerald-200">
              You get the premium experience for free.
            </span>
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}


