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
  CircularProgress,
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { addRestaurantDetails, selectEdit } from 'src/redux/features/userSlice'
import {
  DatePicker,
  DesktopDatePicker,
  LocalizationProvider,
  TimePicker,
} from '@mui/x-date-pickers'
import moment from 'moment/moment'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import Axiosinstance from 'src/utils/axios'
import { format } from 'date-fns'
import { useAuth } from 'src/hooks/use-auth'
import { useRouter } from 'next/router'

// const Alert = forwardRef(function Alert(props, ref) {
//   return
// })

export const EventEditFORM = () => {
  const { user } = useAuth()

  const [openError, setOpenError] = useState({
    state: false,
    message: '',
  })
  const [success, setSucess] = useState({
    state: false,
    message: '',
  })
  const [selectRes, setSelectRes] = useState(false)
  const dispatch = useDispatch()
  const [files, setFiles] = useState([])
  const [selectedButton, setSelectedButton] = useState('event')
  const editInfo = useSelector(selectEdit)
  const [values, setValues] = useState({
    name: '',
    premiumPrice: '',
    totalSpots: '',
    description: '',
    eventStart: null,
    eventEnd: null,
    date: null,
    endDate: null,
    price: '',
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    console.log(values)
  }, [values])

  const addValues = async () => {
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
      setLoading(true)
      const formData = new FormData()

      for (const key in values) {
        formData.append(key, values[key])
      }

      for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i])
      }

      formData.append('category', user.category)
      formData.append('ID', user.ID)

      if (files.length > 0) {
        await Axiosinstance.put(
          `/api/events/${editInfo.id}/edit?files=true`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        )
          .then((res) => {
            setLoading(false)
            setSucess({
              state: true,
              message: 'Event Edited Successfully!!',
            })
          })
          .catch((err) => {
            setLoading(false)
            console.log(err)
            setOpenError({
              state: true,
              message: 'Something went wrong, Please Try Again',
            })
          })
      } else {
        await Axiosinstance.put(`/api/events/${editInfo.id}/edit`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
          .then((res) => {
            setLoading(false)
            setSucess({
              state: true,
              message: 'Event Edited Successfully!!',
            })
          })
          .catch((err) => {
            setLoading(false)
            console.log(err)
            setOpenError({
              state: true,
              message: 'Something went wrong, Please Try Again',
            })
          })
      }
    } else {
      setOpenError({
        state: true,
        message: 'The Fields must not be empty',
      })
    }
  }
  //   const createProgram = async () => {
  //     let allNotEmpty = true
  //     for (let key in values) {
  //       if (values.hasOwnProperty(key)) {
  //         if (key === 'premiumPrice') {
  //           continue // Skip validation for 'date' and 'price' properties
  //         }

  //         if (values[key] === '' || values[key] === null || files.length <= 0) {
  //           allNotEmpty = false
  //           break
  //         }
  //       }
  //     }
  //     if (allNotEmpty) {
  //       setLoading(true)
  //       const formData = new FormData()

  //       for (const key in values) {
  //         if (key !== 'premiumPrice') {
  //           formData.append(key, values[key])
  //         }
  //       }
  //       for (let i = 0; i < files.length; i++) {
  //         formData.append('images', files[i])
  //       }

  //       formData.append('category', user.category)
  //       formData.append('ID', user.ID)
  //       formData.append('program', true)

  //       await Axiosinstance.put(`/api/${editInfo.id}/edit`, formData, {
  //         headers: {
  //           'Content-Type': 'multipart/form-data',
  //         },
  //       })
  //         .then((res) => {
  //           setLoading(false)
  //           setSucess({
  //             state: true,
  //             message: 'Event Created Successfully!!',
  //           })
  //         })
  //         .catch((err) => {
  //           setLoading(false)
  //           console.log(err)
  //           setOpenError({
  //             state: true,
  //             message: 'Something went wrong, Please Try Again',
  //           })
  //         })
  //     } else {
  //       setOpenError({
  //         state: true,
  //         message: 'The Fields must not be empty',
  //       })
  //     }
  //   }
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
  useEffect(() => {
    if (editInfo) {
      Axiosinstance.get(`/api/events/${editInfo.id}`)
        .then((res) => {
          console.log(res.data[0].date)
          setValues({
            name: res.data[0].name,
            premiumPrice: res.data[0].premiumPrice,
            totalSpots: res.data[0].totalSpots,
            description: res.data[0].description,
            eventStart: res.data[0].eventStart,
            eventEnd: res.data[0].eventEnd,
            date: res.data[0].date,
            price: res.data[0].price,
          })
        })
        .catch((err) => {
          console.error(err)
        })
    } else {
      router.push('/events')
    }
  }, [])
  const handleChange = useCallback((event) => {
    setValues((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }))
  }, [])

  const [selectedFiles, setSelectedFiles] = useState([])

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
  const handleDateChange = (date) => {
    const formattedDate = format(date, 'MM/dd/yyyy')
    setValues((prevValues) => ({
      ...prevValues,
      date: formattedDate,
    }))
  }
  const handleEndDateChange = (date) => {
    const formattedDate = format(date, 'MM/dd/yyyy')
    setValues((prevValues) => ({
      ...prevValues,
      endDate: formattedDate,
    }))
  }
  const handleFileInputChange = (event) => {
    const files = Array.from(event.target.files)
    if (files.length <= 5) {
      setSelectedFiles(files)
      setFiles(event.target.files)
    } else {
      // Handle the case where more than 5 files are selected
      alert('Maximum of 5 files allowed.')
    }
  }

  const shouldDisableDate = (date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Set today's time to midnight

    return date < today
  }

  const shouldDisableEndDate = (date) => {
    const selectedDate = new Date(date)
    const startDate = new Date(values.date)

    return selectedDate < startDate
  }

  if (loading)
    return (
      <Grid sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <CircularProgress color="error" />
      </Grid>
    )

  return (
    <form autoComplete="off" noValidate onSubmit={handleSubmit}>
      <Card>
        <CardHeader
          subheader="The information is used to Edit This Event under this orginization"
          title="Edit your Event"
        />

        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid container spacing={3}>
              <Grid xs={12} md={12}>
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

              <Grid xs={12} md={4}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DesktopDatePicker
                    inputFormat="MM/dd/yyyy"
                    label="Starting Date"
                    value={values.date}
                    onChange={handleDateChange}
                    shouldDisableDate={shouldDisableDate}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid xs={12} md={4}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DesktopDatePicker
                    inputFormat="MM/dd/yyyy"
                    label="Ending Date"
                    value={values.endDate}
                    onChange={handleEndDateChange}
                    shouldDisableDate={shouldDisableEndDate}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid xs={12} md={4}>
                <TimePicker
                  label="Select starting Time"
                  value={
                    values.eventStart
                      ? moment(values.eventStart, 'hh:mm A').toDate()
                      : null
                  }
                  onChange={(time) => handleTimeChange(time, 'eventStart')}
                  ampm={true}
                  format="HH:mm"
                  renderInput={(props) => (
                    <TextField
                      {...props}
                      helperText={formatTime(values.eventStart)}
                    />
                  )}
                />
              </Grid>

              <Grid xs={12} md={4}>
                <TimePicker
                  label="Select Ending Time"
                  value={
                    values.eventEnd
                      ? moment(values.eventEnd, 'hh:mm A').toDate()
                      : null
                  }
                  onChange={(time) =>
                    handleTimeChangeCloseing(time, 'eventEnd')
                  }
                  ampm={true}
                  format="HH:mm"
                  renderInput={(props) => (
                    <TextField
                      {...props}
                      helperText={formatTime(values.eventEnd)}
                    />
                  )}
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
                <TextField
                  fullWidth
                  label="Price"
                  name="price"
                  type="number"
                  onChange={handleChange}
                  required
                  value={values.price}
                />
              </Grid>
              {selectedButton === 'event' && (
                <Grid xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="VIP price"
                    name="premiumPrice"
                    type="number"
                    onChange={handleChange}
                    required
                    value={values.premiumPrice}
                  />
                </Grid>
              )}

              <Grid xs={12} md={4}>
                <input
                  type="file"
                  multiple
                  onChange={handleFileInputChange}
                  accept="image/*"
                  name="images"
                  style={{ display: 'none' }}
                  id="file-input"
                />
                <label htmlFor="file-input">
                  <Button
                    variant="contained"
                    component="span"
                    style={{
                      backgroundColor: '#f50057',
                      color: '#fff',
                      borderRadius: '4px',
                      padding: '10px 20px',
                      cursor: 'pointer',
                    }}
                  >
                    Select Files
                  </Button>
                </label>
                {selectedFiles.length > 0 && (
                  <div style={{ marginTop: '20px' }}>
                    <strong>Selected Files:</strong>
                    <ul>
                      {selectedFiles.map((file, index) => (
                        <li key={index}>{file.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </Grid>
            </Grid>

            <Grid xs={12} md={12} display={'flex'} justifyContent={'center'}>
              {selectedButton === 'event' ? (
                <Button onClick={addValues}>Edit</Button>
              ) : (
                <Button onClick={createProgram}>Create Program</Button>
              )}
            </Grid>
          </Box>
        </CardContent>
        <Divider />
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
