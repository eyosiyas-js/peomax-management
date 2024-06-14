import Head from 'next/head'
import {
  Box,
  Container,
  Stack,
  Typography,
  Unstable_Grid2 as Grid,
} from '@mui/material'
import { useAuth } from 'src/hooks/use-auth'
import React from 'react'
import { AccountProfileDetails2 } from 'src/components/addRestaurant/step1/account-profile-details copy2'

const Step1 = ({ clicked, done }) => {

  const [restaurants, setRestaurants] = React.useState([])

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
                  <AccountProfileDetails2
                    clicked={clicked}
                    done={done}
                    FetchedRestaurants={restaurants}
                  />
                </Grid>
              </Grid>
            </div>
          </Stack>
        </Container>
      </Box>
    </>
  )
}

export default Step1
