import ProtectedRoute from '../components/ProtectedRoute'
import Portfolio from './portfolio'

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <Portfolio />
    </ProtectedRoute>
  )
}
