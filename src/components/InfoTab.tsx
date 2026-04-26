"use client";

import { useSettings } from "@/lib/settings";
import { t } from "@/lib/i18n";
import { LogoMark } from "@/app/page";

const FORMULAS = [
  {
    titleEn: "Monthly Payment",
    titleDe: "Monatsrate",
    expr: "M = L \u00B7 r / (1 \u2212 (1 + r)\u207B\u207F)",
    descEn: "Annuity formula. L = principal, r = monthly rate, n = months.",
    descDe: "Annuitatenformel. L = Darlehensbetrag, r = Monatszins, n = Monate.",
  },
  {
    titleEn: "Total Interest",
    titleDe: "Zinsen gesamt",
    expr: "I = M \u00B7 n \u2212 L",
    descEn: "Sum of all payments minus the original loan amount.",
    descDe: "Summe aller Zahlungen minus ursprunglicher Darlehensbetrag.",
  },
  {
    titleEn: "Remaining Debt",
    titleDe: "Restschuld",
    expr: "B(k) = L \u00B7 (1 + r)\u1D4F \u2212 M \u00B7 ((1 + r)\u1D4F \u2212 1) / r",
    descEn: "Balance after k monthly payments have been made.",
    descDe: "Restschuld nach k monatlichen Zahlungen.",
  },
];

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
    <div className="flex-1 overflow-y-auto">
      <div className="flex flex-col gap-5.5 px-4 pt-1 pb-7">
        {/* App identity */}
        <div className="flex items-center gap-3.5 py-2 px-1">
          <LogoMark size={56} />
          <div>
            <div className="font-serif text-[26px] font-medium text-text leading-tight">
              {t("info.title", lang)}
            </div>
            <div className="text-xs text-muted mt-1" style={{ fontVariantNumeric: "tabular-nums" }}>
              Version 2.4.0 &middot; Apr 2026
            </div>
          </div>
        </div>

        {/* About */}
        <div>
          <SectionLabel>{t("info.about", lang)}</SectionLabel>
          <Card>
            <p className="text-sm text-text-secondary leading-relaxed m-0">
              {t("info.aboutText", lang)}
            </p>
          </Card>
        </div>

        {/* Features */}
        <div>
          <SectionLabel hint={`${features.length} ${lang === "de" ? "Elemente" : "items"}`}>
            {t("info.features", lang)}
          </SectionLabel>
          <Card noPad>
            {features.map((f, i) => (
              <div
                key={i}
                className="flex items-start gap-3 px-4 py-3"
                style={{ borderBottom: i === features.length - 1 ? "none" : "1px solid var(--color-line)" }}
              >
                <span
                  className="shrink-0 w-[22px] h-[22px] rounded-full flex items-center justify-center mt-0.5"
                  style={{ background: "var(--color-primary-soft)", color: "var(--color-primary)" }}
                >
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12.5l4.5 4.5L19 7" />
                  </svg>
                </span>
                <span className="text-sm text-text leading-snug">{f}</span>
              </div>
            ))}
          </Card>
        </div>

        {/* Formulas */}
        <div>
          <SectionLabel>{t("info.formulas", lang)}</SectionLabel>
          <Card noPad>
            {FORMULAS.map((f, i) => (
              <div
                key={i}
                className="p-4"
                style={{ borderBottom: i === FORMULAS.length - 1 ? "none" : "1px solid var(--color-line)" }}
              >
                <div className="font-serif text-[15px] font-semibold text-text">
                  {lang === "de" ? f.titleDe : f.titleEn}
                </div>
                <div
                  className="text-[13px] text-primary mt-2 px-3 py-2"
                  style={{
                    fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
                    background: "var(--color-surface-alt)",
                    borderRadius: "var(--r-sm)",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {f.expr}
                </div>
                <div className="text-[12.5px] text-text-secondary mt-2 leading-relaxed">
                  {lang === "de" ? f.descDe : f.descEn}
                </div>
              </div>
            ))}
          </Card>
        </div>

        {/* Source link */}
        <a
          href="https://github.com/sebmueller91/loan-calculator"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-4 no-underline text-text"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-line)",
            borderRadius: "var(--r-lg)",
          }}
        >
          <span className="text-primary">
            <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 19c-4 1.5-4-2-6-2.5" />
              <path d="M15 22v-3.5a3 3 0 0 0-.9-2.3c3-.3 6-1.5 6-6.5a5 5 0 0 0-1.4-3.5 4.7 4.7 0 0 0-.1-3.5s-1.1-.3-3.6 1.4a12.4 12.4 0 0 0-6.5 0C5.9 1.4 4.8 1.7 4.8 1.7a4.7 4.7 0 0 0-.1 3.5A5 5 0 0 0 3.3 8.7c0 5 3 6.2 6 6.5A3 3 0 0 0 8.4 18V22" />
            </svg>
          </span>
          <div className="flex-1">
            <div className="text-sm font-semibold">{t("info.githubRepo", lang)}</div>
            <div className="text-[11px] text-muted">sebmueller91/loan-calculator</div>
          </div>
          <span className="text-muted">
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 5h5v5" /><path d="M19 5l-8 8" />
              <path d="M19 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4" />
            </svg>
          </span>
        </a>

        <div className="text-center text-[11px] text-muted pt-1.5">
          {t("info.builtWith", lang)}
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div className="flex justify-between items-baseline mb-2 px-1">
      <div className="text-[11px] tracking-widest uppercase text-muted font-semibold">{children}</div>
      {hint && <div className="text-[11px] text-muted">{hint}</div>}
    </div>
  );
}

function Card({ children, noPad }: { children: React.ReactNode; noPad?: boolean }) {
  return (
    <div style={{
      background: "var(--color-surface)",
      borderRadius: "var(--r-lg)",
      border: "1px solid var(--color-line)",
      padding: noPad ? 0 : "var(--pad)",
      overflow: noPad ? "hidden" : undefined,
    }}>
      {children}
    </div>
  );
}
