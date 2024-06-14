import { useCallback, useMemo, useState, useEffect } from 'react'
import Head from 'next/head'

import {
  Alert,
  Box,
  Button,
  Container,
  Grid,
  Snackbar,
  Stack,
  Typography,
} from '@mui/material'
import { useSelection } from 'src/hooks/use-selection'
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout'
import lazy from 'src/utils/lazy'
import io from 'socket.io-client'

const CustomersTable = lazy(() =>
  import('src/sections/customer/customers-table'),
)
import Axiosinstance from 'src/utils/axios'
import { useRouter } from 'next/router'
import { CompaniesSearch } from 'src/sections/companies/companies-search'
import { useSelector } from 'react-redux'
import { selectEdit } from 'src/redux/features/userSlice'

const socket = io('https://api.peomax.com') // Replace with your server URL

const Page = () => {
  const router = useRouter()
  const editInfo = useSelector(selectEdit)
  // const { enqueueSnackbar } = useSnackbar()
  // const dispatch = useDispatch()
  const [data, setData] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [reload, setReload] = useState()
  const [axiosPageCount, setAxiosPageCount] = useState()
  const [searchQuery, setSearchQuery] = useState('')
  const [openError, setOpenError] = useState({
    state: false,
    message: '',
  })
  const [notification, setNotification] = useState({
    state: false,
    message: 'whats up',
  })
  const useCustomers = (page, rowsPerPage) => {
    return useMemo(() => {
      const startIndex = page * rowsPerPage
      const endIndex = startIndex + rowsPerPage
      const slicedData = data.slice(startIndex, endIndex)
      return slicedData
    }, [data, page, rowsPerPage])
  }

  const useCustomerIds = (customers) => {
    return useMemo(() => {
      return customers.map((customer) => customer.id)
    }, [customers])
  }

  useEffect(() => {
    const NotificationResult = async () => {
      try {
        const response = await Axiosinstance.get(
          `api/reservations/${editInfo.reservationID}`,
        )
        let resData = []
        resData.push(response.data)
        setData(resData)
      } catch (error) {
        setOpenError({
          state: true,
          message: error.response.data.error,
        })
        console.error('Error occurred while fetching data:', error)
      }
    }
    const fetchData = async () => {
      try {
        const response = await Axiosinstance.get(
          `api/reservations?ID=${editInfo.id}&category=${editInfo.category}&page=1&count=50`,
        )
        // setCPage(cPage + 1)
        setData(response.data.reservations)
        setAxiosPageCount(response.data.totalPages)
      } catch (error) {
        console.error('Error occurred while fetching data:', error)
      }
    }
    if (editInfo) {
      if (editInfo.notification === true) {
        NotificationResult()
      } else {
        fetchData()
      }
    } else {
      router.replace('/services')
    }
  }, [reload, editInfo])
  // useEffect(() => {
  //   const NotificationResult = async () => {
  //     if (searchQuery === '') {
  //       setReload(Math.random())
  //     }
  //     try {
  //       const response = await Axiosinstance.get(
  //         `api/reservations/${editInfo.reservationID}`,
  //       )
  //       let resData = []
  //       resData.push(response.data)
  //       setData(resData)
  //     } catch (error) {
  //       setOpenError({
  //         state: true,
  //         message: error.response.data.error,
  //       })
  //       console.error('Error occurred while fetching data:', error)
  //     }
  //   }
  //   if (editInfo && editInfo.reservationID) NotificationResult()
  // }, [editInfo])
  useEffect(() => {
    // fetchSearch()
    if (editInfo)
      socket.on(`reserve:${editInfo.id}`, (updatedData) => {
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
      setPage(value)
      console.log(data)
      console.log({ count: data.length, page: value })

      if (axiosPageCount >= value) {
        if (data.length - (value + 1) * rowsPerPage <= 0) {
          try {
            const response = await Axiosinstance.get(
              `api/reservations?ID=${editInfo.id}&category=${
                editInfo.category
              }&page=${value + 1}&count=${rowsPerPage}`,
            )
            setData((prevData) => [...prevData, ...response.data.reservations])
            setAxiosPageCount(response.data.totalPages)
          } catch (error) {
            console.error('Error occurred while fetching data:', error)
          }
        }
      }
    },
    [axiosPageCount, data, rowsPerPage],
  )
  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value)
  }, [])
  const handleSearch = (event) => {
    setSearchQuery(event.target.value)
  }

  const fetchSearch = async () => {
    if (searchQuery === '') {
      try {
        const response = await Axiosinstance.get(
          `api/reservations?ID=${editInfo.id}&category=${editInfo.category}&page=1&count=50`,
        )
        // setCPage(cPage + 1)
        setData(response.data.reservations)
        setAxiosPageCount(response.data.totalPages)
      } catch (error) {
        console.error('Error occurred while fetching data:', error)
      }
    }
    // if (editInfo) {
    //   if (editInfo.notification === true) {
    //     NotificationResult()
    //   } else {
    //     fetchData()
    //   }
    // } else {
    //   router.replace('/services')
    // }

    //   setReload(Math.random())

    try {
      const response = await Axiosinstance.get(
        `api/reservations/${searchQuery}`,
      )
      let resData = []
      resData.push(response.data)
      setData(resData)
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
  const handleCloseNotification = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setNotification({
      state: false,
      message: '',
    })
  }
  const handleExportPDF = () => {
    const doc = new jsPDF()
    doc.autoTable({
      head: [
        [
          'Name',
          'Ticket ID',
          'Phone',
          'Version',
          'People',
          'Date',
          'Time',
          'Status',
        ],
      ],
      body: items.map((customer) => [
        customer.firstName + ' ' + customer.lastName,
        customer.ticketID,
        customer.phoneNumber,
        customer.isPremium ? 'VIP' : 'Normal',
        customer.people,
        readableDate,
        createdAt,
        customer.isPaid ? 'Paid' : 'Unpaid',
      ]),
    })
    doc.save('table.pdf')
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

            <CustomersTable
              reload={(reload) => setReload(reload)}
              res={editInfo ? editInfo.id : null}
              category={editInfo ? editInfo.category : null}
              count={data.length}
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
      <Snackbar
        open={notification.state}
        autoHideDuration={3000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseNotification}
          variant="filled"
          severity="error"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  )
}

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>

export default Page
