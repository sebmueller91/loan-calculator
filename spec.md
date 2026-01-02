# Loan Calculator Application Specification

## 1. Project Overview
A React-based loan calculator with three distinct calculation modes.
**Stack:** Vite (React), Tailwind CSS, Recharts, date-fns.
**Language:** The entire UI (labels, buttons, outputs) must be in **English**.

## 2. Global Configuration & Math Rules
### Configuration
* **Currency:** Configurable via a global constant (default to `€`).
    * *Implementation:* Create a simple utility or constant file to handle currency formatting (e.g., `Intl.NumberFormat`).
* **Date Format:** Display dates as "MMM yyyy" (e.g., "Feb 2026").

### Business Logic
* **Repayment Rate (Definition A):**
    * Formula: `(First_Month_Principal_Portion * 12) / Total_Loan_Amount`
    * Display as a percentage (e.g., "2.0%").
* **Annual Extra Payment:**
    * Must be applied at the **end of each loan year** (not calendar year).
    * *Example:* If loan starts in Feb 2026, the extra payment is applied in Jan 2027 (Month 12 of the cycle).
* **Amortization Logic:**
    * Interest is calculated monthly based on remaining debt: `(Debt * Annual_Rate) / 12`.
    * Principal = Monthly_Payment - Interest.
    * If Monthly_Payment < Interest (in Option 1), the loan is invalid (infinite term). Return an error state.

## 3. Calculation Options (Tabs)

### Option 1: "Loan Term"
* **Inputs:** Loan Amount, Interest Rate (%), Monthly Payment, Annual Extra Payment, Start Date.
* **Calculate:**
    * Total Payment (Sum of all monthly + extra payments).
    * Total Interest.
    * Loan Term (Format: "X Years, Y Months").
    * Repayment Rate (Initial %).

### Option 2: "Monthly Payment"
* **Inputs:** Loan Amount, Interest Rate (%), Loan Term (Years or Months), Annual Extra Payment, Start Date.
* **Calculate:**
    * Monthly Payment (The standardized monthly rate required to hit 0 debt at end of term).
        * *Note:* Because "Annual Extra Payments" make the math non-linear, **use a binary search algorithm** to find the exact Monthly Payment.
    * Total Payment, Total Interest, Repayment Rate.

### Option 3: "Max Loan Amount"
* **Inputs:** Monthly Payment, Interest Rate (%), Loan Term (Years or Months), Annual Extra Payment, Start Date.
* **Calculate:**
    * **Max Loan Amount:** The total loan one can afford given these parameters.
        * *Note:* **Use a binary search algorithm** (range 0 to 10M) to find the Loan Amount where debt becomes exactly 0 at the end of the term.
    * Total Payment, Total Interest, Repayment Rate.

## 4. UI Requirements
* **Layout:**
    * **Left Column:** Input Form (dynamic based on selected Tab).
    * **Right Column:** Results Dashboard.
* **Results Dashboard:**
    * **Key Metrics:** Grid of cards showing the calculated results.
    * **Chart:** `recharts` ComposedChart.
        * X-Axis: Time (Years).
        * Area: "Remaining Debt" (starts high, goes to 0).
        * Line: "Sum of Payments" (starts 0, goes up).
    * **Amortization Schedule Table:**
        * Columns: Month (e.g., "Feb 2026"), Interest, Principal, Remaining Debt.
        * **Highlighting:** Visually highlight rows where an "Annual Extra Payment" was deducted.

## 5. Technical Guidelines
* Use `date-fns` for all date operations.
* **Crucial:** Extract all calculation logic into `src/utils/loanMath.js`. The React components should only handle UI state and pass data to this utility.
* Use Tailwind for all styling (Slate/Blue color scheme).