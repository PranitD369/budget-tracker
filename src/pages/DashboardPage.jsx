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
  const { monthlyExpenses, members, budgets, currentMonth, setCurrentMonth, familyDoc, loading } = useFamily()
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
          <h1 className="text-2xl font-bold text-gray-900">{familyDoc?.name ?? 'Dashboard'}</h1>
          <div className="flex items-center gap-2 mt-1">
            <button onClick={() => changeMonth(-1)} className="text-gray-400 hover:text-gray-700 px-1">‹</button>
            <span className="text-sm font-medium text-gray-600">
              {format(parseISO(`${currentMonth}-01`), 'MMMM yyyy')}
            </span>
            <button onClick={() => changeMonth(1)} className="text-gray-400 hover:text-gray-700 px-1">›</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 col-span-1">
          <p className="text-xs text-gray-500 mb-1">Total Spent</p>
          <p className="text-2xl font-bold text-gray-900">${totalSpent.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 col-span-1">
          <p className="text-xs text-gray-500 mb-1">Transactions</p>
          <p className="text-2xl font-bold text-gray-900">{count}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 col-span-1">
          <p className="text-xs text-gray-500 mb-1">Top Category</p>
          <p className="text-lg font-bold text-gray-900 truncate">{topCategory}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Spend by Member</h2>
          <MonthlySpendByMemberChart byMember={byMember} />
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Spend by Category</h2>
          <SpendByCategoryChart byCategory={byCategory} />
        </div>
      </div>

      {budgetProgress.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Budget Progress</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {budgetProgress.map(({ member, spent, limit, percentage }) => (
              <BudgetCard key={member.uid} member={member} spent={spent} limit={limit} percentage={percentage} />
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Recent Expenses</h2>
        <ExpenseList expenses={monthlyExpenses.slice(0, 5)} />
      </div>

      <button
        onClick={() => setShowAdd(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg text-2xl flex items-center justify-center hover:bg-indigo-700 transition-colors z-30"
        title="Log expense"
      >
        +
      </button>

      <AddExpenseModal open={showAdd} onClose={() => setShowAdd(false)} />
    </>
  )
}
