import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Navbar } from '../ui/Navbar'

export function FamilyRoute() {
  const { userProfile } = useAuth()
  if (!userProfile?.familyId) return <Navigate to="/setup" replace />
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
