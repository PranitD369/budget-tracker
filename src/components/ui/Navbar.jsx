import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/expenses', label: 'History' },
  { to: '/budgets', label: 'Budgets' },
  { to: '/settings', label: 'Settings' },
]

export function Navbar() {
  const { currentUser, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
        <span className="font-bold text-indigo-600 text-lg">💰 BudgetTracker</span>
        <div className="hidden sm:flex gap-1">
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {currentUser?.photoURL && (
            <img src={currentUser.photoURL} alt="" className="w-8 h-8 rounded-full" />
          )}
          <button
            onClick={handleSignOut}
            className="text-sm text-gray-500 hover:text-gray-800"
          >
            Sign out
          </button>
        </div>
      </div>
      <div className="flex sm:hidden border-t border-gray-100">
        {links.map(l => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) =>
              `flex-1 text-center py-2 text-xs font-medium transition-colors ${
                isActive ? 'text-indigo-700 border-t-2 border-indigo-600' : 'text-gray-500'
              }`
            }
          >
            {l.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
