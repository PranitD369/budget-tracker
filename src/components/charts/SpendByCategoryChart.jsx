import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { EmptyState } from '../ui/EmptyState'
import { useFamily } from '../../contexts/FamilyContext'

export function SpendByCategoryChart({ byCategory }) {
  const { categories, formatMoney } = useFamily()

  if (byCategory.length === 0) {
    return <EmptyState icon="🥧" title="No data yet" description="Expenses will appear here" />
  }

  const data = byCategory.map(b => {
    const cat = categories.find(c => c.name === b.name)
    return { name: b.name, value: parseFloat(b.total.toFixed(2)), color: cat?.color ?? '#6b7280' }
  })

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value">
          {data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
        </Pie>
        <Tooltip formatter={v => formatMoney(v)} />
        <Legend iconSize={10} wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  )
}
