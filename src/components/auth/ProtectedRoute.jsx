import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Spinner } from '../ui/Spinner'

export function ProtectedRoute() {
  const { currentUser, loading } = useAuth()
  if (loading) return <div className="flex justify-center items-center h-screen"><Spinner size="lg" /></div>
  if (!currentUser) return <Navigate to="/login" replace />
  return <Outlet />
}
