// components/ProtectedRoute.js
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useAuth } from 'src/hooks/use-auth'

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth()
  const router = useRouter()
  const [authorized, setAuthorized] = useState()

  useEffect(() => {
    if (user && user.role === 'employee') {
      router.push('/services')
    } else {
      setAuthorized(true)
    }
  }, [user, router])

  return authorized ? children : null
}

export default ProtectedRoute
