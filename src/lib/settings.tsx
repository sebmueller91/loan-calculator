"use client";

import { createContext, useContext, type ReactNode } from "react";
import { type Language } from "./i18n";
import { usePersistedState } from "./usePersistedState";

export type Currency = "EUR" | "USD" | "GBP" | "CHF";

export interface Settings {
  language: Language;
  currency: Currency;
  decimalPlaces: number;
}

interface SettingsContextType {
  settings: Settings;
  setLanguage: (lang: Language) => void;
  setCurrency: (currency: Currency) => void;
  setDecimalPlaces: (places: number) => void;
  currencySymbol: string;
}

const currencySymbols: Record<Currency, string> = {
  EUR: "\u20AC",
  USD: "$",
  GBP: "\u00A3",
  CHF: "CHF",
};

const defaultSettings: Settings = {
  language: "de",
  currency: "EUR",
  decimalPlaces: 2,
};

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  setLanguage: () => {},
  setCurrency: () => {},
  setDecimalPlaces: () => {},
  currencySymbol: currencySymbols.EUR,
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = usePersistedState<Settings>("loan-calc-settings", defaultSettings);

  const setLanguage = (language: Language) =>
    setSettings((prev) => ({ ...prev, language }));
  const setCurrency = (currency: Currency) =>
    setSettings((prev) => ({ ...prev, currency }));
  const setDecimalPlaces = (decimalPlaces: number) =>
    setSettings((prev) => ({ ...prev, decimalPlaces }));

  return (
    <SettingsContext.Provider
      value={{
        settings,
        setLanguage,
        setCurrency,
        setDecimalPlaces,
        currencySymbol: currencySymbols[settings.currency],
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}

export function getCurrencySymbol(currency: Currency): string {
  return currencySymbols[currency];
}
