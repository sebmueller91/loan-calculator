import { useState } from 'react'
import { format } from 'date-fns'
import { ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { calculateLoanTerm, calculateMonthlyPayment, calculateMaxLoanAmount } from './utils/loanMath'
import { formatCurrency } from './utils/constants'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('loanTerm')
  
  // Option 1: Loan Term inputs
  const [loanAmount, setLoanAmount] = useState('')
  const [interestRate, setInterestRate] = useState('')
  const [monthlyPayment, setMonthlyPayment] = useState('')
  const [annualExtraPayment, setAnnualExtraPayment] = useState('0')
  const [startDate, setStartDate] = useState('')
  
  // Option 2: Monthly Payment inputs
  const [loanAmount2, setLoanAmount2] = useState('')
  const [interestRate2, setInterestRate2] = useState('')
  const [loanTermYears, setLoanTermYears] = useState('')
  const [loanTermMonths, setLoanTermMonths] = useState('0')
  const [annualExtraPayment2, setAnnualExtraPayment2] = useState('0')
  const [startDate2, setStartDate2] = useState('')
  
  // Option 3: Max Loan Amount inputs
  const [monthlyPayment3, setMonthlyPayment3] = useState('')
  const [interestRate3, setInterestRate3] = useState('')
  const [loanTermYears3, setLoanTermYears3] = useState('')
  const [loanTermMonths3, setLoanTermMonths3] = useState('0')
  const [annualExtraPayment3, setAnnualExtraPayment3] = useState('0')
  const [startDate3, setStartDate3] = useState('')

  // Results state
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)

  const tabs = [
    { id: 'loanTerm', label: 'Loan Term' },
    { id: 'monthlyPayment', label: 'Monthly Payment' },
    { id: 'maxLoanAmount', label: 'Max Loan Amount' },
  ]

  const handleCalculate = () => {
    setError(null)
    setResults(null)

    try {
      if (activeTab === 'loanTerm') {
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
      } else if (activeTab === 'monthlyPayment') {
        const totalMonths = parseInt(loanTermYears) * 12 + parseInt(loanTermMonths)
        const result = calculateMonthlyPayment(
          parseFloat(loanAmount2),
          parseFloat(interestRate2),
          totalMonths,
          parseFloat(annualExtraPayment2),
          new Date(startDate2)
        )
        
        if (result.error) {
          setError(result.error)
        } else {
          setResults(result)
        }
      } else if (activeTab === 'maxLoanAmount') {
        const totalMonths = parseInt(loanTermYears3) * 12 + parseInt(loanTermMonths3)
        const result = calculateMaxLoanAmount(
          parseFloat(monthlyPayment3),
          parseFloat(interestRate3),
          totalMonths,
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

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-800 mb-8 text-center">
          Loan Calculator
        </h1>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-slate-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                    ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    }
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Input Forms */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-slate-800 mb-6">
              Input Parameters
            </h2>

            {/* Option 1: Loan Term */}
            {activeTab === 'loanTerm' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Loan Amount
                  </label>
                  <input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="200000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Interest Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="5.0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Monthly Payment
                  </label>
                  <input
                    type="number"
                    value={monthlyPayment}
                    onChange={(e) => setMonthlyPayment(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="1200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Annual Extra Payment
                  </label>
                  <input
                    type="number"
                    value={annualExtraPayment}
                    onChange={(e) => setAnnualExtraPayment(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <button 
                  onClick={handleCalculate}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors mt-6"
                >
                  Calculate Loan Term
                </button>
              </div>
            )}

            {/* Option 2: Monthly Payment */}
            {activeTab === 'monthlyPayment' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Loan Amount
                  </label>
                  <input
                    type="number"
                    value={loanAmount2}
                    onChange={(e) => setLoanAmount2(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="200000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Interest Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={interestRate2}
                    onChange={(e) => setInterestRate2(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="5.0"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Loan Term (Years)
                    </label>
                    <input
                      type="number"
                      value={loanTermYears}
                      onChange={(e) => setLoanTermYears(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Loan Term (Months)
                    </label>
                    <input
                      type="number"
                      value={loanTermMonths}
                      onChange={(e) => setLoanTermMonths(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                      min="0"
                      max="11"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Annual Extra Payment
                  </label>
                  <input
                    type="number"
                    value={annualExtraPayment2}
                    onChange={(e) => setAnnualExtraPayment2(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate2}
                    onChange={(e) => setStartDate2(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <button 
                  onClick={handleCalculate}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors mt-6"
                >
                  Calculate Monthly Payment
                </button>
              </div>
            )}

            {/* Option 3: Max Loan Amount */}
            {activeTab === 'maxLoanAmount' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Monthly Payment
                  </label>
                  <input
                    type="number"
                    value={monthlyPayment3}
                    onChange={(e) => setMonthlyPayment3(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="1500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Interest Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={interestRate3}
                    onChange={(e) => setInterestRate3(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="5.0"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Loan Term (Years)
                    </label>
                    <input
                      type="number"
                      value={loanTermYears3}
                      onChange={(e) => setLoanTermYears3(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Loan Term (Months)
                    </label>
                    <input
                      type="number"
                      value={loanTermMonths3}
                      onChange={(e) => setLoanTermMonths3(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                      min="0"
                      max="11"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Annual Extra Payment
                  </label>
                  <input
                    type="number"
                    value={annualExtraPayment3}
                    onChange={(e) => setAnnualExtraPayment3(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate3}
                    onChange={(e) => setStartDate3(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <button 
                  onClick={handleCalculate}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors mt-6"
                >
                  Calculate Max Loan Amount
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Results Dashboard */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-slate-800 mb-6">
              Results Dashboard
            </h2>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
                {error}
              </div>
            )}

            {!results && !error && (
              <div className="text-slate-500 text-center py-12">
                <p>Results will appear here after calculation</p>
              </div>
            )}

            {results && (
              <div className="space-y-8">
                {/* Key Metrics Grid */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Key Metrics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {activeTab === 'loanTerm' && (
                      <>
                        <MetricCard 
                          label="Loan Term" 
                          value={`${results.loanTermYears} Years, ${results.loanTermMonths} Months`} 
                        />
                        <MetricCard 
                          label="Total Payment" 
                          value={formatCurrency(results.totalPayment)} 
                        />
                        <MetricCard 
                          label="Total Interest" 
                          value={formatCurrency(results.totalInterest)} 
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
                          label="Total Payment" 
                          value={formatCurrency(results.totalPayment)} 
                        />
                        <MetricCard 
                          label="Total Interest" 
                          value={formatCurrency(results.totalInterest)} 
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
                          label="Total Payment" 
                          value={formatCurrency(results.totalPayment)} 
                        />
                        <MetricCard 
                          label="Total Interest" 
                          value={formatCurrency(results.totalInterest)} 
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
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Loan Progress</h3>
                  <LoanChart schedule={results.schedule} />
                </div>

                {/* Amortization Schedule */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Amortization Schedule</h3>
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
    <div className="bg-slate-50 rounded-lg p-4">
      <p className="text-sm text-slate-600 mb-1">{label}</p>
      <p className="text-xl font-bold text-slate-800">{value}</p>
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
      <ComposedChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="year" 
          label={{ value: 'Years', position: 'insideBottom', offset: -5 }} 
        />
        <YAxis label={{ value: 'Amount (€)', angle: -90, position: 'insideLeft' }} />
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
    <div className="overflow-auto max-h-96 border border-slate-200 rounded-lg">
      <table className="w-full text-sm">
        <thead className="bg-slate-100 sticky top-0">
          <tr>
            <th className="text-left px-4 py-3 font-semibold text-slate-700">Month</th>
            <th className="text-right px-4 py-3 font-semibold text-slate-700">Interest</th>
            <th className="text-right px-4 py-3 font-semibold text-slate-700">Principal</th>
            <th className="text-right px-4 py-3 font-semibold text-slate-700">Remaining Debt</th>
          </tr>
        </thead>
        <tbody>
          {schedule.map((row, index) => (
            <tr 
              key={index}
              className={`border-t border-slate-200 ${
                row.extraPayment > 0 ? 'bg-blue-50 font-medium' : 'hover:bg-slate-50'
              }`}
            >
              <td className="px-4 py-2">
                {format(row.date, 'MMM yyyy')}
                {row.extraPayment > 0 && (
                  <span className="ml-2 text-xs text-blue-600">
                    (+{formatCurrency(row.extraPayment)} extra)
                  </span>
                )}
              </td>
              <td className="px-4 py-2 text-right">{formatCurrency(row.interest)}</td>
              <td className="px-4 py-2 text-right">{formatCurrency(row.principal)}</td>
              <td className="px-4 py-2 text-right">{formatCurrency(row.remainingDebt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App
