import { useCallback, useMemo, useState, useEffect } from 'react'
import Head from 'next/head'

import {
  Alert,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useSelection } from 'src/hooks/use-selection'
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout'
import lazy from 'src/utils/lazy'
import io from 'socket.io-client'

const CustomersTable = lazy(() =>
  import('src/sections/customer/customers-table'),
)
const CustomersSearch = lazy(() =>
  import('src/sections/customer/customers-search'),
)
import Axiosinstance from 'src/utils/axios'
import { useRouter } from 'next/router'
import { CompaniesSearch } from 'src/sections/companies/companies-search'
import { DatePicker } from '@mui/x-date-pickers'

const socket = io('https://api.peomax.com') // Replace with your server URL

const Page = () => {
  const router = useRouter()
  const { res, category } = router.query
  const [data, setData] = useState([])
  const [selectedData, setSelectedData] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [reload, setReload] = useState()
  const [axiosPageCount, setAxiosPageCount] = useState()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedButton, setSelectedButton] = useState('all')
  const [openError, setOpenError] = useState({
    state: false,
    message: '',
  })
  const [selectedDate, setSelectedDate] = useState(null)
  const [formattedDate, setFormattedDate] = useState('')
  const [open, setOpen] = useState(false)
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

  const useCustomers = (page, rowsPerPage) => {
    return useMemo(() => {
      const startIndex = page * rowsPerPage
      const endIndex = startIndex + rowsPerPage
      const slicedData = selectedData.slice(startIndex, endIndex)
      return slicedData
    }, [selectedData, page, rowsPerPage])
  }

  const useCustomerIds = (customers) => {
    return useMemo(() => {
      return customers.map((customer) => customer.id)
    }, [customers])
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Axiosinstance.get(
          `api/reservations/all/?status=${selectedButton}&page=1&count=50`,
        )
        // setCPage(cPage + 1)

        setSelectedData(response.data.reservations)
        setAxiosPageCount(response.data.totalPages)
      } catch (error) {
        console.error('Error occurred while fetching data:', error)
      }
    }

    fetchData()
  }, [reload, selectedButton])
  // useEffect(() => {
  //   if (selectedButton === 'all') {
  //     setSelectedData(data)
  //   }
  //   if (selectedButton === 'accepted') {
  //     const acceptedObjects = data.filter(
  //       (object) => object.status === 'accepted',
  //     )
  //     setSelectedData(acceptedObjects)
  //   }
  //   if (selectedButton === 'rejected') {
  //     const acceptedObjects = data.filter(
  //       (object) => object.status === 'rejected',
  //     )
  //     setSelectedData(acceptedObjects)
  //   }
  //   if (selectedButton === 'pending') {
  //     const acceptedObjects = data.filter(
  //       (object) => object.status === 'pending',
  //     )
  //     setSelectedData(acceptedObjects)
  //   }
  //   if (selectedButton === 'attended') {
  //     const acceptedObjects = data.filter(
  //       (object) => object.status === 'attended',
  //     )
  //     setSelectedData(acceptedObjects)
  //   }
  // }, [selectedButton, data])

  useEffect(() => {
    socket.on(`reserve:${res}`, (updatedData) => {
      // Handle the updated data received from the server
      console.log('Received updated data:', updatedData)
      setData((prevData) => {
        const uniqueData = new Set([updatedData, ...prevData])
        const deduplicatedArray = [...uniqueData]
        return deduplicatedArray
      })
    })
  }, [])

  const customers = useCustomers(page, rowsPerPage)
  const customersIds = useCustomerIds(customers)
  const customersSelection = useSelection(customersIds)

  const handlePageChange = useCallback(
    async (event, value) => {
      if (value > page) {
        setPage(value)

        console.log(data)
        console.log({ count: data.length, page: value })

        if (axiosPageCount >= value) {
          try {
            const response = await Axiosinstance.get(
              `api/reservations/all/?page=${value + 1}&count=50`,
            )
            setSelectedData((prevData) => [
              ...prevData,
              ...response.data.reservations,
            ])
            // setAxiosPageCount(response.data.totalPages);
          } catch (error) {
            console.error('Error occurred while fetching data:', error)
          }
        }
      } else {
        setPage(value)
      }
    },
    [axiosPageCount, data, page],
  )

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value)
  }, [])
  const handleSearch = (event) => {
    setSearchQuery(event.target.value)
  }
  const fetchSearch = async () => {
    if (searchQuery === '') {
      setReload(Math.random())
    } else
      try {
        const response = await Axiosinstance.get(
          `api/reservations/${searchQuery}`,
        )
        let resData = []
        resData.push(response.data)

        setData(resData)
        console.log(resData)
      } catch (error) {
        setOpenError({
          state: true,
          message: error.response.data.error,
        })
        console.error('Error occurred while fetching data:', error)
      }
  }
  const handleCloseError = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setOpenError({
      state: false,
      message: '',
    })
  }
  const handleButtonClick = (buttonName) => {
    setSelectedButton(buttonName)
    console.log(buttonName)
  }

  const handleExportExcel = () => {
    console.log('hi')
    if (type === 'Pdf') {
      Axiosinstance({
        url: `/api/overview/download/pdf/${selectedButton}?date=${formattedDate}`,
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
          link.download = 'reservations.pdf' // Specify the desired filename
          link.click()

          URL.revokeObjectURL(blobUrl)
        })
        .catch((err) => {
          console.error('Download error:', err)
          setOpenError({
            state: true,
            message: 'No reservations on this date',
          })
        })
    } else {
      Axiosinstance({
        url: `/api/overview/download/${selectedButton}?date=${formattedDate}`,
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
          link.download = 'reservations.xlsx' // Specify the desired filename
          link.click()

          URL.revokeObjectURL(blobUrl)
        })
        .catch((error) => {
          console.error('Download error:', error)
          setOpenError({
            state: true,
            message: 'No reservations on this date',
          })
        })
    }
  }
  const shouldDisableDate = (date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Set today's time to midnight

    return date > today
  }
  return (
    <>
      <Head>
        <title>Reservations | Peomax</title>
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
                <Typography variant="h4">Reservations</Typography>
              </Stack>
            </Stack>
            <Grid sx={{ display: 'flex', width: '600px' }}>
              <CompaniesSearch onSearch={handleSearch} />

              <Button onClick={fetchSearch}>Search</Button>
            </Grid>
            <Grid sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
              <Button
                sx={{ mx: '10px', width: '100px' }}
                variant={selectedButton === 'all' ? 'contained' : 'outlined'}
                onClick={() => handleButtonClick('all')}
              >
                All
              </Button>
              <Button
                sx={{ mx: '10px', width: '100px' }}
                variant={
                  selectedButton === 'accepted' ? 'contained' : 'outlined'
                }
                onClick={() => handleButtonClick('accepted')}
              >
                Accepted
              </Button>
              <Button
                sx={{ mx: '10px', width: '100px' }}
                variant={
                  selectedButton === 'rejected' ? 'contained' : 'outlined'
                }
                onClick={() => handleButtonClick('rejected')}
              >
                Rejected
              </Button>
              <Button
                sx={{ mx: '10px', width: '100px' }}
                variant={
                  selectedButton === 'pending' ? 'contained' : 'outlined'
                }
                onClick={() => handleButtonClick('pending')}
              >
                Pending
              </Button>
              <Button
                sx={{ mx: '10px', width: '100px' }}
                variant={
                  selectedButton === 'attended' ? 'contained' : 'outlined'
                }
                onClick={() => handleButtonClick('attended')}
              >
                Attended
              </Button>
            </Grid>
            <Grid
              sx={{ display: 'flex', width: '600px', alignItems: 'center' }}
            >
              <Typography variant="h6" sx={{ mb: '5px' }}>
                Export Data as
              </Typography>

              <Button
                disabled={selectedData.length <= 0}
                onClick={() => handleClickOpen('Xcel')}
              >
                Xcel
              </Button>
              <Button
                disabled={selectedData.length <= 0}
                onClick={() => handleClickOpen('Pdf')}
              >
                PDF
              </Button>
            </Grid>
            <CustomersTable
              reload={(reload) => setReload(reload)}
              res={res}
              category={category}
              count={selectedData.length}
              items={customers}
              onDeselectAll={customersSelection.handleDeselectAll}
              onDeselectOne={customersSelection.handleDeselectOne}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSelectAll={customersSelection.handleSelectAll}
              onSelectOne={customersSelection.handleSelectOne}
              page={page}
              rowsPerPage={rowsPerPage}
              selected={customersSelection.selected}
            />
          </Stack>
        </Container>
      </Box>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Select a Date</DialogTitle>
        <DialogContent>
          <DialogContentText>Please select a date:</DialogContentText>
          <DatePicker
            value={selectedDate}
            shouldDisableDate={shouldDisableDate}
            onChange={handleDateChange}
            renderInput={(params) => <TextField {...params} />}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            color="primary"
            disabled={!selectedDate}
            onClick={handleExportExcel}
          >
            Export
          </Button>
        </DialogActions>
      </Dialog>
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
    </>
  )
}

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>

export default Page
