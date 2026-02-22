import { describe, it, expect } from "vitest";
import {
  calculateMonthlyPayment,
  calculateLoanTerm,
  calculateLoanAmount,
  calculateRemainingDebt,
  calculateConstructionFinancing,
  generateAmortizationSchedule,
  calculateFull,
} from "./calculations";

describe("calculateMonthlyPayment", () => {
  it("calculates correct monthly payment for standard loan", () => {
    // $140,090 at 1.5% for 120 months
    const result = calculateMonthlyPayment(140090, 1.5, 120);
    expect(result).toBeCloseTo(1257.88, 0);
  });

  it("handles zero interest rate", () => {
    const result = calculateMonthlyPayment(12000, 0, 12);
    expect(result).toBe(1000);
  });

  it("calculates for a small loan", () => {
    const result = calculateMonthlyPayment(10000, 5, 60);
    expect(result).toBeCloseTo(188.71, 0);
  });

  it("calculates for a large loan with high interest", () => {
    const result = calculateMonthlyPayment(500000, 7, 360);
    expect(result).toBeCloseTo(3326.51, 0);
  });
});

describe("calculateLoanTerm", () => {
  it("calculates correct term for standard inputs", () => {
    // $139,738 at 1.5% with $1,354 monthly
    const result = calculateLoanTerm(139738, 1.5, 1354);
    expect(result).toBeGreaterThan(100);
    expect(result).toBeLessThan(130);
  });

  it("returns Infinity when payment is too low", () => {
    // Monthly payment less than monthly interest
    const result = calculateLoanTerm(100000, 12, 500);
    expect(result).toBe(Infinity);
  });

  it("handles zero interest rate", () => {
    const result = calculateLoanTerm(12000, 0, 1000);
    expect(result).toBe(12);
  });
});

describe("calculateLoanAmount", () => {
  it("calculates the loan amount correctly", () => {
    // At 3%, 120 months, $300 monthly
    const result = calculateLoanAmount(3, 120, 300);
    expect(result).toBeGreaterThan(30000);
    expect(result).toBeLessThan(35000);
  });

  it("handles zero interest rate", () => {
    const result = calculateLoanAmount(0, 12, 1000);
    expect(result).toBe(12000);
  });

  it("inverse of calculateMonthlyPayment", () => {
    const amount = 150000;
    const rate = 4.5;
    const term = 240;
    const payment = calculateMonthlyPayment(amount, rate, term);
    const calculatedAmount = calculateLoanAmount(rate, term, payment);
    expect(calculatedAmount).toBeCloseTo(amount, 0);
  });
});

describe("calculateRemainingDebt", () => {
  it("calculates remaining debt after partial term", () => {
    const result = calculateRemainingDebt(140916, 1.5, 1354, 120);
    expect(result).toBeGreaterThanOrEqual(0);
  });

  it("returns zero when fully paid off", () => {
    const payment = calculateMonthlyPayment(100000, 3, 120);
    const result = calculateRemainingDebt(100000, 3, payment, 120);
    expect(result).toBeCloseTo(0, 0);
  });

  it("handles zero interest rate", () => {
    const result = calculateRemainingDebt(12000, 0, 1000, 6);
    expect(result).toBe(6000);
  });
});

describe("calculateConstructionFinancing", () => {
  it("calculates monthly payment from interest + amortization rates", () => {
    // $100,000 at 3% interest, 1% amortization
    const result = calculateConstructionFinancing(100000, 3, 1);
    // Monthly = 100000 * (3 + 1) / 100 / 12 = 333.33
    expect(result.monthlyPayment).toBeCloseTo(333.33, 0);
    expect(result.loanTermMonths).toBeGreaterThan(0);
    expect(result.loanTermMonths).toBeLessThan(1200);
  });

  it("higher amortization means shorter term", () => {
    const low = calculateConstructionFinancing(100000, 3, 1);
    const high = calculateConstructionFinancing(100000, 3, 3);
    expect(high.loanTermMonths).toBeLessThan(low.loanTermMonths);
  });
});

describe("generateAmortizationSchedule", () => {
  it("generates a schedule that ends with zero remaining debt", () => {
    const schedule = generateAmortizationSchedule(
      100000,
      3,
      965.61,
      new Date(2026, 1, 1)
    );
    const last = schedule[schedule.length - 1];
    expect(last.remainingDebt).toBeCloseTo(0, 0);
  });

  it("first month has correct interest", () => {
    const schedule = generateAmortizationSchedule(
      100000,
      3,
      965.61,
      new Date(2026, 1, 1)
    );
    // First month interest = 100000 * 0.03 / 12 = 250
    expect(schedule[0].interest).toBeCloseTo(250, 0);
  });

  it("each month reduces remaining debt", () => {
    const schedule = generateAmortizationSchedule(
      100000,
      3,
      965.61,
      new Date(2026, 1, 1)
    );
    for (let i = 1; i < schedule.length; i++) {
      expect(schedule[i].remainingDebt).toBeLessThanOrEqual(
        schedule[i - 1].remainingDebt
      );
    }
  });

  it("includes extra payments", () => {
    const withExtra = generateAmortizationSchedule(
      100000,
      3,
      965.61,
      new Date(2026, 1, 1),
      1200
    );
    const withoutExtra = generateAmortizationSchedule(
      100000,
      3,
      965.61,
      new Date(2026, 1, 1),
      0
    );
    expect(withExtra.length).toBeLessThan(withoutExtra.length);
  });

  it("generates correct dates", () => {
    const schedule = generateAmortizationSchedule(
      10000,
      3,
      1000,
      new Date(2026, 0, 15)
    );
    expect(schedule[0].date.getMonth()).toBe(0); // January
    expect(schedule[1].date.getMonth()).toBe(1); // February
  });
});

describe("calculateFull", () => {
  it("monthly payment mode returns correct results", () => {
    const result = calculateFull({
      mode: "monthlyPayment",
      loanAmount: 140090,
      annualInterestRate: 1.5,
      loanTermMonths: 120,
      startDate: new Date(2026, 1, 21),
    });
    expect(result.monthlyPayment).toBeCloseTo(1257.88, 0);
    expect(result.totalInterest).toBeGreaterThan(0);
    expect(result.schedule.length).toBeGreaterThan(0);
  });

  it("loan term mode returns correct results", () => {
    const result = calculateFull({
      mode: "loanTerm",
      loanAmount: 139738,
      annualInterestRate: 1.5,
      monthlyPayment: 1354,
      startDate: new Date(2026, 1, 21),
    });
    expect(result.loanTermMonths).toBeGreaterThan(100);
    expect(result.loanTermMonths).toBeLessThan(130);
  });

  it("amount mode returns correct results", () => {
    const result = calculateFull({
      mode: "amount",
      annualInterestRate: 3,
      loanTermMonths: 120,
      monthlyPayment: 300,
      startDate: new Date(2026, 1, 21),
    });
    expect(result.totalPayment).toBeGreaterThan(0);
    expect(result.schedule.length).toBeGreaterThan(0);
  });

  it("construction financing mode returns correct results", () => {
    const result = calculateFull({
      mode: "constructionFinancing",
      loanAmount: 100000,
      annualInterestRate: 3,
      amortizationRate: 1,
      startDate: new Date(2026, 1, 21),
    });
    expect(result.monthlyPayment).toBeCloseTo(333.33, 0);
    expect(result.loanTermMonths).toBeGreaterThan(0);
  });

  it("remaining debt mode returns correct results", () => {
    const result = calculateFull({
      mode: "remainingDebt",
      loanAmount: 140916,
      annualInterestRate: 1.5,
      monthlyPayment: 1354,
      loanTermMonths: 120,
      startDate: new Date(2026, 1, 21),
    });
    expect(result.monthlyPayment).toBe(1354);
    expect(result.loanTermMonths).toBe(120);
  });
});
