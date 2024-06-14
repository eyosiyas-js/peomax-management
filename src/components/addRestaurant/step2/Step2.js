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
import { addRestaurants, selectRestaurant } from 'src/redux/features/userSlice'
import Axiosinstance from 'src/utils/axios'
import { AccountProfileDetails3 } from './account-profile-details copy3'

const Step2 = ({ clicked, done }) => {
  const { user } = useAuth()
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
                  <AccountProfileDetails3 clicked={clicked} done={done} />
                </Grid>
              </Grid>
            </div>
          </Stack>
        </Container>
      </Box>
    </>
  )
}

export default Step2
