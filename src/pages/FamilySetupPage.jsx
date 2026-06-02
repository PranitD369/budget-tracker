import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFamily } from '../contexts/FamilyContext'

export function FamilySetupPage() {
  const { createFamily, joinFamily } = useFamily()
  const navigate = useNavigate()
  const [tab, setTab] = useState('create')
  const [familyName, setFamilyName] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleCreate(e) {
    e.preventDefault()
    if (!familyName.trim()) { setError('Enter a family name'); return }
    setLoading(true)
    try {
      await createFamily(familyName.trim())
      navigate('/dashboard')
    } catch {
      setError('Failed to create family. Try again.')
    } finally { setLoading(false) }
  }

  async function handleJoin(e) {
    e.preventDefault()
    if (!inviteCode.trim()) { setError('Enter an invite code'); return }
    setLoading(true)
    try {
      await joinFamily(inviteCode.trim())
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Failed to join. Check the code and try again.')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">👨‍👩‍👧‍👦</div>
          <h1 className="text-xl font-bold text-gray-900">Set up your family</h1>
          <p className="text-gray-500 text-sm">Create a new family group or join an existing one</p>
        </div>

        <div className="flex rounded-xl bg-gray-100 p-1 mb-6">
          <button
            onClick={() => { setTab('create'); setError('') }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'create' ? 'bg-white shadow text-indigo-700' : 'text-gray-600'}`}
          >
            Create Family
          </button>
          <button
            onClick={() => { setTab('join'); setError('') }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'join' ? 'bg-white shadow text-indigo-700' : 'text-gray-600'}`}
          >
            Join Family
          </button>
        </div>

        {tab === 'create' ? (
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Family name</label>
              <input
                type="text"
                value={familyName}
                onChange={e => setFamilyName(e.target.value)}
                placeholder="e.g. The Smiths"
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white rounded-xl py-2.5 font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Creating…' : 'Create Family'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleJoin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Invite code</label>
              <input
                type="text"
                value={inviteCode}
                onChange={e => setInviteCode(e.target.value.toUpperCase())}
                placeholder="e.g. AB12CD"
                maxLength={6}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-center tracking-widest text-lg font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white rounded-xl py-2.5 font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Joining…' : 'Join Family'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
