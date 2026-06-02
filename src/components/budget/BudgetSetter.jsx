import { useState } from 'react'
import { useFamily } from '../../contexts/FamilyContext'

export function BudgetSetter({ member, currentLimit }) {
  const { setBudget } = useFamily()
  const [value, setValue] = useState(currentLimit ?? '')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!value || parseFloat(value) <= 0) return
    setSaving(true)
    await setBudget(member.uid, value)
    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-3">
      <input
        type="number"
        min="0.01"
        step="0.01"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Set limit…"
        className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <button
        type="submit"
        disabled={saving}
        className="bg-indigo-600 text-white rounded-lg px-3 py-1.5 text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
      >
        {saving ? '…' : 'Set'}
      </button>
    </form>
  )
}
