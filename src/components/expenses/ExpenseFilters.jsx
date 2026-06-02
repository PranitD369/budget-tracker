import { useFamily } from '../../contexts/FamilyContext'

export function ExpenseFilters({ filters, onChange }) {
  const { members, categories } = useFamily()

  const selectClass = "border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"

  return (
    <div className="flex flex-wrap gap-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 mb-4">
      <select value={filters.memberId} onChange={e => onChange({ ...filters, memberId: e.target.value })} className={selectClass}>
        <option value="">All members</option>
        {members.map(m => <option key={m.uid} value={m.uid}>{m.displayName}</option>)}
      </select>
      <select value={filters.category} onChange={e => onChange({ ...filters, category: e.target.value })} className={selectClass}>
        <option value="">All categories</option>
        {categories.map(c => <option key={c.name} value={c.name}>{c.icon} {c.name}</option>)}
      </select>
      <input
        type="date"
        value={filters.dateFrom}
        onChange={e => onChange({ ...filters, dateFrom: e.target.value })}
        className={selectClass}
      />
      <input
        type="date"
        value={filters.dateTo}
        onChange={e => onChange({ ...filters, dateTo: e.target.value })}
        className={selectClass}
      />
      <button
        onClick={() => onChange({ memberId: '', category: '', dateFrom: '', dateTo: '' })}
        className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
      >
        Clear
      </button>
    </div>
  )
}
