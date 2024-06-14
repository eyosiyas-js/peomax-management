import { useCallback, useEffect, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Unstable_Grid2 as Grid,
  Snackbar,
  Alert,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import {
  addRestaurantDetails,
  selectCompanyInfo,
} from 'src/redux/features/userSlice'
import { useAuth } from 'src/hooks/use-auth'
import { useRouter } from 'next/router'

const paymentMethods = [
  { id: 1, name: 'Credit Card' },
  { id: 2, name: 'PayPal' },
  { id: 3, name: 'Google Pay' },
  { id: 4, name: 'Apple Pay' },
  { id: 5, name: 'Bank Transfer' },
]

export const AccountProfileDetails3 = ({ clicked, done }) => {
  const [open, setOpen] = useState(false)

  const [selectRes, setSelectRes] = useState(false)
  const dispatch = useDispatch()
  const companyInfo = useSelector(selectCompanyInfo)
  const { user } = useAuth()
  const [values, setValues] = useState({
    crossStreet: '',
    cuisines: '',
    diningStyle: '',
    dressCode: '',
    neighborhood: '',
    parkingDetails: '',
    publicTransit: '',
    additional: '',
    paymentOptions: [],
    phoneNumber: '',
    website: '',
  })
  const router = useRouter()

  useEffect(() => {
    if (
      user.ID &&
      (window.location.pathname === '/services/edit' ||
        window.location.pathname === '/company/edit')
    ) {
      setValues({
        crossStreet: companyInfo.crossStreet,
        cuisines: companyInfo.cuisines,
        diningStyle: companyInfo.diningStyle,
        dressCode: companyInfo.dressCode,
        neighborhood: companyInfo.neighborhood,
        parkingDetails: companyInfo.parkingDetails,
        publicTransit: companyInfo.publicTransit,
        additional: companyInfo.additional,
        paymentOptions: companyInfo.paymentOptions,
        phoneNumber: companyInfo.phoneNumber,
        website: companyInfo.website,
      })
    }
  }, [])

  const addValues = () => {
    let allNotEmpty = true
    for (let key in values) {
      if (values.hasOwnProperty(key) && values[key] === '') {
        allNotEmpty = false
        break
      }
    }
    if (allNotEmpty) {
      done(true)
      dispatch(addRestaurantDetails(values))
    } else {
      setOpen(true)
    }
  }
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

  const handleSubmit = useCallback((event) => {
    event.preventDefault()
  }, [])
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setOpen(false)
  }

  const handleChangeSelect = (event) => {
    const { value } = event.target
    setValues((prevValues) => ({
      ...prevValues,
      paymentOptions: value,
    }))
  }
  return (
    <form autoComplete="off" noValidate onSubmit={handleSubmit}>
      <Card>
        <CardHeader
          subheader="The information is used to create a restaurant under this orginization"
          title="Step 2"
        />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid container spacing={3}>
              <Grid xs={12} md={4}>
                <TextField
                  fullWidth
                  helperText="Please specify the Cross Street"
                  label="Cross Street"
                  name="crossStreet"
                  onChange={handleChange}
                  required
                  value={values.crossStreet}
                />
              </Grid>
              <Grid xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Cuisines"
                  name="cuisines"
                  onChange={handleChange}
                  required
                  value={values.cuisines}
                />
              </Grid>
              <Grid xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Dining style"
                  name="diningStyle"
                  onChange={handleChange}
                  required
                  value={values.diningStyle}
                />
              </Grid>
              <Grid xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Dress code"
                  name="dressCode"
                  onChange={handleChange}
                  required
                  value={values.dressCode}
                />
              </Grid>

              <Grid xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Neighborhood"
                  name="neighborhood"
                  onChange={handleChange}
                  required
                  value={values.neighborhood}
                />
              </Grid>
              <Grid item mt={-2} xs={3}>
                <InputLabel id="payment-method-label">
                  Payment Methods
                </InputLabel>
                <Select
                  sx={{ minWidth: '300px' }}
                  labelId="payment-method-label"
                  multiple
                  fullWidth
                  value={values.paymentOptions}
                  onChange={handleChangeSelect}
                >
                  {paymentMethods.map((method) => (
                    <MenuItem key={method.name} value={method.name}>
                      {method.name}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  multiline
                  fullWidth
                  type="number"
                  label="Phone Number"
                  name="phoneNumber"
                  onChange={handleChange}
                  required
                  value={values.phoneNumber}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  multiline
                  fullWidth
                  label="website"
                  name="website"
                  onChange={handleChange}
                  required
                  value={values.website}
                />
              </Grid>
              <Grid xs={12} md={12}>
                <TextField
                  multiline
                  fullWidth
                  label="Parking Details"
                  name="parkingDetails"
                  onChange={handleChange}
                  required
                  value={values.parkingDetails}
                />
              </Grid>
            </Grid>

            <Grid xs={12} md={12}>
              <TextField
                multiline
                fullWidth
                label="Public Transit"
                name="publicTransit"
                onChange={handleChange}
                required
                value={values.publicTransit}
              />
            </Grid>
            <Grid xs={12} md={12}>
              <TextField
                multiline
                fullWidth
                label="Additional"
                name="additional"
                onChange={handleChange}
                required
                value={values.additional}
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
