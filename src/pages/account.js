import Head from 'next/head'
import {
  Box,
  Container,
  Stack,
  Typography,
  Unstable_Grid2 as Grid,
  CircularProgress,
} from '@mui/material'
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout'
import lazy from 'src/utils/lazy'

const AccountProfile = lazy(() =>
  import('src/sections/account/account-profile'),
)
const AccountProfileDetails = lazy(() =>
  import('src/sections/account/account-profile-details'),
)
import { useAuth } from 'src/hooks/use-auth'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addRestaurants, selectRestaurant } from 'src/redux/features/userSlice'
import Axiosinstance from 'src/utils/axios'
import { Avatar, Card, CardContent, Link } from '@mui/material'
import { styled } from '@mui/system'
import { Person as PersonIcon } from '@mui/icons-material'
import { grey } from '@mui/material/colors'
import Input from '@mui/material/Input'
const Page = () => {
  const dispatch = useDispatch()
  const [restaurants, setRestaurants] = React.useState([])
  const localRestaurants = useSelector(selectRestaurant)
  const [loading, setLoading] = useState(false)

  const { user } = useAuth()
  const StyledAvatar = styled(Avatar)(({ theme }) => ({
    width: theme.spacing(6),
    height: theme.spacing(6),
  }))
  console.log(user)
  const [name, setName] = useState()
  useEffect(() => {
    if (!localRestaurants) {
      setLoading(true)
      Axiosinstance.get(`api/sub-hotels?page=1&count=150`).then((res) => {
        setName(res.data.items[0].name)
        setRestaurants(res.data.items)
        dispatch(addRestaurants(res.data.items))
        setLoading(false)
      })
    } else {
      setRestaurants(localRestaurants)
      setName(localRestaurants[0].name)
    }
  }, [])

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

  if (user.role == 'employee') {
    return (
      <main
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 16px',
        }}
      >
        <Card
          sx={{
            maxWidth: 360,
            width: '100%',
            padding: 3,
            display: 'grid',
          }}
        >
          <Grid container justifyContent="center">
            <StyledAvatar>
              <PersonIcon fontSize="large" />
            </StyledAvatar>
          </Grid>
          <CardContent>
            <Typography mb={3} variant="h5" align="center" gutterBottom>
              User Profile
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Label htmlFor="username">Username</Label>
                <Input
                  disabled
                  id="username"
                  required
                  value={`${user.firstName}  ${user.lastName}`}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <Label htmlFor="email">Email</Label>
                <Input
                  disabled
                  id="email"
                  required
                  type="email"
                  value={user.email}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <Label htmlFor="role">Role</Label>
                <Input
                  disabled
                  id="role"
                  required
                  value={user.role}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <Label htmlFor="section">Service</Label>
                <Input disabled id="section" required value={name} fullWidth />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </main>
    )
  }

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
                <Grid xs={12} md={6} lg={4}>
                  <AccountProfile user={user} />
                </Grid>
                <Grid xs={12} md={6} lg={8}>
                  <AccountProfileDetails FetchedRestaurants={restaurants} />
                </Grid>
              </Grid>
            </div>
          </Stack>
        </Container>
      </Box>
    </>
  )
}

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>

export default Page
const Label = styled('label')({
  fontSize: '0.875rem',
  fontWeight: 500,
  color: grey[800],
  marginBottom: '0.5rem',
  display: 'block',
})
