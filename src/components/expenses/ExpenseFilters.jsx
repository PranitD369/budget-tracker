import { useFamily } from '../../contexts/FamilyContext'

export function ExpenseFilters({ filters, onChange }) {
  const { members, categories } = useFamily()

  const selectClass = "w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"

  return (
    <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:items-center gap-2 sm:gap-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 mb-4">
      <select value={filters.memberId} onChange={e => onChange({ ...filters, memberId: e.target.value })} className={`${selectClass} sm:w-auto`}>
        <option value="">All members</option>
        {members.map(m => <option key={m.uid} value={m.uid}>{m.displayName}</option>)}
      </select>
      <select value={filters.category} onChange={e => onChange({ ...filters, category: e.target.value })} className={`${selectClass} sm:w-auto`}>
        <option value="">All categories</option>
        {categories.map(c => <option key={c.name} value={c.name}>{c.icon} {c.name}</option>)}
      </select>
      <input
        type="date"
        value={filters.dateFrom}
        onChange={e => onChange({ ...filters, dateFrom: e.target.value })}
        className={`${selectClass} sm:w-auto`}
      />
      <input
        type="date"
        value={filters.dateTo}
        onChange={e => onChange({ ...filters, dateTo: e.target.value })}
        className={`${selectClass} sm:w-auto`}
      />
      <button
        onClick={() => onChange({ memberId: '', category: '', dateFrom: '', dateTo: '' })}
        className="col-span-2 sm:col-span-1 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline py-1"
      >
        Clear filters
      </button>
    </div>
  )
}
