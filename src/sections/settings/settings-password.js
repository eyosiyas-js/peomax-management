import { useCallback, useState } from 'react'
import {
  Alert,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Snackbar,
  Stack,
  TextField,
} from '@mui/material'
import Axiosinstance from 'src/utils/axios'

export const SettingsPassword = () => {
  const [password, setPassword] = useState()
  const [confirmPassword, setConfirmPassword] = useState()

  const [open, setOpen] = useState({
    state: false,
    message: '',
  })

  const [openError, setOpenError] = useState({
    state: false,
    message: '',
  })

  const [loading, setLoading] = useState(false)

  const handleCloseError = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setOpenError({
      state: false,
      message: '',
    })
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

  const handleSubmit = (event) => {
    event.preventDefault()
    setLoading(true)
    Axiosinstance.put('/api/manager/change-password', {
      password: password,
      confirmPassword: confirmPassword,
    })
      .then((res) => {
        console.log(res.data)
        setOpen({
          state: true,
          message: res.data.message,
        })
        setLoading(false)
      })
      .catch((err) => {
        setOpenError({
          state: true,
          message: err.response.data.error,
        })
        setLoading(false)
      })
  }
  return (
    <form>
      <Card>
        <CardHeader subheader="Update password" title="Password" />
        <Divider />
        <CardContent>
          <Stack spacing={3} sx={{ maxWidth: 400 }}>
            <TextField
              fullWidth
              label="Password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              value={password}
            />
            <TextField
              fullWidth
              label="Password (Confirm)"
              name="confirm"
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              value={confirmPassword}
            />
          </Stack>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button
            disabled={!confirmPassword}
            onClick={handleSubmit}
            variant="contained"
          >
            {loading ? 'Loading...' : 'Update'}
          </Button>
        </CardActions>
      </Card>
      <Snackbar open={open.state} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          variant="filled"
          severity="success"
          sx={{ width: '100%' }}
        >
          {open.message}
        </Alert>
      </Snackbar>
      <Snackbar
        open={openError.state}
        autoHideDuration={3000}
        onClose={handleCloseError}
      >
        <Alert
          onClose={handleCloseError}
          variant="filled"
          severity="error"
          sx={{ width: '100%' }}
        >
          {openError.message}
        </Alert>
      </Snackbar>
    </form>
  )
}
