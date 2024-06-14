// components/ProtectedRoute.js
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useAuth } from 'src/hooks/use-auth'

const CheckCompany = ({ children }) => {
  const { user } = useAuth()
  const router = useRouter()
  const [isCompany, setIsCompany] = useState(false)

  const isPath = router.pathname === '/company' ? true : false

  useEffect(() => {
    if (user && !user.ID && !user.category && !isPath) {
      // If user is an employee, redirect to the services page
      router.push('/company')
    } else {
      // If the user is authenticated and not an employee, set authorization to true
      setIsCompany(true)
    }
  }, [user, router])

  // If the user is authenticated and authorized, render the children components
  return isCompany ? children : null
}

export default CheckCompany
