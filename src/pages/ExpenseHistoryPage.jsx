import { useState } from 'react'
import { useFamily } from '../contexts/FamilyContext'
import { useFilteredExpenses } from '../hooks/useFilteredExpenses'
import { ExpenseFilters } from '../components/expenses/ExpenseFilters'
import { ExpenseList } from '../components/expenses/ExpenseList'

const EMPTY_FILTERS = { memberId: '', category: '', dateFrom: '', dateTo: '' }

export function ExpenseHistoryPage() {
  const { monthlyExpenses } = useFamily()
  const [filters, setFilters] = useState(EMPTY_FILTERS)
  const filtered = useFilteredExpenses(monthlyExpenses, filters)

  return (
    <>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Expense History</h1>
      <ExpenseFilters filters={filters} onChange={setFilters} />
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{filtered.length} expense{filtered.length !== 1 ? 's' : ''}</p>
      <ExpenseList expenses={filtered} />
    </>
  )
}
