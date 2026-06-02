import { BudgetProgressBar } from './BudgetProgressBar'
import { useFamily } from '../../contexts/FamilyContext'

export function BudgetCard({ member, spent, limit, percentage }) {
  const { formatMoney } = useFamily()
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
      <div className="flex items-center gap-3 mb-3">
        {member.photoURL
          ? <img src={member.photoURL} alt="" className="w-9 h-9 rounded-full" />
          : <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-400">
              {member.displayName?.[0] ?? '?'}
            </div>
        }
        <div>
          <p className="font-medium text-gray-900 dark:text-white text-sm">{member.displayName}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {formatMoney(spent)} {limit != null ? `/ ${formatMoney(limit)}` : '— no limit set'}
          </p>
        </div>
        {limit != null && (
          <span className={`ml-auto text-sm font-semibold ${percentage >= 90 ? 'text-red-500' : percentage >= 70 ? 'text-yellow-500' : 'text-emerald-600 dark:text-emerald-400'}`}>
            {Math.round(percentage)}%
          </span>
        )}
      </div>
      {limit != null && <BudgetProgressBar percentage={percentage} />}
    </div>
  )
}
