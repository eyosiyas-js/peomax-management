import Head from 'next/head'
import { CacheProvider } from '@emotion/react'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { CssBaseline } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import { AuthConsumer, AuthProvider } from 'src/contexts/auth-context'
import { useNProgress } from 'src/hooks/use-nprogress'
import { createTheme } from 'src/theme'
import { createEmotionCache } from 'src/utils/create-emotion-cache'
import 'simplebar-react/dist/simplebar.min.css'
import { Provider, useDispatch, useSelector } from 'react-redux'
import { store } from 'src/redux/store'
import { createContext, useEffect, useState } from 'react'
import {
  SnackbarProvider,
  useSnackbar as useNotistackSnackbar,
  useSnackbar,
} from 'notistack'
import {
  addNotification,
  addNotificationCollection,
  addRestaurants,
  editRestaurant,
  selectNotification,
  selectRestaurant,
} from 'src/redux/features/userSlice'
import Axiosinstance from 'src/utils/axios'
import { useAuth } from 'src/hooks/use-auth'
import { io } from 'socket.io-client'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import { useRouter } from 'next/router'
import CheckCompany from 'src/guards/CheckCompany'

const clientSideEmotionCache = createEmotionCache()

const SplashScreen = () => null
const SnackbarContext = createContext()

export const SnackbarProviderWrapper = ({ children }) => {
  const snackbar = useNotistackSnackbar()
  return (
    <SnackbarContext.Provider value={snackbar}>
      <SnackbarProvider maxSnack={3}>{children}</SnackbarProvider>
    </SnackbarContext.Provider>
  )
}

function NotificationListener() {
  const router = useRouter()

  const { enqueueSnackbar } = useSnackbar()
  const message = useSelector(selectNotification)
  const auth = useAuth()
  const localRestaurants = useSelector(selectRestaurant)

  const [data, setData] = useState([])
  const dispatch = useDispatch()
  const socket = io('https://api.peomax.com')
  const handleNotificationClick = (message) => {
    console.log({ INFO: message })
    const parts = message.split('-')
    if (parts.length >= 4) {
      const category = parts[parts.length - 1].trim()
      const ID = parts[1].trim()
      const reservationID = parts[2].trim()
      console.log(reservationID) // This will print "category"
      dispatch(
        editRestaurant({
          id: ID,
          category: category,
          reservationID,
          notification: true,
        }),
      )
      router.push(`/services/view`)
    } else {
      console.log('Category not found')
    }
  }
  const extractReservationMessage = (message) => {
    const parts = message.split('-')
    if (parts.length >= 2) {
      return parts[0].trim() // Get the first part and trim any extra spaces
    }
    return message // Return the original message if format is not as expected
  }

  useEffect(() => {
    if (auth.user && auth.user.category !== 'employee') {
      if (!localRestaurants) {
        Axiosinstance.get('/api/sub-hotels?page=1&count=150')
          .then((res) => {
            const extractedIDs = res.data.items.map((item) => item.ID)
            dispatch(addRestaurants(res.data.items))
            setData(extractedIDs)
          })
          .catch((error) => {
            // Handle error
          })
      } else {
        setData(localRestaurants)
      }
    }

    if (message) {
      const variant = 'success' // Set the desired variant here
      const icon = variant === 'success' ? <CheckCircleOutlineIcon /> : <></>
      const displayedMessage = extractReservationMessage(message)

      enqueueSnackbar(displayedMessage, {
        variant: variant, // Use the variant here
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
        content: (key, displayedMessage) => (
          <div
            onClick={() => handleNotificationClick(message)}
            // Add the click handler
            style={{
              cursor: 'pointer',
              height: '50px',
              display: 'flex',
              alignItems: 'center',
              width: '300px',
              justifyContent: 'space-evenly',
              color: 'white',

              borderRadius: '5px',
              backgroundColor: variant === 'success' ? '#9DED33' : 'red', // Customize background color based on variant
            }}
          >
            {icon}
            {displayedMessage}
          </div>
        ),
      })
    }
  }, [message, auth.user])
  useEffect(() => {
    if (auth.user && auth.user.category !== 'employee') {
      data.forEach((id) => {
        socket.on(`reserve:${id}`, (updatedData) => {
          // Handle the updated data received from the server for each ID
          dispatch(
            addNotification(
              `New Reservation Made - ${updatedData.ID} - ${updatedData.reservationID} - ${updatedData.category}`,
            ),
          )
          dispatch(
            addNotificationCollection({
              id: updatedData.ID,
              category: updatedData.category,
              reservationID: updatedData.reservationID,
              notification: true,
              service: updatedData.name,
              name: `${updatedData.firstName} ${updatedData.lastName}`,
              createdAt: updatedData.createdAt,
            }),
          )
          console.log(`Received updated data for:`, updatedData)
        })
      })
    } else if (auth.user && auth.user.category === 'employee') {
      socket.on(`reserve:${auth.user.ID}`, (updatedData) => {
        // Handle the updated data received from the server for each ID
        dispatch(
          addNotification(
            `New Reservation Made - ${updatedData.ID} - ${updatedData.reservationID} - ${updatedData.category}`,
          ),
        )
        console.log(`Received updated data for ${id}:`, updatedData)
      })
    }
  }, [data])

  return null
}
const App = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props

  useNProgress()

  const getLayout = Component.getLayout ?? ((page) => page)

  const theme = createTheme()
  const [isInIframe, setIsInIframe] = useState(false)

  useEffect(() => {
    if (window !== window.top) {
      setIsInIframe(true)
    }
  }, [])

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Peomax</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <SnackbarProviderWrapper>
          <Provider store={store}>
            <AuthProvider>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <NotificationListener />
                <CheckCompany>
                  <AuthConsumer>
                    {(auth) =>
                      auth.isLoading ? (
                        <SplashScreen />
                      ) : // Conditional rendering based on isInIframe
                      isInIframe ? (
                        <div>
                          <p>
                            Access Denied: This site cannot be loaded in an
                            iframe.
                          </p>
                        </div>
                      ) : (
                        getLayout(<Component {...pageProps} />)
                      )
                    }
                  </AuthConsumer>
                </CheckCompany>
              </ThemeProvider>
            </AuthProvider>
          </Provider>
        </SnackbarProviderWrapper>
      </LocalizationProvider>
    </CacheProvider>
  )
}

export default App
