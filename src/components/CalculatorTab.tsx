"use client";

import { useState } from "react";
import InputField from "./InputField";
import DateField from "./DateField";
import { calculateFull, type CalculationResult } from "@/lib/calculations";
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
  onResult: (result: CalculationResult | null) => void;
  onShowSchedule: () => void;
}

export default function CalculatorTab({ values, onValuesChange, onResult, onShowSchedule }: CalculatorTabProps) {
  const { settings, currencySymbol } = useSettings();
  const lang = settings.language;
  const locale = getLocale(lang);
  const decimals = settings.decimalPlaces;

  const [result, setResult] = useState<CalculationResult | null>(null);

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

  const doCalculate = (): CalculationResult => {
    const v = (key: keyof CalculatorValues) => {
      const raw = (values[key] as string).replace(",", ".");
      return parseFloat(raw) || 0;
    };
    const startDate = values.startDate ? new Date(values.startDate + "T00:00:00") : new Date();

    return calculateFull({
      mode: mode.id,
      loanAmount: v("loanAmount"),
      annualInterestRate: v("interestRate"),
      monthlyPayment: v("monthlyPayment"),
      loanTermMonths: v("loanTerm"),
      amortizationRate: v("amortization"),
      annualExtraPayment: v("extraPayment"),
      startDate,
    });
  };

  const handleCalculate = () => {
    const calcResult = doCalculate();
    setResult(calcResult);
    onResult(calcResult);
  };

  const handleShowSchedule = () => {
    const calcResult = doCalculate();
    setResult(calcResult);
    onResult(calcResult);
    onShowSchedule();
  };

  const fmtCur = (v: number) => `${formatCurrency(v, locale, decimals)} ${currencySymbol}`;

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Mode tabs */}
      <div className="bg-primary shrink-0 overflow-x-auto scrollbar-hide">
        <div className="flex min-w-max">
          {modes.map((m, i) => (
            <button
              key={m.id}
              onClick={() => {
                onValuesChange((prev) => ({ ...prev, activeMode: i }));
                setResult(null);
                onResult(null);
              }}
              className={`px-4 py-2.5 text-xs font-bold tracking-wide whitespace-nowrap transition-colors
                ${i === activeMode
                  ? "text-white border-b-3 border-white"
                  : "text-white/60 hover:text-white/80"
                }`}
            >
              {t(m.labelKey, lang).toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable form content */}
      <div className="flex-1 overflow-y-auto bg-surface-alt">
        <div className="p-4 space-y-3">
          {/* Main inputs */}
          <div className="bg-white rounded-xl shadow-sm border border-border p-3">
            {mode.fields.map((field) => (
              <InputField
                key={field.key}
                label={t(field.labelKey, lang)}
                value={values[field.key] as string}
                onChange={(v) => updateValue(field.key, v)}
                suffix={getSuffix(field.suffixType)}
              />
            ))}
          </div>

          {/* Extra options */}
          <div className="bg-white rounded-xl shadow-sm border border-border p-3">
            <InputField
              label={t("field.annualExtraPayment", lang)}
              value={values.extraPayment}
              onChange={(v) => updateValue("extraPayment", v)}
              suffix={currencySymbol}
            />
            <DateField
              label={t("field.loanStartDate", lang)}
              value={values.startDate}
              onChange={(v) => updateValue("startDate", v)}
            />
          </div>

          {/* Results */}
          {result && (
            <div className="bg-white rounded-xl shadow-sm border border-border p-4 space-y-2">
              <ResultRow label={t("result.totalPayment", lang)} value={fmtCur(result.totalPayment)} />
              <ResultRow label={t("result.totalInterest", lang)} value={fmtCur(result.totalInterest)} />
              <ResultRow label={t("result.monthlyPayment", lang)} value={fmtCur(result.monthlyPayment)} />
              {mode.id === "loanTerm" && (
                <ResultRow label={t("result.loanTerm", lang)} value={formatMonths(result.loanTermMonths, lang)} />
              )}
              <ResultRow label={t("result.repaymentRate", lang)} value={`${formatPercent(result.repaymentRate, locale)} %`} />
              {result.schedule.length > 0 && (
                <ResultRow
                  label={t("result.loanEndDate", lang)}
                  value={formatDate(result.schedule[result.schedule.length - 1].date, locale)}
                />
              )}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="p-4 pt-0 space-y-2.5 pb-6">
          <button
            onClick={handleCalculate}
            className="w-full py-3.5 bg-primary text-white font-bold rounded-xl
                       hover:bg-primary-dark active:scale-[0.98] transition-all shadow-md"
          >
            {t("btn.calculate", lang)}
          </button>
          <button
            onClick={handleShowSchedule}
            className="w-full py-3.5 bg-primary-light text-white font-bold rounded-xl
                       hover:bg-primary active:scale-[0.98] transition-all shadow-md"
          >
            {t("btn.showSchedule", lang)}
          </button>
        </div>
      </div>
    </div>
  );
}

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-text-secondary">{label}:</span>
      <span className="text-sm font-semibold text-text">{value}</span>
    </div>
  );
}
