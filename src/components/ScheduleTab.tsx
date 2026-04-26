"use client";

import { type CalculationResult } from "@/lib/calculations";
import { formatCurrency, formatDate, formatDateShort, formatPercent, formatMonths } from "@/lib/format";
import { useSettings } from "@/lib/settings";
import { t, getLocale } from "@/lib/i18n";

interface ScheduleTabProps {
  result: CalculationResult | null;
  onGoCalc: () => void;
}

export default function ScheduleTab({ result, onGoCalc }: ScheduleTabProps) {
  const { settings, currencySymbol } = useSettings();
  const lang = settings.language;
  const locale = getLocale(lang);
  const decimals = settings.decimalPlaces;

  if (!result || result.schedule.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <EmptyState
          title={t("schedule.empty", lang)}
          body={t("schedule.emptyHint", lang)}
          onAction={onGoCalc}
          actionLabel={lang === "de" ? "Zum Rechner" : "Go to Calculator"}
        />
      </div>
    );
  }

  const schedule = result.schedule;
  const startDate = schedule[0].date;
  const endDate = schedule[schedule.length - 1].date;
  const fmtCur = (v: number) => `${formatCurrency(v, locale, decimals)} ${currencySymbol}`;

  const summary = [
    [t("schedule.loanAmount", lang), fmtCur(result.loanAmount)],
    [t("schedule.loanTerm", lang), formatMonths(schedule.length, lang)],
    [t("schedule.interestRate", lang), `${formatPercent(result.annualInterestRate, locale)} %`],
    [t("schedule.monthlyPayment", lang), fmtCur(result.monthlyPayment)],
    [t("schedule.totalPayment", lang), fmtCur(result.totalPayment)],
    [t("schedule.totalInterest", lang), fmtCur(result.totalInterest)],
    [t("schedule.startDate", lang), formatDate(startDate, locale)],
    [t("schedule.endDate", lang), formatDate(endDate, locale)],
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="flex flex-col gap-4.5 px-4 pt-1 pb-7">
        {/* Summary */}
        <div>
          <SectionLabel>{lang === "de" ? "Zusammenfassung" : "Summary"}</SectionLabel>
          <Card>
            <div className="grid grid-cols-2 gap-x-4.5 gap-y-2.5">
              {summary.map(([k, v]) => (
                <div key={k}>
                  <div className="text-[11px] text-muted font-semibold tracking-wide uppercase">{k}</div>
                  <div className="text-sm text-text font-semibold mt-0.5" style={{ fontVariantNumeric: "tabular-nums" }}>{v}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Schedule table */}
        <div>
          <SectionLabel hint={`${schedule.length} ${lang === "de" ? "Zahlungen" : "payments"}`}>
            {lang === "de" ? "Tilgungsplan" : "Schedule"}
          </SectionLabel>
          <Card noPad>
            {/* Header */}
            <div
              className="text-[10.5px] font-bold tracking-wider uppercase text-muted px-3.5 py-2.5"
              style={{
                display: "grid",
                gridTemplateColumns: "28px 56px 1fr 1fr 1.25fr",
                columnGap: 10,
                background: "var(--color-surface-alt)",
                borderBottom: "1px solid var(--color-line)",
              }}
            >
              <div>#</div>
              <div>{t("schedule.month", lang)}</div>
              <div className="text-right">{t("schedule.interest", lang)}</div>
              <div className="text-right">{t("schedule.principal", lang)}</div>
              <div className="text-right">{t("schedule.remaining", lang)}</div>
            </div>

            {/* Rows */}
            <div className="max-h-[460px] overflow-y-auto">
              {schedule.map((entry, i) => (
                <div
                  key={entry.month}
                  className="px-3.5 text-[12.5px]"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "28px 56px 1fr 1fr 1.25fr",
                    columnGap: 10,
                    padding: "11px 14px",
                    fontVariantNumeric: "tabular-nums",
                    color: "var(--color-text)",
                    background: i % 2 === 0 ? "var(--color-surface)" : "var(--color-surface-alt)",
                    borderBottom: i === schedule.length - 1 ? "none" : "1px solid color-mix(in oklch, var(--color-line) 50%, transparent)",
                  }}
                >
                  <div className="text-muted font-semibold">{entry.month}</div>
                  <div className="text-text-secondary">{formatDateShort(entry.date, locale)}</div>
                  <div className="text-right">{formatCurrency(entry.interest, locale, decimals)}</div>
                  <div className="text-right">{formatCurrency(entry.principal, locale, decimals)}</div>
                  <div className="text-right font-bold text-text">{formatCurrency(entry.remainingDebt, locale, decimals)}</div>
                </div>
              ))}
            </div>
          </Card>
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
    <div
      style={{
        background: "var(--color-surface)",
        borderRadius: "var(--r-lg)",
        border: "1px solid var(--color-line)",
        padding: noPad ? 0 : "var(--pad)",
        overflow: noPad ? "hidden" : undefined,
      }}
    >
      {children}
    </div>
  );
}

function EmptyState({ title, body, onAction, actionLabel }: { title: string; body: string; onAction: () => void; actionLabel: string }) {
  return (
    <div className="flex flex-col items-center text-center px-7 py-14 gap-4">
      <div
        className="w-[72px] h-[72px] flex items-center justify-center text-primary"
        style={{ borderRadius: "var(--r-lg)", background: "var(--color-primary-soft)" }}
      >
        <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M3 10h18" />
          <path d="M3 14.5h18" />
          <path d="M9 10v9" />
          <path d="M15 10v9" />
        </svg>
      </div>
      <div>
        <div className="font-serif text-[22px] font-medium text-text mb-1.5">{title}</div>
        <div className="text-sm text-text-secondary leading-relaxed">{body}</div>
      </div>
      <button
        onClick={onAction}
        className="mt-2 px-6 py-3 font-semibold text-[15px] cursor-pointer"
        style={{
          background: "var(--color-primary)",
          color: "var(--color-primary-ink)",
          borderRadius: "var(--r-pill)",
          border: "none",
          width: "100%",
        }}
      >
        {actionLabel}
      </button>
    </div>
  );
}
