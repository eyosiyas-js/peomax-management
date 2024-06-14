import Head from 'next/head'
import { Box, Container, Unstable_Grid2 as Grid } from '@mui/material'
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout'
import { OverviewBudget } from 'src/sections/overview/overview-budget'
import { OverviewSales } from 'src/sections/overview/overview-sales'
import { OverviewTasksProgress } from 'src/sections/overview/overview-tasks-progress'
import { OverviewTotalCustomers } from 'src/sections/overview/overview-total-customers'
import { OverviewTotalProfit } from 'src/sections/overview/overview-total-profit'
import { OverviewTraffic } from 'src/sections/overview/overview-traffic'
import { useEffect, useState } from 'react'
import Axiosinstance from 'src/utils/axios'
import ProtectedRoute from 'src/guards/ProtectedRoute'

const now = new Date()

const Page = () => {
  const [overView, setOverView] = useState()
  const [reservations, setReservations] = useState({
    rejected: 0,
    accepted: 0,
    pending: 0,
    attended: 0,
  })
  useEffect(() => {
    const fetchData = async () => {
      await Axiosinstance.get('/api/overview')
        .then((res) => {
          console.log(res.data)
          setOverView(res.data)
          setReservations({
            rejected: res.data.reservations.rejected,
            accepted: res.data.reservations.accepted,
            pending: res.data.reservations.pending,
            attended: res.data.reservations.attended,
          })
        })
        .catch((err) => {
          console.log(err.response.data)
        })
    }
    fetchData()
  }, [])
  useEffect(() => {
    console.log(overView)
  }, [overView])
  const { pending, accepted, rejected, attended } = reservations
  const chartSeries = [rejected, accepted, pending, attended]
  console.log(chartSeries)
  return (
    <ProtectedRoute>
      <>
        <Head>
          <title>Overview</title>
        </Head>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            py: 8,
          }}
        >
          <Container maxWidth="xl">
            <Grid container spacing={3}>
              <Grid xs={12} sm={6} lg={3}>
                <OverviewBudget
                  difference={overView ? overView.events.tickets : '0'}
                  positive
                  sx={{ height: '100%' }}
                  value={overView ? overView.reservations.total : '0'}
                />
              </Grid>
              <Grid xs={12} sm={6} lg={3}>
                <OverviewTasksProgress
                  sx={{ height: '100%' }}
                  value={overView ? overView.events.tickets : '0'}
                  value1={overView ? overView.events.attended : '0'}
                />
              </Grid>
              <Grid xs={12} sm={6} lg={3}>
                <OverviewTotalCustomers
                  difference={overView ? overView.users.supervisors : '0'}
                  positive={false}
                  sx={{ height: '100%' }}
                  value={overView ? overView.users.total : '0'}
                />
              </Grid>
              <Grid xs={12} sm={6} lg={3}>
                <OverviewTotalProfit
                  sx={{ height: '100%' }}
                  value={overView ? overView.reservations.total : '1'}
                  value1={overView ? overView.reservations.attended : '1'}
                />
              </Grid>
              <Grid xs={12} lg={8}>
                <OverviewSales
                  chartSeries={[
                    {
                      name: 'Reservations',
                      data: overView && overView.reservations.perMonth,
                      // data: [1000, 16, 5, 8, 3, 14, 14, 16, 17, 19, 18, 20],
                    },
                    {
                      name: 'Event ',
                      data: overView && overView.events.perMonth,
                      // data: [12, 11, 4, 6, 2, 9, 9, 10, 11, 12, 13, 13],
                    },
                  ]}
                  sx={{ height: '100%' }}
                />
              </Grid>
              <Grid xs={12} md={6} lg={4}>
                <OverviewTraffic
                  chartSeries={chartSeries}
                  labels={['Rejected', 'Approved', 'Pending', 'Attended']}
                  sx={{ height: '100%' }}
                />
              </Grid>
              <Grid xs={12} md={6} lg={4}></Grid>
            </Grid>
          </Container>
        </Box>
      </>
    </ProtectedRoute>
  )
}
Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>

export default Page
