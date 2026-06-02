import { useMemo } from 'react'

export function useBudgetProgress(members, budgets, byMember) {
  return useMemo(() => {
    return members.map(member => {
      const budget = budgets.find(b => b.uid === member.uid)
      const spent = byMember.find(b => b.uid === member.uid)?.total ?? 0
      const limit = budget?.limit ?? null
      const percentage = limit ? Math.min((spent / limit) * 100, 100) : null
      return { member, spent, limit, percentage }
    })
  }, [members, budgets, byMember])
}
