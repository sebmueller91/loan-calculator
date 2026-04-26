"use client";

import { useSettings, type Currency } from "@/lib/settings";
import { t, type Language } from "@/lib/i18n";
import { formatCurrency } from "@/lib/format";

const currencies: { value: Currency; label: string }[] = [
  { value: "EUR", label: "\u20AC  Euro" },
  { value: "USD", label: "$  Dollar" },
  { value: "GBP", label: "\u00A3  Pound" },
  { value: "CHF", label: "CHF  Franc" },
];

const languages: { value: Language; label: string }[] = [
  { value: "de", label: "Deutsch" },
  { value: "en", label: "English" },
];

const decimalOptions = [0, 1, 2];

export default function SettingsTab() {
  const { settings, setLanguage, setCurrency, setDecimalPlaces, currencySymbol } = useSettings();
  const lang = settings.language;
  const locale = lang === "de" ? "de-DE" : "en-US";

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="flex flex-col gap-5.5 px-4 pt-1 pb-7">
        {/* Language */}
        <div>
          <SectionLabel>{t("settings.language", lang)}</SectionLabel>
          <Card>
            <ButtonGroup
              options={languages.map((l) => ({ value: l.value, label: l.label }))}
              value={settings.language}
              onChange={(v) => setLanguage(v as Language)}
            />
          </Card>
        </div>

        {/* Currency */}
        <div>
          <SectionLabel hint={lang === "de" ? "Nur Anzeige" : "Display only"}>
            {t("settings.currency", lang)}
          </SectionLabel>
          <Card>
            <ButtonGroup
              options={currencies.map((c) => ({ value: c.value, label: c.label }))}
              value={settings.currency}
              onChange={(v) => setCurrency(v as Currency)}
              columns={2}
            />
          </Card>
        </div>

        {/* Decimal places */}
        <div>
          <SectionLabel>{t("settings.decimalPlaces", lang)}</SectionLabel>
          <Card>
            <ButtonGroup
              options={decimalOptions.map((d) => ({ value: String(d), label: String(d) }))}
              value={String(settings.decimalPlaces)}
              onChange={(v) => setDecimalPlaces(Number(v))}
            />
            <div
              className="mt-3 px-3 py-2.5 flex justify-between text-[12.5px]"
              style={{
                background: "var(--color-surface-alt)",
                borderRadius: "var(--r-sm)",
              }}
            >
              <span className="text-text-secondary">{lang === "de" ? "Vorschau" : "Preview"}</span>
              <span className="font-semibold text-text" style={{ fontVariantNumeric: "tabular-nums" }}>
                {formatCurrency(1234.5678, locale, settings.decimalPlaces)} {currencySymbol}
              </span>
            </div>
          </Card>
        </div>

        <div className="text-center text-[11px] text-muted pt-3">
          {lang === "de"
            ? "Einstellungen werden nur auf diesem Gerat gespeichert."
            : "Settings are stored on this device only."}
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

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: "var(--color-surface)",
      borderRadius: "var(--r-lg)",
      border: "1px solid var(--color-line)",
      padding: "var(--pad)",
    }}>
      {children}
    </div>
  );
}

function ButtonGroup({
  options,
  value,
  onChange,
  columns,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  columns?: number;
}) {
  const cols = columns || options.length;
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: 6,
        background: "var(--color-surface-alt)",
        borderRadius: "var(--r-md)",
        padding: 4,
        border: "1px solid var(--color-line)",
      }}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className="cursor-pointer text-sm transition-all"
            style={{
              border: "none",
              padding: "11px 8px",
              borderRadius: "calc(var(--r-md) - 4px)",
              background: active ? "var(--color-surface)" : "transparent",
              color: active ? "var(--color-text)" : "var(--color-text-secondary)",
              fontWeight: active ? 600 : 500,
              fontFamily: "inherit",
              boxShadow: active ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
