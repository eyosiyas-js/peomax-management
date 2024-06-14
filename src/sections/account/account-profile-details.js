import { useCallback, useEffect, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Unstable_Grid2 as Grid,
  Snackbar,
  Alert,
} from '@mui/material'
import Axiosinstance from 'src/utils/axios'

const userRoles = [
  {
    value: 'employee',
    label: 'Employee',
  },
  {
    value: 'supervisor',
    label: 'Supervisor',
  },
]

export default function AccountProfileDetails({ FetchedRestaurants }) {
  const [restaurants, setRestaurants] = useState([])
  const [selectRes, setSelectRes] = useState(false)
  const [open, setOpen] = useState({
    state: false,
    message: '',
  })
  const [success, setSucess] = useState({
    state: false,
    message: '',
  })

  const [values, setValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    ID: '',
    role: 'employee',
    category: '',
  })
  useEffect(() => {
    setRestaurants(FetchedRestaurants)
  }, [restaurants])
  useEffect(() => {
    // Example: Update another state based on the selected role
    console.log(values)
    if (values.role === 'employee') {
      setSelectRes(true)
      console.log(true)
    } else {
      setSelectRes(false)
    }
  }, [values])
  const handleChange = useCallback((event) => {
    setValues((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }))
  }, [])

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault()
      let allNotEmpty = true

      for (let key in values) {
        if (values.role === 'supervisor') {
          if (
            values.hasOwnProperty(key) &&
            values[key] === '' &&
            key !== 'ID' &&
            key !== 'category'
          ) {
            allNotEmpty = false
            break
          }
        } else {
          if (values.hasOwnProperty(key) && values[key] === '') {
            allNotEmpty = false
            break
          }
        }
      }
      if (allNotEmpty) {
        console.log(values)

        if (values.role === 'employee') {
          Axiosinstance.post('api/employee/register', {
            email: values.email,
            password: values.password,
            confirmPassword: values.confirmPassword,
            ID: values.ID,
            firstName: values.firstName,
            lastName: values.lastName,
            category: values.category,
          })
            .then((res) => {
              console.log(res.data)
              setSucess({
                state: true,
                message: 'Account created succesfully',
              })
            })
            .catch((err) => {
              console.log(err)
              setOpen({
                state: true,
                message: err.response.data.error,
              })
            })
        } else {
          Axiosinstance.post('api/supervisor/register', {
            email: values.email,
            password: values.password,
            confirmPassword: values.confirmPassword,
            firstName: values.firstName,
            lastName: values.lastName,
          })
            .then((res) => {
              console.log(res.data)
              setSucess({
                state: true,
                message: 'Account created succesfully',
              })
            })
            .catch((err) => {
              console.log(err)
              setOpen({
                state: true,
                message: err.response.data.error,
              })
            })
        }
      } else {
        setOpen({
          state: true,
          message: 'The Fields must not empty',
        })
      }
    },
    [values],
  )

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

  const handleSelectChange = (event) => {
    const selectedOption = restaurants.find(
      (option) => option.ID === event.target.value,
    )

    console.log(event.target.value)
    setValues((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
      category: selectedOption.category,
    }))
  }

  return (
    <form autoComplete="off" noValidate onSubmit={handleSubmit}>
      <Card>
        <CardHeader
          subheader="The information is used to create an account under this orginization"
          title="Add Account"
        />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid container spacing={3}>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  helperText="Please specify the first name"
                  label="First name"
                  name="firstName"
                  onChange={handleChange}
                  required
                  value={values.firstName}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Last name"
                  name="lastName"
                  onChange={handleChange}
                  required
                  value={values.lastName}
                />
              </Grid>
              <Grid xs={12} md={12}>
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  onChange={handleChange}
                  required
                  value={values.email}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  onChange={handleChange}
                  type="password"
                  value={values.password}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Confirm Password"
                  name="confirmPassword"
                  onChange={handleChange}
                  type="password"
                  value={values.confirmPassword}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Select role"
                  name="role"
                  onChange={handleChange}
                  required
                  select
                  SelectProps={{ native: true }}
                  value={values.role}
                >
                  {userRoles.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </TextField>
              </Grid>
              {selectRes && (
                <Grid xs={12} md={6}>
                  <TextField
                    fullWidth
                    name="ID"
                    onChange={handleSelectChange}
                    required
                    select
                    SelectProps={{ native: true }}
                    value={values.ID || ''} // Use values.ID instead of values.state
                  >
                    <option value="" disabled>
                      Select a service
                    </option>
                    {restaurants.map((option) => (
                      <option key={option.ID} value={option.ID}>
                        {option.name}
                      </option>
                    ))}
                  </TextField>
                </Grid>
              )}
            </Grid>
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button onClick={handleSubmit} variant="contained">
            Add User
          </Button>
        </CardActions>
      </Card>
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
    </form>
  )
}
