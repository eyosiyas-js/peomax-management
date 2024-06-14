import * as React from 'react'
import Box from '@mui/material/Box'
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout'
import { Container } from '@mui/system'
import lazy from 'src/utils/lazy';
const EventStep1 = lazy(() => import('src/components/addEvent/step1/eventStep1'));


export default function Page() {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >

      <Container maxWidth="xl">
        <EventStep1 />
      </Container>
    </Box>
  )
}

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>
