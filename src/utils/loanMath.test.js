import {
  calculateLoanTerm,
  calculateMonthlyPayment,
  calculateMaxLoanAmount,
} from './loanMath';

describe('loanMath', () => {
  const startDate = new Date('2026-02-01');

  describe('Option 1: calculateLoanTerm', () => {
    test('should calculate loan term correctly without annual extra payment', () => {
      const result = calculateLoanTerm(
        200000, // Loan Amount
        5, // Interest Rate (5%)
        1200, // Monthly Payment
        0, // Annual Extra Payment
        startDate
      );

      expect(result.error).toBeNull();
      expect(result.schedule).toBeDefined();
      expect(result.schedule.length).toBeGreaterThan(0);
      expect(result.totalPayment).toBeGreaterThan(200000);
      expect(result.totalInterest).toBeGreaterThan(0);
      expect(result.loanTermYears).toBeGreaterThan(0);
      expect(result.repaymentRate).toBeGreaterThan(0);
      
      // Final debt should be very close to 0
      const finalDebt = result.schedule[result.schedule.length - 1].remainingDebt;
      expect(finalDebt).toBeLessThan(1);
    });

    test('should calculate loan term correctly with annual extra payment', () => {
      const result = calculateLoanTerm(
        200000, // Loan Amount
        5, // Interest Rate (5%)
        1200, // Monthly Payment
        5000, // Annual Extra Payment
        startDate
      );

      expect(result.error).toBeNull();
      expect(result.schedule).toBeDefined();
      
      // Check that annual extra payments are applied at the right times
      const extraPaymentMonths = result.schedule.filter(row => row.extraPayment > 0);
      expect(extraPaymentMonths.length).toBeGreaterThan(0);
      
      // Each extra payment should be at month 12, 24, 36, etc.
      extraPaymentMonths.forEach(row => {
        expect(row.month % 12).toBe(0);
        expect(row.extraPayment).toBe(5000);
      });
      
      // Final debt should be very close to 0
      const finalDebt = result.schedule[result.schedule.length - 1].remainingDebt;
      expect(finalDebt).toBeLessThan(1);
    });

    test('should return error when monthly payment is less than interest', () => {
      const result = calculateLoanTerm(
        200000, // Loan Amount
        5, // Interest Rate (5%)
        500, // Monthly Payment (too low)
        0, // Annual Extra Payment
        startDate
      );

      expect(result.error).toBe('Monthly payment is less than interest - loan term would be infinite');
    });
  });

  describe('Option 2: calculateMonthlyPayment', () => {
    test('should calculate monthly payment correctly without annual extra payment', () => {
      const result = calculateMonthlyPayment(
        200000, // Loan Amount
        5, // Interest Rate (5%)
        240, // Loan Term (20 years = 240 months)
        0, // Annual Extra Payment
        startDate
      );

      expect(result.error).toBeNull();
      expect(result.monthlyPayment).toBeGreaterThan(0);
      expect(result.schedule).toBeDefined();
      expect(result.schedule.length).toBe(240);
      expect(result.totalPayment).toBeGreaterThan(200000);
      expect(result.totalInterest).toBeGreaterThan(0);
      expect(result.repaymentRate).toBeGreaterThan(0);
      
      // Final debt should be very close to 0
      const finalDebt = result.schedule[result.schedule.length - 1].remainingDebt;
      expect(finalDebt).toBeLessThan(1);
    });

    test('should calculate monthly payment correctly with annual extra payment', () => {
      const result = calculateMonthlyPayment(
        200000, // Loan Amount
        5, // Interest Rate (5%)
        240, // Loan Term (20 years = 240 months)
        5000, // Annual Extra Payment
        startDate
      );

      expect(result.error).toBeNull();
      expect(result.monthlyPayment).toBeGreaterThan(0);
      expect(result.schedule).toBeDefined();
      
      // With extra payments, monthly payment should be lower than without
      const resultWithoutExtra = calculateMonthlyPayment(
        200000,
        5,
        240,
        0,
        startDate
      );
      expect(result.monthlyPayment).toBeLessThan(resultWithoutExtra.monthlyPayment);
      
      // Check that annual extra payments are applied
      const extraPaymentMonths = result.schedule.filter(row => row.extraPayment > 0);
      expect(extraPaymentMonths.length).toBeGreaterThan(0);
      
      // Final debt should be very close to 0
      const finalDebt = result.schedule[result.schedule.length - 1].remainingDebt;
      expect(finalDebt).toBeLessThan(1);
    });
  });

  describe('Option 3: calculateMaxLoanAmount', () => {
    test('should calculate max loan amount correctly without annual extra payment', () => {
      const result = calculateMaxLoanAmount(
        1500, // Monthly Payment
        5, // Interest Rate (5%)
        240, // Loan Term (20 years = 240 months)
        0, // Annual Extra Payment
        startDate
      );

      expect(result.error).toBeNull();
      expect(result.maxLoanAmount).toBeGreaterThan(0);
      expect(result.schedule).toBeDefined();
      expect(result.schedule.length).toBe(240);
      expect(result.totalPayment).toBeGreaterThan(result.maxLoanAmount);
      expect(result.totalInterest).toBeGreaterThan(0);
      expect(result.repaymentRate).toBeGreaterThan(0);
      
      // Final debt should be very close to 0
      const finalDebt = result.schedule[result.schedule.length - 1].remainingDebt;
      expect(finalDebt).toBeLessThan(10);
    });

    test('should calculate max loan amount correctly with annual extra payment', () => {
      const result = calculateMaxLoanAmount(
        1500, // Monthly Payment
        5, // Interest Rate (5%)
        240, // Loan Term (20 years = 240 months)
        5000, // Annual Extra Payment
        startDate
      );

      expect(result.error).toBeNull();
      expect(result.maxLoanAmount).toBeGreaterThan(0);
      expect(result.schedule).toBeDefined();
      
      // With extra payments, max loan amount should be higher than without
      const resultWithoutExtra = calculateMaxLoanAmount(
        1500,
        5,
        240,
        0,
        startDate
      );
      expect(result.maxLoanAmount).toBeGreaterThan(resultWithoutExtra.maxLoanAmount);
      
      // Check that annual extra payments are applied
      const extraPaymentMonths = result.schedule.filter(row => row.extraPayment > 0);
      expect(extraPaymentMonths.length).toBeGreaterThan(0);
      
      // Final debt should be very close to 0
      const finalDebt = result.schedule[result.schedule.length - 1].remainingDebt;
      expect(finalDebt).toBeLessThan(10);
    });
  });
});
