import Head from 'next/head'
import PlusIcon from '@heroicons/react/24/solid/PlusIcon'
import {
  Box,
  Button,
  Container,
  Pagination,
  Stack,
  SvgIcon,
  TextField,
  Typography,
  Unstable_Grid2 as Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material'
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout'
import { useEffect, useState } from 'react'
import Axiosinstance from 'src/utils/axios'
import { useDispatch, useSelector } from 'react-redux'
import { addEvents, selectEvent } from 'src/redux/features/userSlice'
import { useRouter } from 'next/router'
import { useAuth } from 'src/hooks/use-auth'
import lazy from 'src/utils/lazy'
import { DatePicker } from '@mui/x-date-pickers'
const EventCard = lazy(() => import('src/sections/events/event-card'))

const CompaniesSearch = ({ onSearch }) => {
  return (
    <TextField
      label="Search"
      variant="outlined"
      size="small"
      onChange={onSearch}
    />
  )
}

const Page = () => {
  const [restaurants, setRestaurants] = useState([])
  const [filteredRestaurants, setFilteredRestaurants] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const dispatch = useDispatch()
  const localEvents = useSelector(selectEvent)
  const router = useRouter()
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedButton, setSelectedButton] = useState('all')
  const [formattedDate, setFormattedDate] = useState('')
  const [type, setType] = useState()
  const handleClickOpen = (type) => {
    setOpen(true)
    setType(type)
  }
  const handleClose = () => {
    setOpen(false)
  }
  const handleDateChange = (date) => {
    setSelectedDate(date)
    if (date) {
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const day = date.getDate().toString().padStart(2, '0')
      const formatted = `${month}/${day}/${date.getFullYear()}`
      setFormattedDate(formatted)
    } else {
      setFormattedDate('')
    }
  }

  const handleButtonClick = (buttonName) => {
    setSelectedButton(buttonName)
    console.log(buttonName)
  }

  useEffect(() => {
    console.log(user)
    if (!localEvents) {
      Axiosinstance.get(`api/${user.category}s/${user.ID}/events`).then(
        (res) => {
          console.log(res.data)
          setRestaurants(res.data)
          dispatch(addEvents(res.data))
          // Filter the restaurants based on the search query
          const filtered = res.data.filter((restaurant) =>
            restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()),
          )
          setFilteredRestaurants(filtered)
        },
      )
    } else {
      // Filter the localEvents based on the search query
      const filtered = localEvents.filter((restaurant) =>
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setRestaurants(localEvents)
      setFilteredRestaurants(filtered)
    }
  }, [searchQuery])

  const handleSearch = (event) => {
    setSearchQuery(event.target.value)
  }
  const handleExportExcel = () => {
    console.log('hi')

    if (type === 'Pdf') {
      Axiosinstance({
        url: `/api/overview/tickets/download/pdf/${selectedButton}`,
        method: 'GET',
        responseType: 'blob', // Important for handling binary data
      })
        .then((response) => {
          const blob = new Blob([response.data], {
            type: response.headers['content-type'],
          })
          const blobUrl = URL.createObjectURL(blob)

          const link = document.createElement('a')
          link.href = blobUrl
          link.download = 'tickets.pdf' // Specify the desired filename
          link.click()

          URL.revokeObjectURL(blobUrl)
        })
        .catch((error) => {
          console.error('Download error:', error)
        })
    } else {
      Axiosinstance({
        url: `/api/overview/tickets/download/${selectedButton}`,
        method: 'GET',
        responseType: 'blob', // Important for handling binary data
      })
        .then((response) => {
          const blob = new Blob([response.data], {
            type: response.headers['content-type'],
          })
          const blobUrl = URL.createObjectURL(blob)

          const link = document.createElement('a')
          link.href = blobUrl
          link.download = 'downloaded_files.xlsx' // Specify the desired filename
          link.click()

          URL.revokeObjectURL(blobUrl)
        })
        .catch((error) => {
          console.error('Download error:', error)
        })
    }
  }

  return (
    <>
      <Head>
        <title>Events | Peomax</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Events</Typography>
              </Stack>
              <div>
                <Button
                  onClick={() => router.push('/events/add')}
                  startIcon={
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                >
                  Add
                </Button>
              </div>
            </Stack>
            <CompaniesSearch onSearch={handleSearch} />
            <Grid
              sx={{ display: 'flex', width: '600px', alignItems: 'center' }}
            >
              <Typography variant="h6" sx={{ mb: '5px' }}>
                Export Data as
              </Typography>

              <Button
                // disabled={selectedData.length <= 0}
                onClick={() => handleClickOpen('Xcel')}
              >
                Xcel
              </Button>
              <Button
                // disabled={selectedData.length <= 0}
                onClick={() => handleClickOpen('Pdf')}
              >
                PDF
              </Button>
            </Grid>
            <Grid container spacing={3}>
              {filteredRestaurants.map((restaurant) => (
                <Grid xs={12} md={6} lg={4} key={restaurant.id}>
                  <EventCard event={restaurant} />
                </Grid>
              ))}
            </Grid>
            {/* <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Pagination count={10} size="small" />
            </Box> */}
          </Stack>
        </Container>
      </Box>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Select a Type</DialogTitle>
        <DialogContent>
          <Box mt={1}>
            <Button
              variant={selectedButton === 'all' ? 'contained' : 'text'}
              onClick={() => handleButtonClick('all')}
            >
              All
            </Button>
            <Button
              variant={selectedButton === 'premium' ? 'contained' : 'text'}
              onClick={() => handleButtonClick('premium')}
            >
              Primium
            </Button>
            <Button
              variant={selectedButton === 'regular' ? 'contained' : 'text'}
              onClick={() => handleButtonClick('regular')}
            >
              Regular
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            color="primary"
            onClick={handleExportExcel}
          >
            Export
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>

export default Page
