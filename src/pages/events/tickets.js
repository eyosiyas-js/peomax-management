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
const CustomersSearch = lazy(() =>
  import('src/sections/customer/customers-search'),
)
import Axiosinstance from 'src/utils/axios'
import { useRouter } from 'next/router'
import { CompaniesSearch } from 'src/sections/companies/companies-search'
import { useAuth } from 'src/hooks/use-auth'
import EventTable from 'src/sections/customer/event-table'
import { useSelector } from 'react-redux'
import { selectEdit } from 'src/redux/features/userSlice'

const socket = io('https://api.peomax.com') // Replace with your server URL

const Page = () => {
  const router = useRouter()
  const { res, category } = router.query
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
  const editInfo = useSelector(selectEdit)

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
    const fetchData = async () => {
      try {
        const response = await Axiosinstance.get(
          `api/tickets/${editInfo.id}/?page=1&count=25`,
        )
        // setCPage(cPage + 1)
        setData(response.data.tickets)
        setAxiosPageCount(response.data.totalPages)
      } catch (error) {
        console.error('Error occurred while fetching data:', error)
      }
    }

    if (editInfo) {
      fetchData()
    } else {
      router.replace('/events')
    }
  }, [reload])
  const handleCloseError = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setOpenError({
      state: false,
      message: '',
    })
  }
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
              `api/tickets/${editInfo.id}/?page=${
                value + 1
              }&count=${rowsPerPage}`,
            )
            setData((prevData) => [...prevData, ...response.data.tickets])
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
      setReload(Math.random())
    }
    try {
      const response = await Axiosinstance.get(`api/ticket/${searchQuery}`)
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
                <Typography variant="h4">Tickets</Typography>
              </Stack>
            </Stack>
            <Grid sx={{ display: 'flex', width: '600px' }}>
              <CompaniesSearch onSearch={handleSearch} />

              <Button onClick={fetchSearch}>Search</Button>
            </Grid>
            <EventTable
              reload={(reload) => setReload(reload)}
              res={res}
              category={category}
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
    </>
  )
}

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>

export default Page
