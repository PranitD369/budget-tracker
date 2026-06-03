import { useMemo } from 'react'

export function useFilteredExpenses(expenses, filters) {
  return useMemo(() => {
    let result = [...expenses]
    if (filters.memberId) result = result.filter(e => e.uid === filters.memberId)
    if (filters.category) result = result.filter(e => e.category === filters.category)
    // Parse the yyyy-MM-dd inputs as *local* day boundaries so "Today" and
    // custom ranges match the user's clock, not UTC.
    if (filters.dateFrom) {
      const from = new Date(`${filters.dateFrom}T00:00:00`)
      result = result.filter(e => e.date?.toDate() >= from)
    }
    if (filters.dateTo) {
      const to = new Date(`${filters.dateTo}T23:59:59`)
      result = result.filter(e => e.date?.toDate() <= to)
    }
    return result
  }, [expenses, filters])
}
