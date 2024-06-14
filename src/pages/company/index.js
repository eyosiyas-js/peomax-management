import * as React from 'react'
import lazy from 'src/utils/lazy'

import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout'
import { Container } from '@mui/system'
const Step1 = lazy(() => import('src/components/addRestaurant/step1/Step1'))
const Step2 = lazy(() => import('src/components/addRestaurant/step2/Step2'))
const Step3 = lazy(() => import('src/components/addRestaurant/step3/Step3'))
import { useDispatch, useSelector } from 'react-redux'
import { useAuth } from 'src/hooks/use-auth'

import {
  removeRestaurantDetails,
  selectRestaurantDetails,
} from 'src/redux/features/userSlice'
import Axiosinstance from 'src/utils/axios'
import { Alert, CircularProgress, Grid, Snackbar } from '@mui/material'
import { useRouter } from 'next/router'
const CompanyDetails = lazy(() => import('src/components/RestaurantDetails'))

const steps = ['Restaurant Info', 'Additional Info', 'Create an ad']

export default function Page() {
  const RestaurantDetails = useSelector(selectRestaurantDetails)
  const [activeStep, setActiveStep] = React.useState(0)
  const [done, setDone] = React.useState()
  const [skipped, setSkipped] = React.useState(new Set())
  const [step1State, setStep1State] = React.useState(false)
  const [step2State, setStep2State] = React.useState(false)
  const [step3State, setStep3State] = React.useState(false)
  const [selectedButton, setSelectedButton] = React.useState('')

  const [files, setFiles] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const router = useRouter()
  const dispatch = useDispatch()
  const { user } = useAuth()

  const [openError, setOpenError] = React.useState({
    state: false,
    message: '',
  })
  const [success, setSucess] = React.useState({
    state: false,
    message: '',
  })
  const isStepOptional = (step) => {
    return step === 1
  }
  const handleFiles = (acceptedFiles) => {
    // Do something with the accepted files

    console.log(acceptedFiles)
    setFiles(acceptedFiles)
  }

  const handleFinish = async () => {
    setLoading(true)

    const formData = new FormData()

    for (const key in RestaurantDetails) {
      if (key !== 'paymentOptions') {
        formData.append(key, RestaurantDetails[key])
      }
    }
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i])
    }
    const paymentOptions = RestaurantDetails.paymentOptions
    for (let i = 0; i < paymentOptions.length; i++) {
      formData.append('paymentOptions', paymentOptions[i])
    }

    // const paymentOptions = RestaurantDetails.paymentOptions || [] // Ensure paymentOptions is an array
    // for (let i = 0; i < paymentOptions.length; i++) {
    //   formData.append('paymentOptions', paymentOptions[i])
    // }
    // formData.append('paymentOptions', 'oncash')
    // formData.append('paymentOptions', 'credit card')

    formData.append('subHotel', true)
    // files.forEach((file, index) => {
    //   formData.append('images', file)
    // })
    console.log(files)
    // formData.append('images', files[0])

    console.log(RestaurantDetails)
    formData.append('availableSpots', RestaurantDetails.totalSpots)

    try {
      await Axiosinstance.post(`/api/${selectedButton}s/create`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
        .then((res) => {
          setLoading(false)
          setSucess({
            state: true,
            message: 'Created Successfully!!',
          })
          dispatch(removeRestaurantDetails())
          window.location.reload()
        })
        .catch((err) => {
          setLoading(false)

          setOpenError({
            state: true,
            message: err.response.data.error,
          })
        })
    } catch (error) {
      setLoading(false)
      setOpenError({
        state: true,
        message: 'Something went wrong, Please Try Again',
      })
      // Handle errors
      console.log(error)
    }
  }
  const handleNext = () => {
    if (activeStep === 0) setStep1State(true)
    if (activeStep === 1) setStep2State(true)
    if (activeStep === 2) setStep3State(true)
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
    setDone('')
  }
  React.useEffect(() => {
    console.log(files)
  }, [files])

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.")
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1)
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values())
      newSkipped.add(activeStep)
      return newSkipped
    })
  }

  const handleReset = () => {
    setActiveStep(0)
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
  const handleButtonClick = (buttonName) => {
    setSelectedButton(buttonName)
    console.log(buttonName)
  }

  if (loading) {
    return (
      <Grid sx={{ display: 'flex', justifyContent: 'center' }}>
        <CircularProgress color="error" />
      </Grid>
    )
  }
  console.log(user)
  if (user && user.ID) {
    return (
      <div>
        <CompanyDetails />
      </div>
    )
  }

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth="xl">
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => {
            const stepProps = {}
            const labelProps = {}

            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            )
          })}
        </Stepper>
        <Grid sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
          <Button
            sx={{ mx: '10px', width: '100px' }}
            variant={selectedButton === 'restaurant' ? 'contained' : 'outlined'}
            onClick={() => handleButtonClick('restaurant')}
          >
            Restaurant
          </Button>
          <Button
            sx={{ mx: '10px', width: '100px' }}
            variant={selectedButton === 'hotel' ? 'contained' : 'outlined'}
            onClick={() => handleButtonClick('hotel')}
          >
            Hotel
          </Button>
          <Button
            sx={{ mx: '10px', width: '100px' }}
            variant={selectedButton === 'club' ? 'contained' : 'outlined'}
            onClick={() => handleButtonClick('club')}
          >
            lounge
          </Button>
          <Button
            sx={{ mx: '10px', width: '100px' }}
            variant={selectedButton === 'bar' ? 'contained' : 'outlined'}
            onClick={() => handleButtonClick('bar')}
          >
            Bar
          </Button>
        </Grid>

        {activeStep === steps.length ? (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1 }}>
              All steps completed - you&apos;re finished
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button onClick={handleReset}>Reset</Button>
            </Box>
          </React.Fragment>
        ) : (
          <React.Fragment>
            {activeStep === 0 && (
              <Step1 clicked={step1State} done={(done) => setDone(done)} />
            )}
            {activeStep === 1 && (
              <Step2 clicked={step2State} done={(done) => setDone(done)} />
            )}
            {activeStep === 2 && (
              <Step3 clicked={step3State} files={handleFiles} />
            )}
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Box sx={{ flex: '1 1 auto' }} />
              {activeStep === steps.length - 1 ? (
                <Button disabled={!files} onClick={handleFinish}>
                  Finish
                </Button>
              ) : (
                <Button disabled={!done} onClick={handleNext}>
                  Next
                </Button>
              )}
              {/* 
              <Button onClick={handleNext}>
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button> */}
            </Box>
          </React.Fragment>
        )}
      </Container>
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
    </Box>
  )
}

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>
