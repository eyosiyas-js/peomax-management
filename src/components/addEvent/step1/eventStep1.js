import Head from 'next/head'
import {
  Box,
  Container,
  Stack,
  Typography,
  Unstable_Grid2 as Grid,
  CircularProgress,
} from '@mui/material'
import { useAuth } from 'src/hooks/use-auth'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { EventStep1FORM } from './eventStep1Form'

const EventStep1 = ({ clicked, done }) => {
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(false)

  const { user } = useAuth()

  if (loading)
    return (
      <Grid
        sx={{
          display: 'flex',
          width: '100%',
          height: '100vh',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress color="error" />
      </Grid>
    )

  return (
    <>
      <Head>
        <title>Account | Peomax</title>
      </Head>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={3}>
            <div>
              <Typography variant="h4">{user.name}</Typography>
            </div>
            <div>
              <Grid container spacing={3}>
                <Grid xs={12} md={12} lg={12}>
                  <EventStep1FORM clicked={clicked} done={done} />
                </Grid>
              </Grid>
            </div>
          </Stack>
        </Container>
      </Box>
    </>
  )
}

export default EventStep1
