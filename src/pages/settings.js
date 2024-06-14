import Head from 'next/head'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Snackbar,
  Stack,
  Typography,
} from '@mui/material'
import { SettingsPassword } from 'src/sections/settings/settings-password'
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout'
import { useAuth } from 'src/hooks/use-auth'
import { useState } from 'react'
import Axiosinstance from 'src/utils/axios'

const Page = () => {
  const [open, setOpen] = useState({
    state: false,
    message: '',
  })
  const [success, setSucess] = useState({
    state: false,
    message: '',
  })
  const [loading, setLoading] = useState(false)

  const { user } = useAuth()
  console.log(user)

  const getLocation = () => {
    setLoading(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          Axiosinstance.post('api/geolocation', {
            ID: user.ID,
            category: user.category,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
            .then((res) => {
              setLoading(false)
              console.log(res.data)
              setSucess({
                state: true,
                message: 'Geo Location Added',
              })
            })
            .catch((err) => {
              setLoading(false)

              setOpen({
                status: true,
                message: err.response.data.error,
              })
            })
          console.log(position.coords.latitude)
          console.log(position.coords.longitude)
        },
        (error) => {
          setLoading(false)
          setOpen({
            status: true,
            message: error.message,
          })

          console.error('Error getting user location:', error.message)
        },
      )
    } else {
      setLoading(false)
      setOpen({
        status: true,
        message: 'Geolocation is not supported by this browser.',
      })

      console.error('Geolocation is not supported by this browser.')
    }
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setOpen({
      state: false,
      message: '',
    })
  }
  const handleCloseSucess = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setSucess({
      state: false,
      message: '',
    })
  }
  return (
    <>
      <Head>
        <title>Settings | Peomax</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={3}>
            <Typography variant="h4">Settings</Typography>
            <SettingsPassword />
          </Stack>
          <Stack spacing={3} mt={3}>
            <Typography variant="h4">Add Geographical Location</Typography>
            <Alert severity="warning" variant="filled">
              Admins, update geolocation only from your {user.category}s
              physical location for accurate data.
            </Alert>
            <Button onClick={getLocation}>
              {loading ? (
                <CircularProgress color="error" />
              ) : (
                'Add My Current Location'
              )}{' '}
            </Button>
          </Stack>
        </Container>
      </Box>
      <Snackbar open={open.state} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          variant="filled"
          severity="error"
          sx={{ width: '100%' }}
        >
          {open.message}
        </Alert>
      </Snackbar>

      <Snackbar
        open={success.state}
        autoHideDuration={6000}
        onClose={handleCloseSucess}
      >
        <Alert
          onClose={handleCloseSucess}
          variant="filled"
          severity="success"
          sx={{ width: '100%' }}
        >
          {success.message}
        </Alert>
      </Snackbar>
    </>
  )
}
Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>

export default Page
