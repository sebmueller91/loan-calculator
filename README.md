# Loan Calculator

A React + Vite loan calculator with three calculation modes, an amortization schedule, and a results dashboard.

## Calculation Modes

- **Loan Term**: Calculate loan duration from loan amount, interest rate, monthly payment, and optional annual extra payment.
- **Monthly Payment**: Calculate the required monthly payment for a given loan amount, interest rate, loan term, and optional annual extra payment.
- **Max Loan Amount**: Calculate the maximum loan amount affordable for a given monthly payment, interest rate, loan term, and optional annual extra payment.

Each mode provides totals (payment + interest), repayment rate, a chart, and a full amortization schedule.

## Tech Stack

- Vite + React
- Tailwind CSS
- Recharts
- date-fns

## Project Structure

- `src/App.jsx`: UI (tabs, forms, results)
- `src/utils/loanMath.js`: all calculations + schedule generation
- `src/utils/constants.js`: currency formatting (default: `€`)

## Business Rules (high level)

- Monthly interest: `(remainingDebt * annualRate) / 100 / 12`
- Principal each month: `monthlyPayment - interest`
- Annual extra payment is applied at the end of each loan year (month 12, 24, 36, ... relative to the start date)
- Repayment rate: `(firstMonthPrincipal * 12) / loanAmount`

## Local Development

	npm install
	npm run dev

Other useful commands:

	npm run build
	npm run preview
	npm run lint

## Docker

The Docker image is a multi-stage build (Vite build → Nginx static hosting).

	docker build -t loan-calculator:local .
	docker run --rm -p 8080:80 loan-calculator:local

Open: http://localhost:8080

## Notes

- There is a `src/utils/loanMath.test.js` file, but the repo does not currently define an `npm test` script or test runner configuration.
