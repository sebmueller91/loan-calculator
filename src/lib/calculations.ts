export interface AmortizationEntry {
  month: number;
  date: Date;
  interest: number;
  principal: number;
  extraPayment: number;
  remainingDebt: number;
  totalPayment: number;
}

export interface CalculationResult {
  loanAmount: number;
  annualInterestRate: number;
  totalPayment: number;
  totalInterest: number;
  monthlyPayment: number;
  repaymentRate: number;
  loanTermMonths: number;
  schedule: AmortizationEntry[];
}

/**
 * Calculate the monthly payment for a loan.
 * Formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
 */
export function calculateMonthlyPayment(
  loanAmount: number,
  annualInterestRate: number,
  loanTermMonths: number
): number {
  const monthlyRate = annualInterestRate / 100 / 12;
  if (monthlyRate === 0) {
    return loanAmount / loanTermMonths;
  }
  const factor = Math.pow(1 + monthlyRate, loanTermMonths);
  return (loanAmount * monthlyRate * factor) / (factor - 1);
}

/**
 * Calculate the loan term in months given loan amount, rate, and monthly payment.
 * Formula: n = -log(1 - P*r/M) / log(1+r)
 */
export function calculateLoanTerm(
  loanAmount: number,
  annualInterestRate: number,
  monthlyPayment: number
): number {
  const monthlyRate = annualInterestRate / 100 / 12;
  if (monthlyRate === 0) {
    return Math.ceil(loanAmount / monthlyPayment);
  }
  const ratio = (loanAmount * monthlyRate) / monthlyPayment;
  if (ratio >= 1) {
    return Infinity; // Payment too low to ever pay off
  }
  return Math.ceil(-Math.log(1 - ratio) / Math.log(1 + monthlyRate));
}

/**
 * Calculate the maximum loan amount given rate, term, and monthly payment.
 * Formula: P = M * [(1+r)^n - 1] / [r(1+r)^n]
 */
export function calculateLoanAmount(
  annualInterestRate: number,
  loanTermMonths: number,
  monthlyPayment: number
): number {
  const monthlyRate = annualInterestRate / 100 / 12;
  if (monthlyRate === 0) {
    return monthlyPayment * loanTermMonths;
  }
  const factor = Math.pow(1 + monthlyRate, loanTermMonths);
  return (monthlyPayment * (factor - 1)) / (monthlyRate * factor);
}

/**
 * Calculate remaining debt after a given number of months.
 * Formula: B = P(1+r)^n - M[(1+r)^n - 1]/r
 */
export function calculateRemainingDebt(
  loanAmount: number,
  annualInterestRate: number,
  monthlyPayment: number,
  loanTermMonths: number
): number {
  const monthlyRate = annualInterestRate / 100 / 12;
  if (monthlyRate === 0) {
    return Math.max(0, loanAmount - monthlyPayment * loanTermMonths);
  }
  const factor = Math.pow(1 + monthlyRate, loanTermMonths);
  const remaining = loanAmount * factor - monthlyPayment * (factor - 1) / monthlyRate;
  return Math.max(0, remaining);
}

/**
 * Calculate construction financing (German-style: interest-only + amortization rate).
 * Monthly payment = (interestRate + amortizationRate) / 12 * loanAmount / 100...
 * Actually: monthly payment = loanAmount * (annualInterestRate + amortizationRate) / 100 / 12
 */
export function calculateConstructionFinancing(
  loanAmount: number,
  annualInterestRate: number,
  amortizationRate: number
): { monthlyPayment: number; loanTermMonths: number } {
  const monthlyPayment = (loanAmount * (annualInterestRate + amortizationRate)) / 100 / 12;
  const loanTermMonths = calculateLoanTerm(loanAmount, annualInterestRate, monthlyPayment);
  return { monthlyPayment, loanTermMonths };
}

/**
 * Generate a full amortization schedule.
 */
export function generateAmortizationSchedule(
  loanAmount: number,
  annualInterestRate: number,
  monthlyPayment: number,
  startDate: Date,
  annualExtraPayment: number = 0
): AmortizationEntry[] {
  const monthlyRate = annualInterestRate / 100 / 12;
  const monthlyExtraPayment = annualExtraPayment / 12;
  const schedule: AmortizationEntry[] = [];
  let remaining = loanAmount;
  let totalPaid = 0;
  let month = 0;

  while (remaining > 0.01 && month < 1200) {
    month++;
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + month - 1);

    const interest = remaining * monthlyRate;
    let principal = monthlyPayment - interest;
    let extra = monthlyExtraPayment;

    if (principal + extra >= remaining) {
      principal = remaining - interest > 0 ? remaining : remaining;
      extra = 0;
      if (principal > remaining) {
        principal = remaining;
      }
    }

    if (principal + extra > remaining) {
      extra = Math.max(0, remaining - principal);
    }

    remaining = Math.max(0, remaining - principal - extra);
    totalPaid += interest + principal + extra;

    schedule.push({
      month,
      date,
      interest: Math.round(interest * 100) / 100,
      principal: Math.round(principal * 100) / 100,
      extraPayment: Math.round(extra * 100) / 100,
      remainingDebt: Math.round(remaining * 100) / 100,
      totalPayment: Math.round(totalPaid * 100) / 100,
    });

    if (remaining <= 0.01) break;
  }

  return schedule;
}

/**
 * Full calculation for a given mode, returning all results including schedule.
 */
export function calculateFull(params: {
  mode: "loanTerm" | "monthlyPayment" | "amount" | "remainingDebt" | "constructionFinancing";
  loanAmount?: number;
  annualInterestRate: number;
  monthlyPayment?: number;
  loanTermMonths?: number;
  amortizationRate?: number;
  annualExtraPayment?: number;
  startDate: Date;
}): CalculationResult {
  const {
    mode,
    annualInterestRate,
    annualExtraPayment = 0,
    startDate,
  } = params;

  let loanAmount = params.loanAmount || 0;
  let monthlyPayment = params.monthlyPayment || 0;
  let loanTermMonths = params.loanTermMonths || 0;

  switch (mode) {
    case "loanTerm":
      loanTermMonths = calculateLoanTerm(loanAmount, annualInterestRate, monthlyPayment);
      break;
    case "monthlyPayment":
      monthlyPayment = calculateMonthlyPayment(loanAmount, annualInterestRate, loanTermMonths);
      break;
    case "amount":
      loanAmount = calculateLoanAmount(annualInterestRate, loanTermMonths, monthlyPayment);
      break;
    case "remainingDebt": {
      const remaining = calculateRemainingDebt(
        loanAmount,
        annualInterestRate,
        monthlyPayment,
        loanTermMonths
      );
      const schedule = generateAmortizationSchedule(
        loanAmount,
        annualInterestRate,
        monthlyPayment,
        startDate,
        annualExtraPayment
      );
      const totalPayment = monthlyPayment * loanTermMonths;
      const totalInterest = totalPayment - (loanAmount - remaining);
      return {
        loanAmount,
        annualInterestRate,
        totalPayment: Math.round(totalPayment * 100) / 100,
        totalInterest: Math.round(totalInterest * 100) / 100,
        monthlyPayment: Math.round(monthlyPayment * 100) / 100,
        repaymentRate: loanAmount > 0
          ? Math.round(((monthlyPayment * 12 - loanAmount * annualInterestRate / 100) / loanAmount) * 10000) / 100
          : 0,
        loanTermMonths,
        schedule,
      };
    }
    case "constructionFinancing": {
      const cf = calculateConstructionFinancing(
        loanAmount,
        annualInterestRate,
        params.amortizationRate || 0
      );
      monthlyPayment = cf.monthlyPayment;
      loanTermMonths = cf.loanTermMonths;
      break;
    }
  }

  const schedule = generateAmortizationSchedule(
    loanAmount,
    annualInterestRate,
    monthlyPayment,
    startDate,
    annualExtraPayment
  );

  const totalPayment = schedule.length > 0
    ? schedule[schedule.length - 1].totalPayment
    : 0;
  const totalInterest = totalPayment - loanAmount;

  const repaymentRate = loanAmount > 0
    ? ((monthlyPayment * 12 - loanAmount * annualInterestRate / 100) / loanAmount) * 100
    : 0;

  return {
    loanAmount,
    annualInterestRate,
    totalPayment: Math.round(totalPayment * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    repaymentRate: Math.round(repaymentRate * 100) / 100,
    loanTermMonths: schedule.length,
    schedule,
  };
}
