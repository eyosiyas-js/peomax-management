import { useCallback, useEffect, useMemo, useState } from 'react'
import Head from 'next/head'
import { subDays, subHours } from 'date-fns'
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon'
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon'
import PlusIcon from '@heroicons/react/24/solid/PlusIcon'
import lazy from 'src/utils/lazy'

import {
  Box,
  Button,
  Container,
  Stack,
  SvgIcon,
  Typography,
} from '@mui/material'
import { useSelection } from 'src/hooks/use-selection'
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout'
const UsersTable = lazy(() => import('src/sections/customer/users-table'))
const CustomersSearch = lazy(() =>
  import('src/sections/customer/customers-search'),
)
import Axiosinstance from 'src/utils/axios'
import { useRouter } from 'next/router'

const now = new Date()

const Page = () => {
  const [data, setData] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [reload, setReload] = useState()
  const router = useRouter()
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
        const response = await Axiosinstance.get(`api/users`)
        setData(response.data)
        console.log(response.data)
        // setData(response.data.reservations)
      } catch (error) {
        console.error('Error occurred while fetching data:', error)
      }
    }

    fetchData()
  }, [reload])

  const customers = useCustomers(page, rowsPerPage)
  const customersIds = useCustomerIds(customers)
  const customersSelection = useSelection(customersIds)
  const handlePageChange = useCallback((event, value) => {
    setPage(value)
  }, [])
  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value)
  }, [])
  return (
    <>
      <Head>
        <title>Users</title>
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
                <Typography variant="h4">Staffs</Typography>
              </Stack>
              <div>
                <Button
                  onClick={() => router.push('/account')}
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
            <CustomersSearch />
            <UsersTable
              reload={(reload) => setReload(reload)}
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
    </>
  )
}

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>

export default Page
