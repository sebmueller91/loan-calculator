"use client";

import { useSettings } from "@/lib/settings";
import { t } from "@/lib/i18n";

export default function InfoTab() {
  const { settings } = useSettings();
  const lang = settings.language;

  const features = [
    t("info.feature1", lang),
    t("info.feature2", lang),
    t("info.feature3", lang),
    t("info.feature4", lang),
    t("info.feature5", lang),
    t("info.feature6", lang),
    t("info.feature7", lang),
    t("info.feature8", lang),
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-surface-alt">
      <div className="p-5 space-y-5">
        {/* App header */}
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-text">{t("info.title", lang)}</h1>
          <p className="text-sm text-text-secondary mt-1">v1.0.0</p>
        </div>

        {/* About */}
        <Section title={t("info.about", lang)}>
          <p className="text-sm text-text-secondary leading-relaxed">
            {t("info.aboutText", lang)}
          </p>
        </Section>

        {/* Features */}
        <Section title={t("info.features", lang)}>
          <ul className="text-sm text-text-secondary space-y-2">
            {features.map((text, i) => (
              <Feature key={i} text={text} />
            ))}
          </ul>
        </Section>

        {/* Formulas */}
        <Section title={t("info.formulas", lang)}>
          <div className="text-sm text-text-secondary space-y-3">
            <FormulaBlock
              title={t("info.formulaMonthlyPayment", lang)}
              formula="M = P &times; r(1+r)^n / ((1+r)^n - 1)"
              description={t("info.formulaDesc1", lang)}
            />
            <FormulaBlock
              title={t("info.formulaLoanTerm", lang)}
              formula="n = -log(1 - P&times;r/M) / log(1+r)"
              description={t("info.formulaDesc2", lang)}
            />
            <FormulaBlock
              title={t("info.formulaRemainingDebt", lang)}
              formula="B = P(1+r)^n - M((1+r)^n - 1)/r"
              description={t("info.formulaDesc3", lang)}
            />
          </div>
        </Section>

        {/* Source code */}
        <Section title={t("info.sourceCode", lang)}>
          <a
            href="https://github.com/sebmueller91/loan-calculator"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 bg-white rounded-lg border border-border hover:border-primary-light transition-colors"
          >
            <svg className="w-6 h-6 text-text" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <div>
              <div className="text-sm font-semibold text-text">{t("info.githubRepo", lang)}</div>
              <div className="text-xs text-text-secondary">sebmueller91/loan-calculator</div>
            </div>
            <svg className="w-4 h-4 text-text-secondary ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </Section>

        <p className="text-center text-xs text-text-secondary pb-4">
          {t("info.builtWith", lang)}
        </p>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-border p-4">
      <h2 className="text-sm font-bold text-text mb-3">{title}</h2>
      {children}
    </div>
  );
}

function Feature({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2">
      <svg className="w-4 h-4 text-primary mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
      {text}
    </li>
  );
}

function FormulaBlock({ title, formula, description }: { title: string; formula: string; description: string }) {
  return (
    <div>
      <div className="font-semibold text-text text-xs mb-0.5">{title}</div>
      <code className="text-xs bg-surface-alt px-2 py-1 rounded block mb-0.5">{formula}</code>
      <div className="text-xs text-text-secondary">{description}</div>
    </div>
  );
}
