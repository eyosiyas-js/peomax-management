import { forwardRef, useCallback, useEffect, useState } from 'react'
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
import { useDispatch, useSelector } from 'react-redux'
import {
  addCompanyInfo,
  addRestaurantDetails,
  selectCompanyInfo,
  selectEdit,
} from 'src/redux/features/userSlice'
import { TimePicker } from '@mui/x-date-pickers'
import moment from 'moment/moment'
import { useAuth } from 'src/hooks/use-auth'
import Axiosinstance from 'src/utils/axios'
import { useRouter } from 'next/router'
const userRoles = [
  {
    value: 'AM',
    label: 'AM',
  },
  {
    value: 'PM',
    label: 'PM',
  },
]

const Times = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
const Ratings = ['1', '2', '3', '4', '5']

// const Alert = forwardRef(function Alert(props, ref) {
//   return
// })

export const AccountProfileDetails2 = ({ clicked, done }) => {
  const [open, setOpen] = useState(false)

  const [selectRes, setSelectRes] = useState(false)
  const dispatch = useDispatch()
  const { user } = useAuth()
  const companyInfo = useSelector(selectCompanyInfo)

  const [values, setValues] = useState({
    name: '',
    location: '',
    totalSpots: '',
    description: '',
    openingTime: null,
    closingTime: null,
  })
  const router = useRouter()

  // Check if the current page matches the services/edit route
  const isServicesEditPage = window.location.pathname === '/services/edit'
  const isServicesEditPageMain = window.location.pathname === '/company/edit'

  console.log(isServicesEditPage)

  // Extract the dynamic values from the query object
  const editInfo = useSelector(selectEdit)

  useEffect(() => {
    if (user.ID && window.location.pathname === '/services/edit') {
      if (!companyInfo) {
        if (isServicesEditPage) {
          Axiosinstance.get(`/api/${editInfo.category}s/${editInfo.id}`).then(
            (res) => {
              console.log(res.data)
              setValues({
                name: res.data.name,
                location: res.data.location,
                totalSpots: res.data.totalSpots,
                openingTime: res.data.openingTime,
                closingTime: res.data.closingTime,
                description: res.data.description,
              })
              dispatch(addCompanyInfo(res.data))
              console.log('recived from api')
            },
          )
        } else {
          Axiosinstance.get(`/api/${user.category}s/${user.ID}`).then((res) => {
            console.log(res.data)
            setValues({
              name: res.data.name,
              location: res.data.location,
              totalSpots: res.data.totalSpots,
              openingTime: res.data.openingTime,
              closingTime: res.data.closingTime,
              description: res.data.description,
            })
            dispatch(addCompanyInfo(res.data))
            console.log('recived from api')
          })
        }
      } else {
        if (isServicesEditPage) {
          Axiosinstance.get(`/api/${editInfo.category}s/${editInfo.id}`).then(
            (res) => {
              console.log(res.data)
              setValues({
                name: res.data.name,
                location: res.data.location,
                totalSpots: res.data.totalSpots,
                openingTime: res.data.openingTime,
                closingTime: res.data.closingTime,
                description: res.data.description,
              })
              dispatch(addCompanyInfo(res.data))
              console.log('recived from api')
            },
          )
        }
        setValues({
          name: companyInfo.name,
          location: companyInfo.location,
          totalSpots: companyInfo.totalSpots,
          openingTime: companyInfo.openingTime,
          closingTime: companyInfo.closingTime,
          description: companyInfo.description,
        })
        console.log('recived from redux')
      }
    } else if (window.location.pathname === '/company/edit') {
      Axiosinstance.get(`/api/${user.category}s/${user.ID}`).then((res) => {
        console.log(res.data)
        setValues({
          name: res.data.name,
          location: res.data.location,
          totalSpots: res.data.totalSpots,
          openingTime: res.data.openingTime,
          closingTime: res.data.closingTime,
          description: res.data.description,
        })
        dispatch(addCompanyInfo(res.data))
      })
    }
  }, [])

  // useEffect(() => {
  //   console.log(clicked)
  //   const formData = new FormData()
  //   if (clicked == true) {
  //     for (let key in values) {
  //       formData.append(key, values[key])
  //       const serializedFormData = Object.fromEntries(formData)

  //       dispatch(addRestaurantDetails(serializedFormData))
  //       page((prevActiveStep) => prevActiveStep + 1)
  //     }
  //   }
  // }, [clicked])

  const addValues = () => {
    let allNotEmpty = true
    for (let key in values) {
      if (
        values.hasOwnProperty(key) &&
        (values[key] === '' || values[key] === null)
      ) {
        allNotEmpty = false
        break
      }
    }
    if (allNotEmpty) {
      done(true)
      dispatch(
        addRestaurantDetails({
          name: values.name,
          location: values.location,
          totalSpots: values.totalSpots,
          description: values.description,
          openingTime: values.openingTime,
          closingTime: values.closingTime,
        }),
      )
    } else {
      setOpen(true)
    }
  }
  useEffect(() => {
    // Example: Update another state based on the selected role
    console.log(values)
    if (values.role === 'employee') {
      setSelectRes(true)
      // console.log(true)
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

  const handleTimeChange = (time, type) => {
    const formattedTime = time ? moment(time).format('hh:mm A') : ''
    setValues((prevValues) => ({
      ...prevValues,
      [type]: formattedTime,
    }))
  }
  const handleTimeChangeCloseing = (time, type) => {
    const formattedTime = time ? moment(time).format('hh:mm A') : ''

    setValues((prevState) => ({
      ...prevState,
      [type]: formattedTime,
    }))
  }
  const formatTime = (time) => {
    if (!time) return ''
    return moment(time, 'hh:mm A').format('hh:mm A')
  }

  const handleSubmit = useCallback((event) => {
    event.preventDefault()
  }, [])

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setOpen(false)
  }

  return (
    <form autoComplete="off" noValidate onSubmit={handleSubmit}>
      <Card>
        <CardHeader
          subheader="The information is used to create a restaurant under this orginization"
          title="Step 1"
        />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid container spacing={3}>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  helperText="Please specify the first name"
                  label="Name"
                  name="name"
                  onChange={handleChange}
                  required
                  value={values.name}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Location"
                  name="location"
                  onChange={handleChange}
                  required
                  value={values.location}
                />
              </Grid>
              <Grid xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Total Spots"
                  name="totalSpots"
                  type="number"
                  onChange={handleChange}
                  required
                  value={values.totalSpots}
                />
              </Grid>

              <Grid xs={12} md={4}>
                <TimePicker
                  label="Select Opening  Time"
                  value={
                    values.openingTime
                      ? moment(values.openingTime, 'hh:mm A').toDate()
                      : null
                  }
                  onChange={(time) => handleTimeChange(time, 'openingTime')}
                  ampm={true}
                  format="HH:mm"
                  renderInput={(props) => (
                    <TextField
                      {...props}
                      helperText={formatTime(values.openingTime)}
                    />
                  )}
                />
              </Grid>

              <Grid xs={12} md={4}>
                <TimePicker
                  label="Select Closing Time"
                  value={
                    values.closingTime
                      ? moment(values.closingTime, 'hh:mm A').toDate()
                      : null
                  }
                  onChange={(time) =>
                    handleTimeChangeCloseing(time, 'closingTime')
                  }
                  ampm={true}
                  format="HH:mm"
                  renderInput={(props) => (
                    <TextField
                      {...props}
                      helperText={formatTime(values.closingTime)}
                    />
                  )}
                />
              </Grid>
            </Grid>

            <Grid xs={12} md={12}>
              <TextField
                multiline
                fullWidth
                label="Description"
                name="description"
                onChange={handleChange}
                required
                value={values.description}
              />
            </Grid>

            <Grid xs={12} md={12}>
              <Button onClick={addValues}>Done</Button>
            </Grid>
          </Box>
        </CardContent>
        <Divider />
      </Card>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          variant="filled"
          severity="error"
          sx={{ width: '100%' }}
        >
          The Fields must not be empty
        </Alert>
      </Snackbar>
    </form>
  )
}
