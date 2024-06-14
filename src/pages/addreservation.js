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
  CircularProgress,
} from '@mui/material'
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout'
import { addRestaurants, selectRestaurant } from 'src/redux/features/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import Axiosinstance from 'src/utils/axios'
import {
  DesktopDatePicker,
  LocalizationProvider,
  TimePicker,
} from '@mui/x-date-pickers'
import moment from 'moment'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { format } from 'date-fns'

function Page() {
  const [openError, setOpenError] = useState({
    state: false,
    message: '',
  })
  const [success, setSucess] = useState({
    state: false,
    message: '',
  })
  const [restaurants, setRestaurants] = useState([])
  const localRestaurants = useSelector(selectRestaurant)
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const [values, setValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    ID: '',
    people: '',
    category: '',
    time: '',
    date: null,
  })

  useEffect(() => {
    if (!localRestaurants) {
      Axiosinstance.get(`api/sub-hotels?page=1&count=150`).then((res) => {
        console.log(res.data)
        setRestaurants(res.data.items)
        dispatch(addRestaurants(res.data.items))
      })
    } else {
      setRestaurants(localRestaurants)
    }
  }, [])

  const handleChange = useCallback((event) => {
    setValues((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }))
  }, [])

  const handleSubmit = useCallback((event) => {
    event.preventDefault()
  }, [])

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
  const handleTimeChange = (time, type) => {
    const formattedTime = time ? moment(time).format('hh:mm A') : ''
    setValues((prevValues) => ({
      ...prevValues,
      [type]: formattedTime,
    }))
  }
  const formatTime = (time) => {
    if (!time) return ''
    return moment(time, 'hh:mm A').format('hh:mm A')
  }
  const handleDateChange = (date) => {
    const formattedDate = format(date, 'MM/dd/yyyy')
    setValues((prevValues) => ({
      ...prevValues,
      date: formattedDate,
    }))
  }
  const shouldDisableDate = (date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Set today's time to midnight

    return date < today
  }
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setOpenError({
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
  const handleReserve = async () => {
    let allNotEmpty = true
    for (let key in values) {
      if (values.hasOwnProperty(key)) {
        if (values[key] === '' || values[key] === null) {
          allNotEmpty = false
          break
        }
      }
    }
    if (allNotEmpty) {
      await Axiosinstance.post('api/reserve/manual', values)
        .then((res) => {
          console.log(res.data)
          setSucess({
            state: true,
            message: 'Reserved Successfully!!',
          })
        })
        .catch((err) => {
          setOpenError({
            state: true,
            message: err.response.data.error,
          })
        })
    } else {
      setOpenError({
        state: true,
        message: 'The Fields must not be empty',
      })
    }
  }
  return (
    <form autoComplete="off" noValidate onSubmit={handleSubmit}>
      <Card>
        <CardHeader
          subheader="Enter all the required information"
          title="Manual Reservation"
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
              <Grid xs={12} md={6}>
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
                  label="Phone Number"
                  name="phoneNumber"
                  type="number"
                  onChange={handleChange}
                  value={values.phone}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="people"
                  name="people"
                  type="number"
                  onChange={handleChange}
                  required
                  value={values.country}
                />
              </Grid>
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
              <Grid xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DesktopDatePicker
                    inputFormat="MM/dd/yyyy"
                    label="Date"
                    value={values.date}
                    onChange={handleDateChange}
                    shouldDisableDate={shouldDisableDate}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid xs={12} md={6}>
                <TimePicker
                  label="Select Time"
                  value={
                    values.time ? moment(values.time, 'hh:mm A').toDate() : null
                  }
                  onChange={(time) => handleTimeChange(time, 'time')}
                  ampm={true}
                  format="HH:mm"
                  renderInput={(props) => (
                    <TextField
                      {...props}
                      helperText={formatTime(values.time)}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'center', mt: 2 }}>
          {loading ? (
            <CircularProgress />
          ) : (
            <Button onClick={handleReserve} variant="contained">
              Reserve
            </Button>
          )}
        </CardActions>
      </Card>
      <Snackbar
        open={openError.state}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          variant="filled"
          severity="error"
          sx={{ width: '100%' }}
        >
          {openError.message}
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

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>

export default Page
