import { useEffect, useRef, useState } from 'react'
import { format, startOfMonth } from 'date-fns'
import { ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { calculateLoanTerm, calculateMonthlyPayment, calculateMaxLoanAmount } from './utils/loanMath'
import { formatCurrency } from './utils/constants'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('loanTerm')
  const hasInitialCalculationRun = useRef(false)
  
  // Option 1: Loan Term inputs
  const [loanAmount, setLoanAmount] = useState('150000')
  const [interestRate, setInterestRate] = useState('1.5')
  const [monthlyPayment, setMonthlyPayment] = useState('1000')
  const [annualExtraPayment, setAnnualExtraPayment] = useState('0')
  const [startDate, setStartDate] = useState(format(startOfMonth(new Date()), 'yyyy-MM-dd'))
  
  // Option 2: Monthly Payment inputs
  const [loanAmount2, setLoanAmount2] = useState('150000')
  const [interestRate2, setInterestRate2] = useState('1.5')
  const [loanTermMonths, setLoanTermMonths] = useState('240')
  const [annualExtraPayment2, setAnnualExtraPayment2] = useState('0')
  const [startDate2, setStartDate2] = useState(format(startOfMonth(new Date()), 'yyyy-MM-dd'))
  
  // Option 3: Max Loan Amount inputs
  const [monthlyPayment3, setMonthlyPayment3] = useState('1000')
  const [interestRate3, setInterestRate3] = useState('1.5')
  const [loanTermMonths3, setLoanTermMonths3] = useState('240')
  const [annualExtraPayment3, setAnnualExtraPayment3] = useState('0')
  const [startDate3, setStartDate3] = useState(format(startOfMonth(new Date()), 'yyyy-MM-dd'))

  // Results state
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)

  const tabs = [
    { id: 'loanTerm', label: 'Loan Term' },
    { id: 'monthlyPayment', label: 'Monthly Payment' },
    { id: 'maxLoanAmount', label: 'Max Loan Amount' },
  ]

  const tabDescription =
    activeTab === 'loanTerm'
      ? 'Find out how long it takes to pay off a loan with a given monthly payment.'
      : activeTab === 'monthlyPayment'
        ? 'Calculate the monthly payment needed to pay off a loan within a fixed term.'
        : 'Estimate the maximum loan amount you can afford for a fixed monthly payment and term.'

  const handleCalculate = (tabIdOrEvent) => {
    const tabId = typeof tabIdOrEvent === 'string' ? tabIdOrEvent : activeTab
    setError(null)
    setResults(null)

    try {
      if (tabId === 'loanTerm') {
        const result = calculateLoanTerm(
          parseFloat(loanAmount),
          parseFloat(interestRate),
          parseFloat(monthlyPayment),
          parseFloat(annualExtraPayment),
          new Date(startDate)
        )
        
        if (result.error) {
          setError(result.error)
        } else {
          setResults(result)
        }
      } else if (tabId === 'monthlyPayment') {
        const result = calculateMonthlyPayment(
          parseFloat(loanAmount2),
          parseFloat(interestRate2),
          parseInt(loanTermMonths),
          parseFloat(annualExtraPayment2),
          new Date(startDate2)
        )
        
        if (result.error) {
          setError(result.error)
        } else {
          setResults(result)
        }
      } else if (tabId === 'maxLoanAmount') {
        const result = calculateMaxLoanAmount(
          parseFloat(monthlyPayment3),
          parseFloat(interestRate3),
          parseInt(loanTermMonths3),
          parseFloat(annualExtraPayment3),
          new Date(startDate3)
        )
        
        if (result.error) {
          setError(result.error)
        } else {
          setResults(result)
        }
      }
    } catch (err) {
      setError('Invalid input values. Please check your entries.')
    }
  }

  useEffect(() => {
    if (hasInitialCalculationRun.current) return
    hasInitialCalculationRun.current = true
    handleCalculate('loanTerm')
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 py-8 px-4 text-slate-100">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-sky-300 to-indigo-300 bg-clip-text text-transparent mb-2">
            Loan Calculator
          </h1>
          <p className="text-slate-300 text-lg">Calculate your loan terms, payments, and more</p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="bg-slate-900/60 rounded-lg border border-slate-800 p-2">
            <nav className="flex space-x-2" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id)
                    handleCalculate(tab.id)
                  }}
                  className={`
                    flex-1 py-3 px-4 rounded-md font-medium text-sm transition-all duration-200
                    ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-indigo-500 to-sky-500 text-white shadow-md'
                        : 'text-slate-300 hover:bg-slate-800/60 hover:text-slate-100'
                    }
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <p className="mt-3 text-slate-300 text-sm text-center">{tabDescription}</p>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Input Forms */}
          <div className="bg-slate-900/60 rounded-xl p-8 border border-slate-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-gradient-to-b from-sky-400 to-indigo-400 rounded-full"></div>
              <h2 className="text-2xl font-bold text-slate-100">
                Input Parameters
              </h2>
            </div>

            {/* Option 1: Loan Term */}
            {activeTab === 'loanTerm' && (
              <div className="space-y-4 min-h-[520px]">
                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Loan Amount
                  </label>
                  <input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    className="w-full p-3 border-2 border-slate-800 text-slate-100 placeholder:text-slate-500 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all [appearance:textfield] bg-slate-950/40 hover:bg-slate-950/60"
                    placeholder="200000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Interest Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    className="w-full p-3 border-2 border-slate-800 text-slate-100 placeholder:text-slate-500 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all [appearance:textfield] bg-slate-950/40 hover:bg-slate-950/60"
                    placeholder="5.0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Monthly Payment
                  </label>
                  <input
                    type="number"
                    value={monthlyPayment}
                    onChange={(e) => setMonthlyPayment(e.target.value)}
                    className="w-full p-3 border-2 border-slate-800 text-slate-100 placeholder:text-slate-500 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all [appearance:textfield] bg-slate-950/40 hover:bg-slate-950/60"
                    placeholder="1200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Annual Extra Payment
                  </label>
                  <input
                    type="number"
                    value={annualExtraPayment}
                    onChange={(e) => setAnnualExtraPayment(e.target.value)}
                    className="w-full p-3 border-2 border-slate-800 text-slate-100 placeholder:text-slate-500 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all [appearance:textfield] bg-slate-950/40 hover:bg-slate-950/60"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-3 border-2 border-slate-800 text-slate-100 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all bg-slate-950/40 hover:bg-slate-950/60"
                  />
                </div>

                <button 
                  onClick={handleCalculate}
                  className="w-full bg-gradient-to-r from-indigo-500 to-sky-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-indigo-600 hover:to-sky-600 transition-all shadow-md hover:shadow-lg mt-6 transform hover:scale-[1.02]"
                >
                  Calculate Loan Term
                </button>
              </div>
            )}

            {/* Option 2: Monthly Payment */}
            {activeTab === 'monthlyPayment' && (
              <div className="space-y-4 min-h-[520px]">
                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Loan Amount
                  </label>
                  <input
                    type="number"
                    value={loanAmount2}
                    onChange={(e) => setLoanAmount2(e.target.value)}
                    className="w-full p-3 border-2 border-slate-800 text-slate-100 placeholder:text-slate-500 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all [appearance:textfield] bg-slate-950/40 hover:bg-slate-950/60"
                    placeholder="200000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Interest Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={interestRate2}
                    onChange={(e) => setInterestRate2(e.target.value)}
                    className="w-full p-3 border-2 border-slate-800 text-slate-100 placeholder:text-slate-500 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all [appearance:textfield] bg-slate-950/40 hover:bg-slate-950/60"
                    placeholder="5.0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Loan Term (Months)
                  </label>
                  <input
                    type="number"
                    value={loanTermMonths}
                    onChange={(e) => setLoanTermMonths(e.target.value)}
                    className="w-full p-3 border-2 border-slate-800 text-slate-100 placeholder:text-slate-500 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all [appearance:textfield] bg-slate-950/40 hover:bg-slate-950/60"
                    placeholder="240"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Annual Extra Payment
                  </label>
                  <input
                    type="number"
                    value={annualExtraPayment2}
                    onChange={(e) => setAnnualExtraPayment2(e.target.value)}
                    className="w-full p-3 border-2 border-slate-800 text-slate-100 placeholder:text-slate-500 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all [appearance:textfield] bg-slate-950/40 hover:bg-slate-950/60"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate2}
                    onChange={(e) => setStartDate2(e.target.value)}
                    className="w-full p-3 border-2 border-slate-800 text-slate-100 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all bg-slate-950/40 hover:bg-slate-950/60"
                  />
                </div>

                <button 
                  onClick={handleCalculate}
                  className="w-full bg-gradient-to-r from-indigo-500 to-sky-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-indigo-600 hover:to-sky-600 transition-all shadow-md hover:shadow-lg mt-6 transform hover:scale-[1.02]"
                >
                  Calculate Monthly Payment
                </button>
              </div>
            )}

            {/* Option 3: Max Loan Amount */}
            {activeTab === 'maxLoanAmount' && (
              <div className="space-y-4 min-h-[520px]">
                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Monthly Payment
                  </label>
                  <input
                    type="number"
                    value={monthlyPayment3}
                    onChange={(e) => setMonthlyPayment3(e.target.value)}
                    className="w-full p-3 border-2 border-slate-800 text-slate-100 placeholder:text-slate-500 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all [appearance:textfield] bg-slate-950/40 hover:bg-slate-950/60"
                    placeholder="1500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Interest Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={interestRate3}
                    onChange={(e) => setInterestRate3(e.target.value)}
                    className="w-full p-3 border-2 border-slate-800 text-slate-100 placeholder:text-slate-500 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all [appearance:textfield] bg-slate-950/40 hover:bg-slate-950/60"
                    placeholder="5.0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Loan Term (Months)
                  </label>
                  <input
                    type="number"
                    value={loanTermMonths3}
                    onChange={(e) => setLoanTermMonths3(e.target.value)}
                    className="w-full p-3 border-2 border-slate-800 text-slate-100 placeholder:text-slate-500 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all [appearance:textfield] bg-slate-950/40 hover:bg-slate-950/60"
                    placeholder="240"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Annual Extra Payment
                  </label>
                  <input
                    type="number"
                    value={annualExtraPayment3}
                    onChange={(e) => setAnnualExtraPayment3(e.target.value)}
                    className="w-full p-3 border-2 border-slate-800 text-slate-100 placeholder:text-slate-500 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all [appearance:textfield] bg-slate-950/40 hover:bg-slate-950/60"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate3}
                    onChange={(e) => setStartDate3(e.target.value)}
                    className="w-full p-3 border-2 border-slate-800 text-slate-100 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all bg-slate-950/40 hover:bg-slate-950/60"
                  />
                </div>

                <button 
                  onClick={handleCalculate}
                  className="w-full bg-gradient-to-r from-indigo-500 to-sky-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-indigo-600 hover:to-sky-600 transition-all shadow-md hover:shadow-lg mt-6 transform hover:scale-[1.02]"
                >
                  Calculate Max Loan Amount
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Results Dashboard */}
          <div className="bg-slate-900/60 rounded-xl p-8 border border-slate-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-gradient-to-b from-indigo-400 to-sky-400 rounded-full"></div>
              <h2 className="text-2xl font-bold text-slate-100">
                Results Dashboard
              </h2>
            </div>
            
            {error && (
              <div className="bg-gradient-to-r from-red-950/60 to-rose-950/60 border-2 border-red-900/60 text-red-200 px-5 py-4 rounded-lg mb-6 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="text-xl">⚠️</span>
                  <span className="font-medium">{error}</span>
                </div>
              </div>
            )}

            {!results && !error && (
              <div className="text-center py-16 min-h-[600px] flex flex-col items-center justify-center">
                <div className="text-6xl mb-4">📊</div>
                <p className="text-slate-300 text-lg font-medium">Results will appear here after calculation</p>
                <p className="text-slate-400 text-sm mt-2">Fill in the parameters and click calculate</p>
              </div>
            )}

            {results && (
              <div className="space-y-8 min-h-[600px]">
                {/* Key Metrics Grid */}
                <div>
                  <h3 className="text-xl font-bold text-slate-100 mb-5 flex items-center gap-2">
                    <span className="text-2xl">💰</span>
                    Key Metrics
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {activeTab === 'loanTerm' && (
                      <>
                        <MetricCard 
                          label="Loan Term" 
                          value={`${results.loanTermYears} Years, ${results.loanTermMonths} Months`} 
                        />
                        <MetricCard 
                          label="Total Interest" 
                          value={formatCurrency(results.totalInterest)} 
                        />
                        <MetricCard 
                          label="Total Payment" 
                          value={formatCurrency(results.totalPayment)} 
                        />
                        <MetricCard 
                          label="Repayment Rate" 
                          value={`${results.repaymentRate.toFixed(2)}%`} 
                        />
                      </>
                    )}

                    {activeTab === 'monthlyPayment' && (
                      <>
                        <MetricCard 
                          label="Monthly Payment" 
                          value={formatCurrency(results.monthlyPayment)} 
                        />
                        <MetricCard 
                          label="Total Interest" 
                          value={formatCurrency(results.totalInterest)} 
                        />
                        <MetricCard 
                          label="Total Payment" 
                          value={formatCurrency(results.totalPayment)} 
                        />
                        <MetricCard 
                          label="Repayment Rate" 
                          value={`${results.repaymentRate.toFixed(2)}%`} 
                        />
                      </>
                    )}

                    {activeTab === 'maxLoanAmount' && (
                      <>
                        <MetricCard 
                          label="Max Loan Amount" 
                          value={formatCurrency(results.maxLoanAmount)} 
                        />
                        <MetricCard 
                          label="Total Interest" 
                          value={formatCurrency(results.totalInterest)} 
                        />
                        <MetricCard 
                          label="Total Payment" 
                          value={formatCurrency(results.totalPayment)} 
                        />
                        <MetricCard 
                          label="Repayment Rate" 
                          value={`${results.repaymentRate.toFixed(2)}%`} 
                        />
                      </>
                    )}
                  </div>
                </div>

                {/* Chart */}
                <div>
                  <h3 className="text-xl font-bold text-slate-100 mb-5 flex items-center gap-2">
                    <span className="text-2xl">📈</span>
                    Loan Progress
                  </h3>
                  <div className="bg-slate-950/40 rounded-xl p-4 border-2 border-slate-800 text-slate-300">
                    <LoanChart schedule={results.schedule} />
                  </div>
                </div>

                {/* Amortization Schedule */}
                <div>
                  <h3 className="text-xl font-bold text-slate-100 mb-5 flex items-center gap-2">
                    <span className="text-2xl">📋</span>
                    Amortization Schedule
                  </h3>
                  <AmortizationTable schedule={results.schedule} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Metric Card Component
function MetricCard({ label, value }) {
  return (
    <div className="bg-gradient-to-br from-slate-950/60 to-slate-900/60 rounded-xl p-4 sm:p-5 border-2 border-slate-800 hover:border-sky-600/60 transition-all hover:shadow-md">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">{label}</p>
      <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-sky-300 to-indigo-300 bg-clip-text text-transparent break-words whitespace-normal leading-tight tabular-nums">
        {value}
      </p>
    </div>
  )
}

// Loan Chart Component
function LoanChart({ schedule }) {
  // Prepare data for chart - sample every 12 months for cleaner visualization
  const chartData = schedule
    .filter((_, index) => index % 12 === 0 || index === schedule.length - 1)
    .map((row, index) => {
      // Calculate cumulative payments up to this point
      const cumulativePayments = schedule
        .slice(0, row.month)
        .reduce((sum, r) => sum + r.interest + r.principal + r.extraPayment, 0)
      
      return {
        year: (row.month / 12).toFixed(1),
        debt: row.remainingDebt,
        payments: cumulativePayments,
      }
    })

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={chartData} margin={{ top: 8, right: 12, bottom: 8, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.2} />
        <XAxis 
          dataKey="year" 
          label={{ value: 'Years', position: 'insideBottom', offset: -5 }} 
          tick={{ fill: 'currentColor' }}
          axisLine={{ stroke: 'currentColor', strokeOpacity: 0.35 }}
          tickLine={{ stroke: 'currentColor', strokeOpacity: 0.35 }}
        />
        <YAxis 
          label={{ value: 'Amount (€)', angle: -90, position: 'insideLeft', offset: 10 }} 
          width={92}
          tick={{ fill: 'currentColor' }}
          axisLine={{ stroke: 'currentColor', strokeOpacity: 0.35 }}
          tickLine={{ stroke: 'currentColor', strokeOpacity: 0.35 }}
        />
        <Tooltip 
          formatter={(value) => formatCurrency(value)}
          labelFormatter={(label) => `Year ${label}`}
        />
        <Legend />
        <Area 
          type="monotone" 
          dataKey="debt" 
          fill="#94a3b8" 
          stroke="#64748b" 
          name="Remaining Debt" 
        />
        <Line 
          type="monotone" 
          dataKey="payments" 
          stroke="#3b82f6" 
          strokeWidth={2} 
          name="Sum of Payments" 
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}

// Amortization Table Component
function AmortizationTable({ schedule }) {
  return (
    <div className="scrollbar-dark overflow-auto max-h-96 border-2 border-slate-800 rounded-xl shadow-sm bg-slate-950/20">
      <table className="w-full text-sm min-w-max">
        <thead className="bg-gradient-to-r from-slate-950 to-slate-900 sticky top-0">
          <tr>
            <th className="text-left px-4 py-3 font-bold text-slate-200 whitespace-nowrap">Month</th>
            <th className="text-right px-4 py-3 font-bold text-slate-200 whitespace-nowrap">Interest</th>
            <th className="text-right px-4 py-3 font-bold text-slate-200 whitespace-nowrap">Principal</th>
            <th className="text-right px-4 py-3 font-bold text-slate-200 whitespace-nowrap">Remaining Debt</th>
          </tr>
        </thead>
        <tbody>
          {schedule.map((row, index) => (
            <tr 
              key={index}
              className={`border-t border-slate-800 ${
                row.extraPayment > 0
                  ? 'bg-gradient-to-r from-indigo-950/40 to-slate-900/40 font-semibold'
                  : 'hover:bg-slate-900/40'
              }`}
            >
              <td className="px-4 py-3 text-slate-200 whitespace-nowrap">
                {format(row.date, 'MMM yyyy')}
                {row.extraPayment > 0 && (
                  <span className="ml-2 text-xs text-sky-300 font-semibold">
                    (+{formatCurrency(row.extraPayment)} extra)
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-right text-slate-200 whitespace-nowrap tabular-nums">{formatCurrency(row.interest)}</td>
              <td className="px-4 py-3 text-right text-slate-200 whitespace-nowrap tabular-nums">{formatCurrency(row.principal)}</td>
              <td className="px-4 py-3 text-right font-semibold text-slate-100 whitespace-nowrap tabular-nums">{formatCurrency(row.remainingDebt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App
