export type Language = "en" | "de";

const translations = {
  // Navigation
  "nav.calculator": { en: "Calculator", de: "Rechner" },
  "nav.schedule": { en: "Schedule", de: "Tilgungsplan" },
  "nav.chart": { en: "Chart", de: "Diagramm" },
  "nav.info": { en: "Info", de: "Info" },
  "nav.settings": { en: "Settings", de: "Einstellungen" },

  // Calculator modes
  "mode.loanTerm": { en: "Loan Term", de: "Laufzeit" },
  "mode.monthlyPayment": { en: "Monthly Payment", de: "Monatsrate" },
  "mode.amount": { en: "Amount", de: "Betrag" },
  "mode.remainingDebt": { en: "Remaining Debt", de: "Restschuld" },
  "mode.constructionFinancing": { en: "Construction Financing", de: "Baufinanzierung" },

  // Input fields
  "field.loanAmount": { en: "Loan amount", de: "Darlehensbetrag" },
  "field.interestRate": { en: "Interest rate", de: "Zinssatz" },
  "field.monthlyPayment": { en: "Monthly payment", de: "Monatsrate" },
  "field.loanTermMonths": { en: "Loan term in months", de: "Laufzeit in Monaten" },
  "field.amortization": { en: "Amortization", de: "Tilgung" },
  "field.annualExtraPayment": { en: "Annual extra payment", de: "Jährliche Sondertilgung" },
  "field.loanStartDate": { en: "Loan start date", de: "Darlehensbeginn" },

  // Results
  "result.totalPayment": { en: "Total payment", de: "Gesamtzahlung" },
  "result.totalInterest": { en: "Total interest", de: "Zinsen gesamt" },
  "result.monthlyPayment": { en: "Monthly payment", de: "Monatsrate" },
  "result.loanTerm": { en: "Loan term", de: "Laufzeit" },
  "result.repaymentRate": { en: "Repayment rate", de: "Tilgungsrate" },
  "result.loanEndDate": { en: "Loan end date", de: "Darlehensende" },
  "result.remainingDebt": { en: "Remaining debt", de: "Restschuld" },

  // Buttons
  "btn.calculate": { en: "CALCULATE", de: "BERECHNEN" },
  "btn.showSchedule": { en: "SHOW AMORTIZATION SCHEDULE", de: "TILGUNGSPLAN ANZEIGEN" },

  // Schedule
  "schedule.loanAmount": { en: "Loan amount", de: "Darlehensbetrag" },
  "schedule.loanTerm": { en: "Loan term", de: "Laufzeit" },
  "schedule.interestRate": { en: "Interest rate", de: "Zinssatz" },
  "schedule.monthlyPayment": { en: "Monthly payment", de: "Monatsrate" },
  "schedule.totalPayment": { en: "Total payment", de: "Gesamtzahlung" },
  "schedule.totalInterest": { en: "Total interest", de: "Zinsen gesamt" },
  "schedule.startDate": { en: "Loan start date", de: "Darlehensbeginn" },
  "schedule.endDate": { en: "Loan end date", de: "Darlehensende" },
  "schedule.month": { en: "Month", de: "Monat" },
  "schedule.interest": { en: "Interest", de: "Zinsen" },
  "schedule.principal": { en: "Principal", de: "Tilgung" },
  "schedule.remaining": { en: "Remaining", de: "Restschuld" },
  "schedule.empty": { en: "No schedule to display", de: "Kein Tilgungsplan vorhanden" },
  "schedule.emptyHint": { en: "Calculate a loan first to see the amortization schedule.", de: "Berechnen Sie zuerst ein Darlehen, um den Tilgungsplan zu sehen." },

  // Chart
  "chart.remainingDebt": { en: "Remaining debt", de: "Restschuld" },
  "chart.sumPayments": { en: "Sum of payments", de: "Summe Zahlungen" },
  "chart.empty": { en: "No chart to display", de: "Kein Diagramm vorhanden" },
  "chart.emptyHint": { en: "Calculate a loan first to see the chart.", de: "Berechnen Sie zuerst ein Darlehen, um das Diagramm zu sehen." },

  // Info
  "info.title": { en: "Loan Calculator", de: "Darlehensrechner" },
  "info.about": { en: "About", de: "Über" },
  "info.aboutText": {
    en: "A comprehensive loan calculator that helps you plan your finances. Calculate loan terms, monthly payments, borrowing capacity, remaining debt, and construction financing with detailed amortization schedules and visual charts.",
    de: "Ein umfassender Darlehensrechner, der Ihnen bei der Finanzplanung hilft. Berechnen Sie Laufzeiten, Monatsraten, Darlehensbeträge, Restschulden und Baufinanzierungen mit detaillierten Tilgungsplänen und Diagrammen.",
  },
  "info.features": { en: "Features", de: "Funktionen" },
  "info.feature1": { en: "Calculate loan term from amount, rate, and payment", de: "Laufzeit aus Betrag, Zins und Rate berechnen" },
  "info.feature2": { en: "Calculate monthly payment for a given loan", de: "Monatsrate für ein Darlehen berechnen" },
  "info.feature3": { en: "Determine maximum borrowing amount", de: "Maximalen Darlehensbetrag ermitteln" },
  "info.feature4": { en: "Calculate remaining debt after a period", de: "Restschuld nach einem Zeitraum berechnen" },
  "info.feature5": { en: "Construction financing with amortization rate", de: "Baufinanzierung mit Tilgungssatz" },
  "info.feature6": { en: "Detailed amortization schedule", de: "Detaillierter Tilgungsplan" },
  "info.feature7": { en: "Visual chart of debt and payments over time", de: "Grafische Darstellung von Schulden und Zahlungen" },
  "info.feature8": { en: "Optional annual extra payments", de: "Optionale jährliche Sondertilgungen" },
  "info.formulas": { en: "Formulas", de: "Formeln" },
  "info.sourceCode": { en: "Source Code", de: "Quellcode" },
  "info.githubRepo": { en: "GitHub Repository", de: "GitHub Repository" },
  "info.builtWith": { en: "Built with Next.js, TypeScript & Tailwind CSS", de: "Erstellt mit Next.js, TypeScript & Tailwind CSS" },
  "info.formulaMonthlyPayment": { en: "Monthly Payment", de: "Monatsrate" },
  "info.formulaLoanTerm": { en: "Loan Term", de: "Laufzeit" },
  "info.formulaRemainingDebt": { en: "Remaining Debt", de: "Restschuld" },
  "info.formulaDesc1": { en: "P = principal, r = monthly rate, n = term in months", de: "P = Darlehensbetrag, r = Monatszins, n = Laufzeit in Monaten" },
  "info.formulaDesc2": { en: "Derived from the monthly payment formula", de: "Abgeleitet aus der Monatsratenformel" },
  "info.formulaDesc3": { en: "Balance after n payments", de: "Restschuld nach n Zahlungen" },

  // Settings
  "settings.title": { en: "Settings", de: "Einstellungen" },
  "settings.language": { en: "Language", de: "Sprache" },
  "settings.currency": { en: "Currency", de: "Währung" },
  "settings.decimalPlaces": { en: "Decimal places", de: "Dezimalstellen" },

  // Time formatting
  "time.years": { en: "Years", de: "Jahre" },
  "time.months": { en: "Months", de: "Monate" },
  "time.never": { en: "Never", de: "Nie" },
} as const;

export type TranslationKey = keyof typeof translations;

export function t(key: TranslationKey, lang: Language): string {
  const entry = translations[key];
  if (!entry) return key;
  return entry[lang] || entry.en;
}

export function getLocale(lang: Language): string {
  return lang === "de" ? "de-DE" : "en-US";
}
