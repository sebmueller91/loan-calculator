"use client";

import { useSettings, type Currency } from "@/lib/settings";
import { t, type Language } from "@/lib/i18n";

const currencies: { value: Currency; label: string }[] = [
  { value: "EUR", label: "\u20AC Euro (EUR)" },
  { value: "USD", label: "$ Dollar (USD)" },
  { value: "GBP", label: "\u00A3 Pound (GBP)" },
  { value: "CHF", label: "CHF Franc (CHF)" },
];

const languages: { value: Language; label: string }[] = [
  { value: "de", label: "Deutsch" },
  { value: "en", label: "English" },
];

const decimalOptions = [0, 1, 2];

export default function SettingsTab() {
  const { settings, setLanguage, setCurrency, setDecimalPlaces } = useSettings();
  const lang = settings.language;

  return (
    <div className="flex-1 overflow-y-auto bg-surface-alt">
      <div className="p-5 space-y-5">
        <h2 className="text-lg font-bold text-text">{t("settings.title", lang)}</h2>

        {/* Language */}
        <div className="bg-white rounded-xl shadow-sm border border-border p-4">
          <label className="text-sm font-medium text-text-secondary mb-3 block">
            {t("settings.language", lang)}
          </label>
          <div className="flex gap-2">
            {languages.map((l) => (
              <button
                key={l.value}
                onClick={() => setLanguage(l.value)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all
                  ${settings.language === l.value
                    ? "bg-primary text-white shadow-md"
                    : "bg-surface-alt text-text-secondary border border-border hover:border-primary-light"
                  }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* Currency */}
        <div className="bg-white rounded-xl shadow-sm border border-border p-4">
          <label className="text-sm font-medium text-text-secondary mb-3 block">
            {t("settings.currency", lang)}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {currencies.map((c) => (
              <button
                key={c.value}
                onClick={() => setCurrency(c.value)}
                className={`py-2.5 rounded-xl text-sm font-semibold transition-all
                  ${settings.currency === c.value
                    ? "bg-primary text-white shadow-md"
                    : "bg-surface-alt text-text-secondary border border-border hover:border-primary-light"
                  }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Decimal places */}
        <div className="bg-white rounded-xl shadow-sm border border-border p-4">
          <label className="text-sm font-medium text-text-secondary mb-3 block">
            {t("settings.decimalPlaces", lang)}
          </label>
          <div className="flex gap-2">
            {decimalOptions.map((d) => (
              <button
                key={d}
                onClick={() => setDecimalPlaces(d)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all
                  ${settings.decimalPlaces === d
                    ? "bg-primary text-white shadow-md"
                    : "bg-surface-alt text-text-secondary border border-border hover:border-primary-light"
                  }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
