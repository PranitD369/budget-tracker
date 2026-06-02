import { useMemo } from 'react'

export function useFilteredExpenses(expenses, filters) {
  return useMemo(() => {
    let result = [...expenses]
    if (filters.memberId) result = result.filter(e => e.uid === filters.memberId)
    if (filters.category) result = result.filter(e => e.category === filters.category)
    if (filters.dateFrom) result = result.filter(e => e.date?.toDate() >= new Date(filters.dateFrom))
    if (filters.dateTo) {
      const to = new Date(filters.dateTo)
      to.setHours(23, 59, 59)
      result = result.filter(e => e.date?.toDate() <= to)
    }
    return result
  }, [expenses, filters])
}
