import { useMemo } from 'react'

export function useMonthlyStats(expenses) {
  return useMemo(() => {
    const totalSpent = expenses.reduce((s, e) => s + e.amount, 0)

    const byMember = {}
    const byCategory = {}

    for (const e of expenses) {
      byMember[e.uid] = byMember[e.uid] || { uid: e.uid, displayName: e.displayName, photoURL: e.photoURL, total: 0 }
      byMember[e.uid].total += e.amount

      byCategory[e.category] = byCategory[e.category] || { name: e.category, total: 0 }
      byCategory[e.category].total += e.amount
    }

    return {
      totalSpent,
      byMember: Object.values(byMember).sort((a, b) => b.total - a.total),
      byCategory: Object.values(byCategory).sort((a, b) => b.total - a.total),
      count: expenses.length,
      topCategory: Object.values(byCategory).sort((a, b) => b.total - a.total)[0]?.name ?? '—',
    }
  }, [expenses])
}
