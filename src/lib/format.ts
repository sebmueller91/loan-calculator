import { type Language } from "./i18n";

export function formatCurrency(value: number, locale: string = "de-DE", decimals: number = 2): string {
  return value.toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatCurrencyShort(value: number, locale: string = "de-DE"): string {
  return value.toLocaleString(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export function formatPercent(value: number, locale: string = "de-DE"): string {
  return value.toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatMonths(months: number, lang: Language = "de"): string {
  if (!isFinite(months)) return lang === "de" ? "Nie" : "Never";
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  const yLabel = lang === "de" ? "Jahre" : "Years";
  const mLabel = lang === "de" ? "Monate" : "Months";
  if (years === 0) return `${remainingMonths} ${mLabel}`;
  if (remainingMonths === 0) return `${years} ${yLabel}`;
  return `${years} ${yLabel} ${remainingMonths} ${mLabel}`;
}

export function formatDate(date: Date, locale: string = "de-DE"): string {
  return date.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
  });
}

export function formatDateShort(date: Date, locale: string = "de-DE"): string {
  return date.toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
  });
}
