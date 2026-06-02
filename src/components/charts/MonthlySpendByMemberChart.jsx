import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { EmptyState } from '../ui/EmptyState'

export function MonthlySpendByMemberChart({ byMember }) {
  if (byMember.length === 0) {
    return <EmptyState icon="📊" title="No data yet" description="Expenses will appear here" />
  }

  const data = byMember.map(m => ({
    name: m.displayName?.split(' ')[0] ?? 'User',
    total: parseFloat(m.total.toFixed(2)),
  }))

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `$${v}`} />
        <Tooltip formatter={v => [`$${v.toFixed(2)}`, 'Spent']} />
        <Bar dataKey="total" fill="#6366f1" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
