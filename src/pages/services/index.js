import Head from 'next/head'
import PlusIcon from '@heroicons/react/24/solid/PlusIcon'
import {
  Box,
  Button,
  Container,
  Pagination,
  Stack,
  SvgIcon,
  Typography,
  Unstable_Grid2 as Grid,
} from '@mui/material'
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout'

import { CompanyCard } from 'src/sections/companies/company-card'
import { CompaniesSearch } from 'src/sections/companies/companies-search'
import { useEffect, useState } from 'react'
import Axiosinstance from 'src/utils/axios'
import { useDispatch, useSelector } from 'react-redux'
import {
  addRestaurants,
  editRestaurant,
  selectRestaurant,
} from 'src/redux/features/userSlice'
import { useRouter } from 'next/router'
import { useAuth } from 'src/hooks/use-auth'

// const companies = [
//   {
//     id: '2569ce0d517a7f06d3ea1f24',
//     createdAt: '27/03/2019',
//     description:
//       'Dropbox is a file hosting service that offers cloud storage, file synchronization, a personal cloud.',
//     logo: '/assets/logos/logo-dropbox.png',
//     title: 'Dropbox',
//     downloads: '594',
//   },
// ]

const Page = () => {
  const [restaurants, setRestaurants] = useState([])
  const dispatch = useDispatch()
  const localRestaurants = useSelector(selectRestaurant)
  const [filteredRestaurants, setFilteredRestaurants] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    console.log(user)
    if (user.role === 'employee') {
      dispatch(
        editRestaurant({
          id: user.ID,
          category: user.category,
        }),
      )

      router.push(`/services/view`)
    } else if (!localRestaurants) {
      console.log('api called')

      Axiosinstance.get(`api/sub-hotels`).then((res) => {
        console.log(res.data)
        setRestaurants(res.data.items)
        dispatch(addRestaurants(res.data.items))

        const filtered = res.data.items.filter((restaurant) =>
          restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()),
        )
        setFilteredRestaurants(filtered)
      })
    } else {
      const filtered = localRestaurants.filter((restaurant) =>
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setRestaurants(localRestaurants)
      setFilteredRestaurants(filtered)
    }
  }, [searchQuery])
  const handleSearch = (event) => {
    setSearchQuery(event.target.value)
  }

  return (
    <>
      <Head>
        <title>Restaurants | Peomax</title>
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
                <Typography variant="h4">Sub Services</Typography>
              </Stack>
              <div>
                <Button
                  onClick={() => router.push('/services/add')}
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
            <CompaniesSearch onSearch={handleSearch} />
            <Grid container spacing={3}>
              {filteredRestaurants.map((restaurant) => (
                <Grid xs={12} md={6} lg={4} key={restaurant.id}>
                  <CompanyCard company={restaurant} />
                </Grid>
              ))}
            </Grid>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Pagination count={10} size="small" />
            </Box>
          </Stack>
        </Container>
      </Box>
    </>
  )
}

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>

export default Page
