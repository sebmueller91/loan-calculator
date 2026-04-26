"use client";

import { useRef, useEffect } from "react";
import InputField from "./InputField";
import DateField from "./DateField";
import { type CalculationResult } from "@/lib/calculations";
import { formatCurrency, formatPercent, formatMonths, formatDate } from "@/lib/format";
import { useSettings } from "@/lib/settings";
import { t, getLocale, type TranslationKey } from "@/lib/i18n";
import type { CalculatorValues } from "@/app/page";

type Mode = "loanTerm" | "monthlyPayment" | "amount" | "remainingDebt" | "constructionFinancing";

interface ModeConfig {
  id: Mode;
  labelKey: TranslationKey;
  fields: { key: keyof CalculatorValues; labelKey: TranslationKey; suffixType: "currency" | "percent" | "none" }[];
}

const modes: ModeConfig[] = [
  {
    id: "loanTerm",
    labelKey: "mode.loanTerm",
    fields: [
      { key: "loanAmount", labelKey: "field.loanAmount", suffixType: "currency" },
      { key: "interestRate", labelKey: "field.interestRate", suffixType: "percent" },
      { key: "monthlyPayment", labelKey: "field.monthlyPayment", suffixType: "currency" },
    ],
  },
  {
    id: "monthlyPayment",
    labelKey: "mode.monthlyPayment",
    fields: [
      { key: "loanAmount", labelKey: "field.loanAmount", suffixType: "currency" },
      { key: "interestRate", labelKey: "field.interestRate", suffixType: "percent" },
      { key: "loanTerm", labelKey: "field.loanTermMonths", suffixType: "none" },
    ],
  },
  {
    id: "amount",
    labelKey: "mode.amount",
    fields: [
      { key: "loanTerm", labelKey: "field.loanTermMonths", suffixType: "none" },
      { key: "interestRate", labelKey: "field.interestRate", suffixType: "percent" },
      { key: "monthlyPayment", labelKey: "field.monthlyPayment", suffixType: "currency" },
    ],
  },
  {
    id: "remainingDebt",
    labelKey: "mode.remainingDebt",
    fields: [
      { key: "loanAmount", labelKey: "field.loanAmount", suffixType: "currency" },
      { key: "interestRate", labelKey: "field.interestRate", suffixType: "percent" },
      { key: "monthlyPayment", labelKey: "field.monthlyPayment", suffixType: "currency" },
      { key: "loanTerm", labelKey: "field.loanTermMonths", suffixType: "none" },
    ],
  },
  {
    id: "constructionFinancing",
    labelKey: "mode.constructionFinancing",
    fields: [
      { key: "loanAmount", labelKey: "field.loanAmount", suffixType: "currency" },
      { key: "interestRate", labelKey: "field.interestRate", suffixType: "percent" },
      { key: "amortization", labelKey: "field.amortization", suffixType: "percent" },
    ],
  },
];

interface CalculatorTabProps {
  values: CalculatorValues;
  onValuesChange: (values: CalculatorValues | ((prev: CalculatorValues) => CalculatorValues)) => void;
  result: CalculationResult | null;
  onShowSchedule: () => void;
}

export default function CalculatorTab({ values, onValuesChange, result, onShowSchedule }: CalculatorTabProps) {
  const { settings, currencySymbol } = useSettings();
  const lang = settings.language;
  const locale = getLocale(lang);
  const decimals = settings.decimalPlaces;

  const activeMode = values.activeMode;
  const mode = modes[activeMode];

  const getSuffix = (suffixType: "currency" | "percent" | "none") => {
    if (suffixType === "currency") return currencySymbol;
    if (suffixType === "percent") return "%";
    return "";
  };

  const updateValue = (key: keyof CalculatorValues, val: string) => {
    onValuesChange((prev) => ({ ...prev, [key]: val }));
  };

  const fmtCur = (v: number) => `${formatCurrency(v, locale, decimals)} ${currencySymbol}`;

  const modeHints: Record<string, Record<string, string>> = {
    loanTerm: { en: "Solves for term", de: "Berechnet Laufzeit" },
    monthlyPayment: { en: "Solves for payment", de: "Berechnet Rate" },
    amount: { en: "Solves for amount", de: "Berechnet Betrag" },
    remainingDebt: { en: "Snapshot calc", de: "Momentaufnahme" },
    constructionFinancing: { en: "Phased draw", de: "Phasenweise" },
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="flex flex-col gap-4.5 px-4 pt-1 pb-7">
        {/* Mode chips */}
        <ModeStrip
          activeMode={activeMode}
          onChange={(i) => onValuesChange((prev) => ({ ...prev, activeMode: i }))}
          lang={lang}
        />

        {/* Inputs */}
        <div>
          <SectionLabel hint={modeHints[mode.id]?.[lang] || modeHints[mode.id]?.en}>
            {lang === "de" ? "Eingaben" : "Inputs"}
          </SectionLabel>
          <Card>
            <div className="flex flex-col" style={{ gap: "var(--gap)" }}>
              {mode.fields.map((field) => (
                <InputField
                  key={field.key}
                  label={t(field.labelKey, lang)}
                  value={values[field.key] as string}
                  onChange={(v) => updateValue(field.key, v)}
                  suffix={getSuffix(field.suffixType)}
                  step={field.suffixType === "percent" ? "0.01" : "any"}
                />
              ))}
            </div>
          </Card>
        </div>

        {/* Extra options */}
        <div>
          <SectionLabel>{lang === "de" ? "Zusatzoptionen" : "Extra Options"}</SectionLabel>
          <Card>
            <div className="flex flex-col" style={{ gap: "var(--gap)" }}>
              <InputField
                label={t("field.annualExtraPayment", lang)}
                suffix={currencySymbol}
                value={values.extraPayment}
                onChange={(v) => updateValue("extraPayment", v)}
              />
              <DateField
                label={t("field.loanStartDate", lang)}
                value={values.startDate}
                onChange={(v) => updateValue("startDate", v)}
              />
            </div>
          </Card>
        </div>

        {/* Results */}
        {result && result.schedule.length > 0 && (
          <div>
            <SectionLabel hint={lang === "de" ? "Live-Vorschau" : "Live preview"}>
              {lang === "de" ? "Ergebnisse" : "Results"}
            </SectionLabel>
            <Card gradient>
              <ResultRow label={t("result.monthlyPayment", lang)} value={fmtCur(result.monthlyPayment)} emphasis />
              <ResultRow label={t("result.totalPayment", lang)} value={fmtCur(result.totalPayment)} />
              <ResultRow label={t("result.totalInterest", lang)} value={fmtCur(result.totalInterest)} />
              <ResultRow label={t("result.loanTerm", lang)} value={formatMonths(result.loanTermMonths, lang)} />
              <ResultRow label={t("result.repaymentRate", lang)} value={`${formatPercent(Math.max(0, result.repaymentRate), locale)} %`} />
              {result.schedule.length > 0 && (
                <ResultRow
                  label={t("result.loanEndDate", lang)}
                  value={formatDate(result.schedule[result.schedule.length - 1].date, locale)}
                  last
                />
              )}
            </Card>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-2.5 mt-1">
          <button
            onClick={onShowSchedule}
            disabled={!result || result.schedule.length === 0}
            className="w-full py-3.5 font-semibold tracking-wide text-[15px] transition-transform active:scale-[0.98] disabled:opacity-50"
            style={{
              background: "var(--color-primary)",
              color: "var(--color-primary-ink)",
              borderRadius: "var(--r-pill)",
              border: "none",
              cursor: !result ? "not-allowed" : "pointer",
            }}
          >
            {t("btn.showSchedule", lang)}
          </button>
        </div>
      </div>
    </div>
  );
}

function ModeStrip({ activeMode, onChange, lang }: { activeMode: number; onChange: (i: number) => void; lang: "en" | "de" }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current?.querySelector(`[data-mode="${activeMode}"]`);
    if (el) (el as HTMLElement).scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [activeMode]);

  return (
    <div
      ref={ref}
      className="flex gap-2 overflow-x-auto scrollbar-hide py-0.5 -mx-4 px-4"
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      {modes.map((m, i) => {
        const active = i === activeMode;
        return (
          <button
            key={m.id}
            data-mode={i}
            onClick={() => onChange(i)}
            className="shrink-0 text-[13px] font-semibold whitespace-nowrap transition-all cursor-pointer"
            style={{
              padding: "9px 16px",
              borderRadius: "var(--r-pill)",
              background: active ? "var(--color-primary)" : "var(--color-surface)",
              color: active ? "var(--color-primary-ink)" : "var(--color-text-secondary)",
              border: active ? "none" : "1px solid var(--color-line)",
            }}
          >
            {t(m.labelKey, lang)}
          </button>
        );
      })}
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

function Card({ children, gradient }: { children: React.ReactNode; gradient?: boolean }) {
  return (
    <div
      style={{
        background: gradient
          ? "linear-gradient(180deg, var(--color-surface), var(--color-surface-alt))"
          : "var(--color-surface)",
        borderRadius: "var(--r-lg)",
        border: "1px solid var(--color-line)",
        padding: "var(--pad)",
      }}
    >
      {children}
    </div>
  );
}

function ResultRow({ label, value, emphasis, last }: { label: string; value: string; emphasis?: boolean; last?: boolean }) {
  return (
    <div
      className="flex justify-between items-baseline py-3 px-0.5"
      style={{ borderBottom: last ? "none" : "1px dashed var(--color-line)" }}
    >
      <div className="text-sm text-text-secondary">{label}</div>
      <div
        className={emphasis ? "font-serif" : ""}
        style={{
          fontSize: emphasis ? 18 : 15,
          fontWeight: emphasis ? 700 : 600,
          color: emphasis ? "var(--color-primary)" : "var(--color-text)",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </div>
    </div>
  );
}
