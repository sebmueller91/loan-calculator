"use client";

import { useState } from "react";
import CalculatorTab from "@/components/CalculatorTab";
import ScheduleTab from "@/components/ScheduleTab";
import ChartTab from "@/components/ChartTab";
import InfoTab from "@/components/InfoTab";
import SettingsTab from "@/components/SettingsTab";
import { type CalculationResult } from "@/lib/calculations";
import { useSettings } from "@/lib/settings";
import { usePersistedState } from "@/lib/usePersistedState";
import { t, type TranslationKey } from "@/lib/i18n";

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
  loanAmount: "",
  interestRate: "",
  monthlyPayment: "",
  loanTerm: "",
  amortization: "",
  extraPayment: "0",
  startDate: new Date().toISOString().split("T")[0],
  activeMode: 0,
};

const tabDefs: { id: Tab; labelKey: TranslationKey; icon: React.ReactNode }[] = [
  {
    id: "calculator",
    labelKey: "nav.calculator",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <text x="3" y="18" fontSize="16" fontWeight="bold" fill="currentColor" stroke="none">&#931;</text>
      </svg>
    ),
  },
  {
    id: "schedule",
    labelKey: "nav.schedule",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h10M4 18h7" />
      </svg>
    ),
  },
  {
    id: "chart",
    labelKey: "nav.chart",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 17l6-6 4 4 8-8" />
      </svg>
    ),
  },
  {
    id: "info",
    labelKey: "nav.info",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <path strokeLinecap="round" d="M12 16v-4M12 8h.01" />
      </svg>
    ),
  },
  {
    id: "settings",
    labelKey: "nav.settings",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("calculator");
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [values, setValues] = usePersistedState<CalculatorValues>("loan-calc-values", defaultValues);
  const { settings } = useSettings();
  const lang = settings.language;

  return (
    <div className="h-dvh flex flex-col max-w-lg mx-auto shadow-2xl">
      {/* Top navigation bar */}
      <header className="bg-primary shrink-0">
        <div className="flex">
          {tabDefs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-3 transition-colors relative
                ${activeTab === tab.id ? "text-white" : "text-white/50 hover:text-white/70"}`}
            >
              {tab.icon}
              <span className="text-[10px] font-medium">{t(tab.labelKey, lang)}</span>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-white rounded-full" />
              )}
            </button>
          ))}
        </div>
      </header>

      {/* Content area */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {activeTab === "calculator" && (
          <CalculatorTab
            values={values}
            onValuesChange={setValues}
            onResult={setResult}
            onShowSchedule={() => setActiveTab("schedule")}
          />
        )}
        {activeTab === "schedule" && <ScheduleTab result={result} />}
        {activeTab === "chart" && <ChartTab result={result} />}
        {activeTab === "info" && <InfoTab />}
        {activeTab === "settings" && <SettingsTab />}
      </main>
    </div>
  );
}
