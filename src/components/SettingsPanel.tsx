"use client";

import { useSettings, type Currency } from "@/lib/settings";
import { t, type Language } from "@/lib/i18n";

interface SettingsPanelProps {
  onClose: () => void;
}

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

export default function SettingsPanel({ onClose }: SettingsPanelProps) {
  const { settings, setLanguage, setCurrency, setDecimalPlaces } = useSettings();
  const lang = settings.language;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-t-2xl shadow-2xl animate-slide-up">
        <div className="p-5">
          {/* Handle bar */}
          <div className="w-10 h-1 bg-border rounded-full mx-auto mb-4" />

          <h2 className="text-lg font-bold text-text mb-5">{t("settings.title", lang)}</h2>

          {/* Language */}
          <div className="mb-5">
            <label className="text-sm font-medium text-text-secondary mb-2 block">
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
          <div className="mb-5">
            <label className="text-sm font-medium text-text-secondary mb-2 block">
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
          <div className="mb-6">
            <label className="text-sm font-medium text-text-secondary mb-2 block">
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

          {/* Close button */}
          <button
            onClick={onClose}
            className="w-full py-3 bg-primary text-white font-bold rounded-xl
                       hover:bg-primary-dark active:scale-[0.98] transition-all shadow-md"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
