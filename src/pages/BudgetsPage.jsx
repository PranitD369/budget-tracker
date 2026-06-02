import { useFamily } from '../contexts/FamilyContext'
import { useMonthlyStats } from '../hooks/useMonthlyStats'
import { useBudgetProgress } from '../hooks/useBudgetProgress'
import { BudgetCard } from '../components/budget/BudgetCard'
import { BudgetSetter } from '../components/budget/BudgetSetter'

export function BudgetsPage() {
  const { members, budgets, monthlyExpenses, currentMonth } = useFamily()
  const { byMember } = useMonthlyStats(monthlyExpenses)
  const progress = useBudgetProgress(members, budgets, byMember)

  return (
    <>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Budgets</h1>
      <p className="text-sm text-gray-500 mb-6">Set monthly spending limits for each family member · {currentMonth}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {progress.map(({ member, spent, limit, percentage }) => (
          <div key={member.uid} className="flex flex-col gap-0">
            <BudgetCard member={member} spent={spent} limit={limit} percentage={percentage ?? 0} />
            <div className="bg-white rounded-b-2xl border border-t-0 border-gray-100 px-4 pb-4 -mt-2 pt-2 shadow-sm">
              <BudgetSetter member={member} currentLimit={limit} />
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
