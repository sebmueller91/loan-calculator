import { addMonths } from 'date-fns';

/**
 * Calculate monthly interest from annual rate
 * @param {number} debt - Remaining debt
 * @param {number} annualRate - Annual interest rate as percentage (e.g., 5 for 5%)
 * @returns {number} Monthly interest amount
 */
function calculateMonthlyInterest(debt, annualRate) {
  return (debt * annualRate) / 100 / 12;
}

/**
 * Generate amortization schedule
 * @param {number} loanAmount - Total loan amount
 * @param {number} interestRate - Annual interest rate (%)
 * @param {number} monthlyPayment - Monthly payment amount
 * @param {number} annualExtraPayment - Extra payment at end of each loan year
 * @param {Date} startDate - Loan start date
 * @param {number|null} maxMonths - Maximum months (null = calculate until debt is 0)
 * @returns {Object} { schedule, totalPayment, totalInterest, months, error }
 */
function generateAmortizationSchedule(
  loanAmount,
  interestRate,
  monthlyPayment,
  annualExtraPayment,
  startDate,
  maxMonths = null
) {
  const schedule = [];
  let remainingDebt = loanAmount;
  let totalPayment = 0;
  let totalInterest = 0;
  let month = 0;
  const MAX_ITERATIONS = 1200; // 100 years safety limit

  while (remainingDebt > 0.01 && month < MAX_ITERATIONS) {
    if (maxMonths !== null && month >= maxMonths) {
      // If we've reached max months but debt remains, return error
      return {
        schedule: [],
        totalPayment: 0,
        totalInterest: 0,
        months: 0,
        error: 'Loan cannot be paid off within the specified term',
      };
    }

    const interest = calculateMonthlyInterest(remainingDebt, interestRate);
    
    // Check if monthly payment is less than interest (infinite loan)
    if (monthlyPayment < interest && annualExtraPayment === 0) {
      return {
        schedule: [],
        totalPayment: 0,
        totalInterest: 0,
        months: 0,
        error: 'Monthly payment is less than interest - loan term would be infinite',
      };
    }

    let principal = monthlyPayment - interest;
    let extraPayment = 0;

    // Apply annual extra payment at the end of each loan year
    // Month numbering is 0-based, so month 11, 23, 35, etc. are end of year
    if ((month + 1) % 12 === 0 && annualExtraPayment > 0) {
      extraPayment = annualExtraPayment;
    }

    // Ensure we don't overpay
    const totalMonthPayment = principal + extraPayment;
    if (totalMonthPayment > remainingDebt) {
      principal = remainingDebt;
      extraPayment = 0;
    }

    remainingDebt -= principal + extraPayment;
    totalPayment += monthlyPayment + extraPayment;
    totalInterest += interest;

    const currentDate = addMonths(startDate, month);

    schedule.push({
      month: month + 1,
      date: currentDate,
      interest,
      principal,
      extraPayment,
      remainingDebt: Math.max(0, remainingDebt),
    });

    month++;
  }

  if (month >= MAX_ITERATIONS) {
    return {
      schedule: [],
      totalPayment: 0,
      totalInterest: 0,
      months: 0,
      error: 'Loan term exceeds maximum iterations',
    };
  }

  return {
    schedule,
    totalPayment,
    totalInterest,
    months: month,
    error: null,
  };
}

/**
 * Calculate repayment rate (Definition A)
 * Formula: (First_Month_Principal_Portion * 12) / Total_Loan_Amount
 * @param {number} firstMonthPrincipal - Principal portion of first month's payment
 * @param {number} loanAmount - Total loan amount
 * @returns {number} Repayment rate as percentage
 */
function calculateRepaymentRate(firstMonthPrincipal, loanAmount) {
  return ((firstMonthPrincipal * 12) / loanAmount) * 100;
}

/**
 * Option 1: Calculate Loan Term
 * Inputs: Loan Amount, Interest Rate, Monthly Payment, Annual Extra Payment, Start Date
 * Outputs: Total Payment, Total Interest, Loan Term, Repayment Rate
 */
export function calculateLoanTerm(
  loanAmount,
  interestRate,
  monthlyPayment,
  annualExtraPayment,
  startDate
) {
  const result = generateAmortizationSchedule(
    loanAmount,
    interestRate,
    monthlyPayment,
    annualExtraPayment,
    startDate,
    null
  );

  if (result.error) {
    return { error: result.error };
  }

  const firstMonthPrincipal = result.schedule[0]?.principal || 0;
  const repaymentRate = calculateRepaymentRate(firstMonthPrincipal, loanAmount);

  const years = Math.floor(result.months / 12);
  const months = result.months % 12;

  return {
    schedule: result.schedule,
    totalPayment: result.totalPayment,
    totalInterest: result.totalInterest,
    loanTermYears: years,
    loanTermMonths: months,
    repaymentRate,
    error: null,
  };
}

/**
 * Option 2: Calculate Monthly Payment
 * Uses binary search to find the monthly payment that results in 0 debt at the end of the term
 * Inputs: Loan Amount, Interest Rate, Loan Term, Annual Extra Payment, Start Date
 * Outputs: Monthly Payment, Total Payment, Total Interest, Repayment Rate
 */
export function calculateMonthlyPayment(
  loanAmount,
  interestRate,
  loanTermMonths,
  annualExtraPayment,
  startDate
) {
  // Binary search for the correct monthly payment
  let low = 0;
  let high = loanAmount * 2; // Upper bound estimate
  const tolerance = 0.01; // $0.01 tolerance
  let iterations = 0;
  const maxIterations = 100;

  while (iterations < maxIterations) {
    const mid = (low + high) / 2;
    
    const result = generateAmortizationSchedule(
      loanAmount,
      interestRate,
      mid,
      annualExtraPayment,
      startDate,
      loanTermMonths
    );

    // If there's an error or schedule is empty, monthly payment is too low
    if (result.error || result.schedule.length === 0) {
      low = mid;
      iterations++;
      continue;
    }

    const finalDebt = result.schedule[result.schedule.length - 1]?.remainingDebt || 0;

    // If we're within tolerance, we've found the answer
    if (Math.abs(finalDebt) < tolerance) {
      const firstMonthPrincipal = result.schedule[0]?.principal || 0;
      const repaymentRate = calculateRepaymentRate(firstMonthPrincipal, loanAmount);

      return {
        schedule: result.schedule,
        monthlyPayment: mid,
        totalPayment: result.totalPayment,
        totalInterest: result.totalInterest,
        repaymentRate,
        error: null,
      };
    }

    // If debt is positive, we need to pay more
    if (finalDebt > tolerance) {
      low = mid;
    } else {
      high = mid;
    }

    iterations++;
  }

  // If we couldn't find a solution, return an error
  return {
    error: 'Could not calculate monthly payment within tolerance',
  };
}

/**
 * Option 3: Calculate Max Loan Amount
 * Uses binary search to find the maximum loan amount that can be paid off with given parameters
 * Inputs: Monthly Payment, Interest Rate, Loan Term, Annual Extra Payment, Start Date
 * Outputs: Max Loan Amount, Total Payment, Total Interest, Repayment Rate
 */
export function calculateMaxLoanAmount(
  monthlyPayment,
  interestRate,
  loanTermMonths,
  annualExtraPayment,
  startDate
) {
  // Binary search for the maximum loan amount
  let low = 0;
  let high = 10000000; // 10M upper bound as specified
  const tolerance = 1; // $1 tolerance
  let iterations = 0;
  const maxIterations = 100;

  while (iterations < maxIterations) {
    const mid = (low + high) / 2;
    
    const result = generateAmortizationSchedule(
      mid,
      interestRate,
      monthlyPayment,
      annualExtraPayment,
      startDate,
      loanTermMonths
    );

    // If there's an error or schedule is empty, loan amount is too high
    if (result.error || result.schedule.length === 0) {
      high = mid;
      iterations++;
      continue;
    }

    const finalDebt = result.schedule[result.schedule.length - 1]?.remainingDebt || 0;

    // If we're within tolerance and debt is close to 0, we've found the answer
    if (Math.abs(finalDebt) < tolerance) {
      const firstMonthPrincipal = result.schedule[0]?.principal || 0;
      const repaymentRate = calculateRepaymentRate(firstMonthPrincipal, mid);

      return {
        schedule: result.schedule,
        maxLoanAmount: mid,
        totalPayment: result.totalPayment,
        totalInterest: result.totalInterest,
        repaymentRate,
        error: null,
      };
    }

    // If debt is positive, we can afford a larger loan
    if (finalDebt > tolerance) {
      low = mid;
    } else {
      // If we've overpaid, reduce the loan amount
      high = mid;
    }

    iterations++;
  }

  // If we couldn't find a solution, return an error
  return {
    error: 'Could not calculate max loan amount within tolerance',
  };
}
