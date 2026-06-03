import { useState } from 'react'
import { format } from 'date-fns'
import { useFamily } from '../contexts/FamilyContext'
import { useAuth } from '../contexts/AuthContext'
import { useFilteredExpenses } from '../hooks/useFilteredExpenses'
import { ExpenseFilters } from '../components/expenses/ExpenseFilters'
import { ExpenseList } from '../components/expenses/ExpenseList'

const EMPTY_FILTERS = { memberId: '', category: '', dateFrom: '', dateTo: '' }

function Chip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
        active
          ? 'bg-indigo-600 text-white border-indigo-600'
          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
      }`}
    >
      {children}
    </button>
  )
}

export function ExpenseHistoryPage() {
  const { monthlyExpenses, members, formatMoney } = useFamily()
  const { currentUser } = useAuth()
  const [filters, setFilters] = useState(EMPTY_FILTERS)
  const filtered = useFilteredExpenses(monthlyExpenses, filters)

  const total = filtered.reduce((sum, e) => sum + (e.amount || 0), 0)

  const todayStr = format(new Date(), 'yyyy-MM-dd')
  const isToday = filters.dateFrom === todayStr && filters.dateTo === todayStr
  const isThisMonth = !filters.dateFrom && !filters.dateTo

  const setThisMonth = () => setFilters(f => ({ ...f, dateFrom: '', dateTo: '' }))
  const setToday = () => setFilters(f => ({ ...f, dateFrom: todayStr, dateTo: todayStr }))
  const toggleMember = (uid) => setFilters(f => ({ ...f, memberId: f.memberId === uid ? '' : uid }))

  return (
    <>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Expense History</h1>

      {/* Quick filters — horizontally scrollable on mobile */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-3 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
        <Chip active={isThisMonth} onClick={setThisMonth}>This Month</Chip>
        <Chip active={isToday} onClick={setToday}>Today</Chip>
        <span className="shrink-0 w-px bg-gray-200 dark:bg-gray-700 mx-1" />
        {members.map(m => (
          <Chip key={m.uid} active={filters.memberId === m.uid} onClick={() => toggleMember(m.uid)}>
            {m.uid === currentUser?.uid ? 'Me' : (m.displayName?.split(' ')[0] ?? 'Member')}
          </Chip>
        ))}
      </div>

      {/* Advanced filters (category + custom date range) */}
      <ExpenseFilters filters={filters} onChange={setFilters} />

      {/* Filtered total */}
      <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 px-4 py-3 mb-4">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {filtered.length} expense{filtered.length !== 1 ? 's' : ''}
        </span>
        <div className="text-right">
          <p className="text-xs text-gray-400 dark:text-gray-500">Total</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{formatMoney(total)}</p>
        </div>
      </div>

      <ExpenseList expenses={filtered} />
    </>
  )
}
