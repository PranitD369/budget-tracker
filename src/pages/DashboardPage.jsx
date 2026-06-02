import { useState } from 'react'
import { format, addMonths, subMonths, parseISO } from 'date-fns'
import { useFamily } from '../contexts/FamilyContext'
import { useMonthlyStats } from '../hooks/useMonthlyStats'
import { useBudgetProgress } from '../hooks/useBudgetProgress'
import { AddExpenseModal } from '../components/expenses/AddExpenseModal'
import { ExpenseList } from '../components/expenses/ExpenseList'
import { MonthlySpendByMemberChart } from '../components/charts/MonthlySpendByMemberChart'
import { SpendByCategoryChart } from '../components/charts/SpendByCategoryChart'
import { BudgetCard } from '../components/budget/BudgetCard'
import { Spinner } from '../components/ui/Spinner'

export function DashboardPage() {
  const { monthlyExpenses, members, budgets, currentMonth, setCurrentMonth, familyDoc, loading, formatMoney } = useFamily()
  const { totalSpent, byMember, byCategory, count, topCategory } = useMonthlyStats(monthlyExpenses)
  const budgetProgress = useBudgetProgress(members, budgets, byMember)
  const [showAdd, setShowAdd] = useState(false)

  function changeMonth(delta) {
    const base = parseISO(`${currentMonth}-01`)
    const next = delta > 0 ? addMonths(base, 1) : subMonths(base, 1)
    setCurrentMonth(format(next, 'yyyy-MM'))
  }

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{familyDoc?.name ?? 'Dashboard'}</h1>
          <div className="flex items-center gap-1 mt-1">
            <button onClick={() => changeMonth(-1)} aria-label="Previous month" className="h-8 w-8 flex items-center justify-center rounded-lg text-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800">‹</button>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 min-w-32 text-center">
              {format(parseISO(`${currentMonth}-01`), 'MMMM yyyy')}
            </span>
            <button onClick={() => changeMonth(1)} aria-label="Next month" className="h-8 w-8 flex items-center justify-center rounded-lg text-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800">›</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
        {[
          { label: 'Total Spent', value: formatMoney(totalSpent), wrap: 'col-span-2 sm:col-span-1', size: 'text-2xl sm:text-3xl' },
          { label: 'Transactions', value: count, wrap: '', size: 'text-xl sm:text-2xl' },
          { label: 'Top Category', value: topCategory, wrap: '', size: 'text-base sm:text-2xl' },
        ].map(({ label, value, wrap, size }) => (
          <div key={label} className={`${wrap} bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4`}>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
            <p className={`${size} font-bold text-gray-900 dark:text-white truncate`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Spend by Member</h2>
          <MonthlySpendByMemberChart byMember={byMember} />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Spend by Category</h2>
          <SpendByCategoryChart byCategory={byCategory} />
        </div>
      </div>

      {budgetProgress.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Budget Progress</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {budgetProgress.map(({ member, spent, limit, percentage }) => (
              <BudgetCard key={member.uid} member={member} spent={spent} limit={limit} percentage={percentage} />
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Recent Expenses</h2>
        <ExpenseList expenses={monthlyExpenses.slice(0, 5)} />
      </div>

      <button
        onClick={() => setShowAdd(true)}
        style={{ bottom: 'calc(1.5rem + env(safe-area-inset-bottom))', right: 'calc(1.5rem + env(safe-area-inset-right))' }}
        className="fixed w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg text-3xl flex items-center justify-center hover:bg-indigo-700 active:scale-95 transition-all z-30"
        aria-label="Log expense"
      >
        +
      </button>

      <AddExpenseModal open={showAdd} onClose={() => setShowAdd(false)} />
    </>
  )
}
