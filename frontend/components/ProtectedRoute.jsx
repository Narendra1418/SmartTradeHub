import { useEffect } from 'react'
import { getToken } from '../lib/auth'
import { useRouter } from 'next/router'

export default function ProtectedRoute({ children }) {
  const router = useRouter()

  useEffect(() => {
    if (!getToken()) router.push('/auth/login')
  }, [])

  return children
}
