import { format } from 'date-fns'
import { CategoryBadge } from '../ui/CategoryBadge'
import { useFamily } from '../../contexts/FamilyContext'
import { useAuth } from '../../contexts/AuthContext'

export function ExpenseRow({ expense, onDelete }) {
  const { categories } = useFamily()
  const { currentUser } = useAuth()
  const date = expense.date?.toDate?.() ?? new Date()

  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
      {expense.photoURL
        ? <img src={expense.photoURL} alt="" className="w-8 h-8 rounded-full shrink-0" />
        : <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-sm font-bold text-indigo-600 dark:text-indigo-400 shrink-0">
            {expense.displayName?.[0] ?? '?'}
          </div>
      }
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{expense.displayName}</span>
          <CategoryBadge name={expense.category} categories={categories} />
        </div>
        {expense.note && <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{expense.note}</p>}
        <p className="text-xs text-gray-400 dark:text-gray-500">{format(date, 'MMM d, h:mm a')}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className="font-semibold text-gray-900 dark:text-white">${expense.amount.toFixed(2)}</span>
        {currentUser?.uid === expense.uid && (
          <button
            onClick={() => onDelete(expense.id)}
            className="text-gray-300 dark:text-gray-600 hover:text-red-400 text-sm"
            title="Delete"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}
