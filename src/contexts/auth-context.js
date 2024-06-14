import { createContext, useContext, useEffect, useReducer, useRef } from 'react'
import PropTypes from 'prop-types'
import Axiosinstance from 'src/utils/axios'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { login, selectUser } from 'src/redux/features/userSlice'

const HANDLERS = {
  INITIALIZE: 'INITIALIZE',
  SIGN_IN: 'SIGN_IN',
  SIGN_OUT: 'SIGN_OUT',
}

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
}

const handlers = {
  [HANDLERS.INITIALIZE]: (state, action) => {
    const user = action.payload

    return {
      ...state,
      ...// if payload (user) is provided, then is authenticated
      (user
        ? {
            isAuthenticated: true,
            isLoading: false,
            user,
          }
        : {
            // isAuthenticated: false,

            isLoading: false,
          }),
    }
  },
  [HANDLERS.SIGN_IN]: (state, action) => {
    const user = action.payload

    return {
      ...state,
      isAuthenticated: true,
      user,
    }
  },
  [HANDLERS.SIGN_OUT]: (state) => {
    return {
      ...state,
      isAuthenticated: false,
      user: null,
    }
  },
}

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state

// The role of this context is to propagate authentication state through the App tree.

export const AuthContext = createContext({ undefined })

export const AuthProvider = (props) => {
  const router = useRouter()
  const reduxDispatch = useDispatch()
  const user = useSelector(selectUser)

  const { children } = props
  const [state, dispatch] = useReducer(reducer, initialState)
  const initialized = useRef(false)

  const initialize = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return
    }

    initialized.current = true

    let isAuthenticated = false
    let token = null

    try {
      token = localStorage.getItem('hotels_peomax_token')
      isAuthenticated = token !== null
    } catch (err) {
      console.error(err)
    }

    if (isAuthenticated) {
      try {
        Axiosinstance.defaults.headers.common['Authorization'] = token
        const response = await Axiosinstance('/api/account')
        console.log(response)
        const userData = response.data
        reduxDispatch(login(true))

        dispatch({
          type: HANDLERS.INITIALIZE,
          payload: userData,
        })
      } catch (error) {
        console.error(error)
        dispatch({
          type: HANDLERS.INITIALIZE,
        })
      }
    } else {
      dispatch({
        type: HANDLERS.INITIALIZE,
      })
    }
  }

  useEffect(() => {
    if (!user) initialize()
  }, [])

  // ...

  const signIn = async (email, password) => {
    console.log({
      email,
      password,
    })

    try {
      const response = await Axiosinstance.post('/api/manager/login', {
        email,
        password,
      })
      const { token, userData } = response.data
      // if (userData.role === 'manager') {

      // } else {
      //   router.push('/')
      // }
      console.log(response.data)
      Axiosinstance.defaults.headers.common['Authorization'] = token

      localStorage.setItem('hotels_peomax_token', token)

      const updatedUserData = {
        ...userData,
        category: response.data.category,

        ID: response.data.ID,
      }

      dispatch({
        type: HANDLERS.SIGN_IN,
        payload: updatedUserData,
      })
      return response.data
    } catch (err) {
      console.error(err)

      throw new Error(err.response.data.error)
    }
  }

  const signUp = async (email, name, password) => {
    throw new Error('Sign up is not implemented')
  }

  const signOut = () => {
    localStorage.removeItem('hotels_peomax_token')
    dispatch({
      type: HANDLERS.SIGN_OUT,
    })
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

AuthProvider.propTypes = {
  children: PropTypes.node,
}

export const AuthConsumer = AuthContext.Consumer

export const useAuthContext = () => useContext(AuthContext)
