import { useState } from 'react'
import { useFamily } from '../contexts/FamilyContext'

const COLORS = ['#f59e0b', '#3b82f6', '#8b5cf6', '#10b981', '#ec4899', '#f97316', '#6366f1', '#6b7280', '#14b8a6', '#ef4444']

export function SettingsPage() {
  const { familyDoc, members, categories, addCategory } = useFamily()
  const [copied, setCopied] = useState(false)
  const [newCat, setNewCat] = useState({ name: '', icon: '🏷️', color: COLORS[0] })
  const [saving, setSaving] = useState(false)

  function copyCode() {
    navigator.clipboard.writeText(familyDoc?.inviteCode ?? '')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleAddCategory(e) {
    e.preventDefault()
    if (!newCat.name.trim()) return
    setSaving(true)
    await addCategory({ name: newCat.name.trim(), icon: newCat.icon, color: newCat.color })
    setNewCat({ name: '', icon: '🏷️', color: COLORS[0] })
    setSaving(false)
  }

  return (
    <div className="max-w-2xl space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-800 mb-4">Family</h2>
        <p className="text-sm text-gray-600 mb-1">Name: <span className="font-medium text-gray-900">{familyDoc?.name}</span></p>
        <div className="flex items-center gap-3 mt-3">
          <div className="bg-gray-100 rounded-lg px-4 py-2 font-mono text-lg tracking-widest font-bold text-gray-800">
            {familyDoc?.inviteCode}
          </div>
          <button
            onClick={copyCode}
            className="text-sm bg-indigo-50 text-indigo-700 rounded-lg px-3 py-2 hover:bg-indigo-100 transition-colors"
          >
            {copied ? 'Copied!' : 'Copy invite code'}
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2">Share this code so family members can join</p>
      </section>

      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-800 mb-4">Members ({members.length})</h2>
        <div className="space-y-2">
          {members.map(m => (
            <div key={m.uid} className="flex items-center gap-3">
              {m.photoURL
                ? <img src={m.photoURL} alt="" className="w-8 h-8 rounded-full" />
                : <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-600">{m.displayName?.[0]}</div>
              }
              <span className="text-sm text-gray-800">{m.displayName}</span>
              <span className="ml-auto text-xs text-gray-400 capitalize">{m.role}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-800 mb-4">Categories</h2>
        <div className="flex flex-wrap gap-2 mb-5">
          {categories.map(c => (
            <span key={c.name} className="flex items-center gap-1 px-3 py-1 rounded-full text-white text-xs font-medium" style={{ backgroundColor: c.color }}>
              {c.icon} {c.name}
            </span>
          ))}
        </div>
        <form onSubmit={handleAddCategory} className="flex flex-wrap gap-2 items-end">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Icon</label>
            <input
              type="text"
              value={newCat.icon}
              onChange={e => setNewCat(p => ({ ...p, icon: e.target.value }))}
              className="w-14 border border-gray-300 rounded-lg px-2 py-1.5 text-center text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex-1 min-w-32">
            <label className="block text-xs text-gray-500 mb-1">Name</label>
            <input
              type="text"
              value={newCat.name}
              onChange={e => setNewCat(p => ({ ...p, name: e.target.value }))}
              placeholder="e.g. Pets"
              className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Color</label>
            <div className="flex gap-1">
              {COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setNewCat(p => ({ ...p, color: c }))}
                  className={`w-6 h-6 rounded-full border-2 ${newCat.color === c ? 'border-gray-800' : 'border-transparent'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
          <button
            type="submit"
            disabled={saving || !newCat.name.trim()}
            className="bg-indigo-600 text-white rounded-lg px-4 py-1.5 text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
          >
            {saving ? '…' : 'Add'}
          </button>
        </form>
      </section>
    </div>
  )
}
