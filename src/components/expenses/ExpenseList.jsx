import { ExpenseRow } from './ExpenseRow'
import { EmptyState } from '../ui/EmptyState'
import { useFamily } from '../../contexts/FamilyContext'

export function ExpenseList({ expenses }) {
  const { deleteExpense } = useFamily()

  if (expenses.length === 0) {
    return <EmptyState icon="📭" title="No expenses yet" description="Log your first expense using the + button" />
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 px-4">
      {expenses.map(e => (
        <ExpenseRow key={e.id} expense={e} onDelete={deleteExpense} />
      ))}
    </div>
  )
}
