import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { FamilyProvider } from './contexts/FamilyContext'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { FamilyRoute } from './components/auth/FamilyRoute'
import { LoginPage } from './pages/LoginPage'
import { FamilySetupPage } from './pages/FamilySetupPage'
import { DashboardPage } from './pages/DashboardPage'
import { ExpenseHistoryPage } from './pages/ExpenseHistoryPage'
import { BudgetsPage } from './pages/BudgetsPage'
import { SettingsPage } from './pages/SettingsPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <FamilyProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/setup" element={<FamilySetupPage />} />
              <Route element={<FamilyRoute />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/expenses" element={<ExpenseHistoryPage />} />
                <Route path="/budgets" element={<BudgetsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </FamilyProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
