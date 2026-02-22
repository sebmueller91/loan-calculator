# Loan Calculator

A mobile-optimized loan calculator web application with support for multiple calculation modes, amortization schedules, and visual charts. Available in English and German with configurable currency and display options.

## Features

- **5 Calculation Modes**
  - **Loan Term** - Calculate how long it takes to pay off a loan
  - **Monthly Payment** - Calculate the monthly payment for a given loan
  - **Amount** - Determine the maximum borrowing amount
  - **Remaining Debt** - Calculate remaining debt after a specific period
  - **Construction Financing** - German-style financing with interest + amortization rate

- **Amortization Schedule** - Detailed month-by-month breakdown showing interest, principal, and remaining balance
- **Visual Chart** - Dual-axis line chart showing remaining debt vs. cumulative payments over time
- **Multi-Language** - Full support for English and German
- **Multi-Currency** - Configurable currency (EUR, USD, GBP, CHF) with EUR as default
- **Settings** - Adjustable decimal places for display precision
- **Annual Extra Payments** - Optional annual extra payment support across all modes
- **Mobile-First Design** - Optimized for mobile devices with responsive layout

## Tech Stack

- [Next.js](https://nextjs.org/) 16 with App Router
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) v4
- [Recharts](https://recharts.org/) for data visualization
- [Vitest](https://vitest.dev/) for testing

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Running Tests

```bash
npm test
```

### Production Build

```bash
npm run build
npm start
```

## Docker

Build and run the application in a Docker container:

```bash
docker build -t loan-calculator .
docker run -p 3000:3000 loan-calculator
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

This project is configured for deployment on [Vercel](https://vercel.com/). Simply connect the GitHub repository and Vercel will handle the build and deployment automatically.

## Formulas

The calculator uses standard financial formulas:

| Calculation | Formula |
|---|---|
| Monthly Payment | `M = P * r(1+r)^n / ((1+r)^n - 1)` |
| Loan Term | `n = -log(1 - P*r/M) / log(1+r)` |
| Remaining Debt | `B = P(1+r)^n - M((1+r)^n - 1) / r` |

Where: P = principal, r = monthly interest rate, n = term in months, M = monthly payment

## License

ISC
