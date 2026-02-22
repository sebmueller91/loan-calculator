"use client";

import { type CalculationResult } from "@/lib/calculations";
import { formatCurrency, formatDate, formatDateShort, formatPercent, formatMonths } from "@/lib/format";
import { useSettings } from "@/lib/settings";
import { t, getLocale } from "@/lib/i18n";

interface ScheduleTabProps {
  result: CalculationResult | null;
}

export default function ScheduleTab({ result }: ScheduleTabProps) {
  const { settings, currencySymbol } = useSettings();
  const lang = settings.language;
  const locale = getLocale(lang);
  const decimals = settings.decimalPlaces;

  if (!result || result.schedule.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-text-secondary text-center">
        <div>
          <svg className="w-16 h-16 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <p className="font-medium">{t("schedule.empty", lang)}</p>
          <p className="text-sm mt-1">{t("schedule.emptyHint", lang)}</p>
        </div>
      </div>
    );
  }

  const schedule = result.schedule;
  const startDate = schedule[0].date;
  const endDate = schedule[schedule.length - 1].date;
  const fmtCur = (v: number) => `${formatCurrency(v, locale, decimals)} ${currencySymbol}`;

  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-surface-alt">
      {/* Summary header */}
      <div className="bg-white border-b border-border p-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <SummaryItem label={t("schedule.loanAmount", lang)} value={fmtCur(result.loanAmount)} />
          <SummaryItem label={t("schedule.loanTerm", lang)} value={formatMonths(schedule.length, lang)} />
          <SummaryItem label={t("schedule.interestRate", lang)} value={`${formatPercent(result.annualInterestRate, locale)} %`} />
          <SummaryItem label={t("schedule.monthlyPayment", lang)} value={fmtCur(result.monthlyPayment)} />
          <SummaryItem label={t("schedule.totalPayment", lang)} value={fmtCur(result.totalPayment)} />
          <SummaryItem label={t("schedule.totalInterest", lang)} value={fmtCur(result.totalInterest)} />
          <SummaryItem label={t("schedule.startDate", lang)} value={formatDate(startDate, locale)} />
          <SummaryItem label={t("schedule.endDate", lang)} value={formatDate(endDate, locale)} />
        </div>
      </div>

      {/* Table header */}
      <div className="bg-primary text-white">
        <div className="grid grid-cols-[2.5rem_1fr_1fr_1fr_1fr] text-[10px] font-bold px-2 py-2">
          <span>#</span>
          <span>{t("schedule.month", lang)}</span>
          <span className="text-right">{t("schedule.interest", lang)}</span>
          <span className="text-right">{t("schedule.principal", lang)}</span>
          <span className="text-right">{t("schedule.remaining", lang)}</span>
        </div>
      </div>

      {/* Table body */}
      <div className="flex-1 overflow-y-auto">
        {schedule.map((entry, i) => (
          <div
            key={entry.month}
            className={`grid grid-cols-[2.5rem_1fr_1fr_1fr_1fr] text-[11px] px-2 py-1.5 border-b border-border
              ${i % 2 === 0 ? "bg-white" : "bg-surface-alt"}`}
          >
            <span className="text-text-secondary">{entry.month}</span>
            <span className="text-text-secondary">{formatDateShort(entry.date, locale)}</span>
            <span className="text-right text-accent font-medium">{formatCurrency(entry.interest, locale, decimals)}</span>
            <span className="text-right text-primary font-medium">{formatCurrency(entry.principal, locale, decimals)}</span>
            <span className="text-right font-semibold">{formatCurrency(entry.remainingDebt, locale, decimals)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] text-text-secondary font-medium">{label}:</div>
      <div className="text-sm font-bold text-text">{value}</div>
    </div>
  );
}
