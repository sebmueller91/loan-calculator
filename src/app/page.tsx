"use client";

import { useState, useEffect, useCallback } from "react";
import CalculatorTab from "@/components/CalculatorTab";
import ScheduleTab from "@/components/ScheduleTab";
import ChartTab from "@/components/ChartTab";
import InfoTab from "@/components/InfoTab";
import SettingsTab from "@/components/SettingsTab";
import { calculateFull, type CalculationResult } from "@/lib/calculations";
import { useSettings } from "@/lib/settings";
import { usePersistedState } from "@/lib/usePersistedState";
import { t } from "@/lib/i18n";

type Tab = "calculator" | "schedule" | "chart" | "info" | "settings";

export interface CalculatorValues {
  loanAmount: string;
  interestRate: string;
  monthlyPayment: string;
  loanTerm: string;
  amortization: string;
  extraPayment: string;
  startDate: string;
  activeMode: number;
}

const defaultValues: CalculatorValues = {
  loanAmount: "250000",
  interestRate: "3.5",
  monthlyPayment: "1200",
  loanTerm: "300",
  amortization: "1",
  extraPayment: "0",
  startDate: new Date().toISOString().split("T")[0],
  activeMode: 0,
};

const modes = ["loanTerm", "monthlyPayment", "amount", "remainingDebt", "constructionFinancing"] as const;

// Icons
function IconCalc({ size = 20, strokeWidth = 1.6 }: { size?: number; strokeWidth?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="3" width="16" height="18" rx="2.5" />
      <rect x="7" y="6" width="10" height="3.2" rx="0.8" />
      <circle cx="8.2" cy="13" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="12" cy="13" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="15.8" cy="13" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="8.2" cy="17" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="12" cy="17" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="15.8" cy="17" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconList({ size = 20, strokeWidth = 1.6 }: { size?: number; strokeWidth?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="16" rx="2.5" />
      <path d="M3 9h18" />
      <path d="M9 4v16" />
      <path d="M3 14h18" />
    </svg>
  );
}

function IconChart({ size = 20, strokeWidth = 1.6 }: { size?: number; strokeWidth?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19V5" />
      <path d="M4 19h16" />
      <path d="M7 15c2-1 3-5 5-5s3 3 5 1.5 4-4.5 4-4.5" />
    </svg>
  );
}

function IconInfo({ size = 20, strokeWidth = 1.6 }: { size?: number; strokeWidth?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5" />
      <circle cx="12" cy="8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconSettings({ size = 20, strokeWidth = 1.6 }: { size?: number; strokeWidth?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3h.1a1.6 1.6 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8v.1a1.6 1.6 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z" />
    </svg>
  );
}

export function LogoMark({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none">
      <rect x="0" y="0" width="44" height="44" rx="12" className="fill-primary" />
      <path d="M14 28c0-8 6-14 16-14-1 9-7 14-16 14z" className="fill-primary-ink" opacity="0.92" />
      <path d="M14 28c2-3 5-6 9-8" className="stroke-primary" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="14" cy="28" r="1.6" className="fill-primary" />
    </svg>
  );
}

const tabDefs: { id: Tab; labelKey: string; Icon: typeof IconCalc }[] = [
  { id: "calculator", labelKey: "nav.calculator", Icon: IconCalc },
  { id: "schedule", labelKey: "nav.schedule", Icon: IconList },
  { id: "chart", labelKey: "nav.chart", Icon: IconChart },
  { id: "info", labelKey: "nav.info", Icon: IconInfo },
  { id: "settings", labelKey: "nav.settings", Icon: IconSettings },
];

function tabSubtitle(tab: Tab, lang: "en" | "de"): string {
  const subtitles: Record<Tab, Record<string, string>> = {
    calculator: { en: "Plan your repayment", de: "Planen Sie Ihre Ruckzahlung" },
    schedule: { en: "Month-by-month breakdown", de: "Monatliche Aufstellung" },
    chart: { en: "Lifetime trajectory", de: "Gesamtverlauf" },
    info: { en: "About this app", de: "Uber diese App" },
    settings: { en: "Preferences", de: "Einstellungen" },
  };
  return subtitles[tab][lang] || subtitles[tab].en;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("calculator");
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [values, setValues] = usePersistedState<CalculatorValues>("loan-calc-values", defaultValues);
  const { settings } = useSettings();
  const lang = settings.language;

  // Live calculation - recompute whenever values change
  const computeResult = useCallback(() => {
    const v = (key: keyof CalculatorValues) => {
      const raw = (values[key] as string).replace(",", ".");
      return parseFloat(raw) || 0;
    };
    const startDate = values.startDate ? new Date(values.startDate + "T00:00:00") : new Date();
    const mode = modes[values.activeMode];

    try {
      const r = calculateFull({
        mode,
        loanAmount: v("loanAmount"),
        annualInterestRate: v("interestRate"),
        monthlyPayment: v("monthlyPayment"),
        loanTermMonths: v("loanTerm"),
        amortizationRate: v("amortization"),
        annualExtraPayment: v("extraPayment"),
        startDate,
      });
      return r;
    } catch {
      return null;
    }
  }, [values]);

  useEffect(() => {
    const r = computeResult();
    setResult(r);
  }, [computeResult]);

  const currentTab = tabDefs.find((td) => td.id === activeTab)!;

  return (
    <div className="h-dvh flex flex-col max-w-lg mx-auto shadow-2xl bg-bg overflow-hidden">
      {/* Top navigation */}
      <header className="bg-surface shrink-0 border-b border-line pt-3.5">
        {/* Title row */}
        <div className="flex items-center gap-3 px-4.5 pb-3.5">
          <LogoMark size={36} />
          <div className="flex-1">
            <div className="font-serif text-[22px] font-medium text-text leading-tight tracking-tight">
              {t(currentTab.labelKey as Parameters<typeof t>[0], lang)}
            </div>
            <div className="text-[11px] text-muted mt-0.5">
              {tabSubtitle(activeTab, lang)}
            </div>
          </div>
        </div>

        {/* Tab strip */}
        <div className="grid grid-cols-5 bg-surface">
          {tabDefs.map((tab) => {
            const active = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex flex-col items-center gap-1 py-2.5 px-1 relative cursor-pointer border-none bg-transparent"
                style={{ color: active ? "var(--color-primary)" : "var(--color-text-secondary)" }}
              >
                <tab.Icon size={20} strokeWidth={active ? 2 : 1.6} />
                <span
                  className="text-[10.5px] tracking-wide"
                  style={{ fontWeight: active ? 600 : 500 }}
                >
                  {t(tab.labelKey as Parameters<typeof t>[0], lang)}
                </span>
                {active && (
                  <span className="absolute bottom-0 left-[20%] right-[20%] h-[2.5px] bg-primary rounded-t-sm" />
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* Content area */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden bg-bg">
        {activeTab === "calculator" && (
          <CalculatorTab
            values={values}
            onValuesChange={setValues}
            result={result}
            onShowSchedule={() => setActiveTab("schedule")}
          />
        )}
        {activeTab === "schedule" && (
          <ScheduleTab result={result} onGoCalc={() => setActiveTab("calculator")} />
        )}
        {activeTab === "chart" && (
          <ChartTab result={result} onGoCalc={() => setActiveTab("calculator")} />
        )}
        {activeTab === "info" && <InfoTab />}
        {activeTab === "settings" && <SettingsTab />}
      </main>
    </div>
  );
}
