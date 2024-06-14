import {
  Box,
  Button,
  CardContent,
  CircularProgress,
  Collapse,
  Grid,
  IconButton,
  Modal,
  Rating,
  Typography,
  styled,
  useTheme,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import VerifiedIcon from '@mui/icons-material/Verified'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import AddRoadIcon from '@mui/icons-material/AddRoad'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import HomeWorkIcon from '@mui/icons-material/HomeWork'
import LocalParkingIcon from '@mui/icons-material/LocalParking'
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus'
import MoreIcon from '@mui/icons-material/More'
import DinnerDiningIcon from '@mui/icons-material/DinnerDining'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import GirlIcon from '@mui/icons-material/Girl'
import PaidIcon from '@mui/icons-material/Paid'
import LocalPhoneIcon from '@mui/icons-material/LocalPhone'
import LanguageIcon from '@mui/icons-material/Language'
import { useAuth } from 'src/hooks/use-auth'
import { ExpandMore } from '@mui/icons-material'
import Link from 'next/link'
import Axiosinstance from 'src/utils/axios'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { addCompanyInfo, selectCompanyInfo } from 'src/redux/features/userSlice'
export default function CompanyDetails() {
  const theme = useTheme()
  const { user } = useAuth()
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const [expanded, setExpanded] = React.useState(false)
  const dispatch = useDispatch()
  const companyInfo = useSelector(selectCompanyInfo)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      try {
        const restaurantsResponse = await Axiosinstance.get(
          `/api/${user.category}s/${user.ID}`,
        )
        setRestaurants(restaurantsResponse.data)
        console.log(user.ID)
        console.log(restaurantsResponse.data)
        dispatch(addCompanyInfo(restaurantsResponse.data))
        setLoading(false)
      } catch (error) {
        console.log(error)
      }
    }

    if (!companyInfo) {
      fetchData()
      console.log('feteched')

    } else {
      setRestaurants(companyInfo)
      console.log('seted')
    }
  }, [])

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }
  if (loading)
    return (
      <Grid
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Grid>
    )
  return (
    <Grid>
      <Grid
        container
        justifyContent="center"
        sx={{ position: 'relative', marginTop: '10px' }}
      >
        <Grid
          item
          xs={12}
          sx={{
            position: 'absolute',
            width: '100%',
            height: '32px',
            backgroundImage:
              'linear-gradient(to top, rgba(0, 0, 0, 0.1), transparent)',
            bottom: 0,
            zIndex: 20,
          }}
        />
        <Grid item xs={12} sx={{ maxWidth: '600px' }}>
          <Carousel
            autoPlay
            infiniteLoop
            showStatus={false}
            showIndicators={false}
            showThumbs={false}
            interval={10000}
            swipeable={true}
          >
            {restaurants.images &&
              restaurants.images.map((image) => (
                <Grid
                  sx={{
                    height: '450px',
                    [theme.breakpoints.down('700')]: {
                      // Styles applied for screen sizes of 'sm' and above
                      // display: 'none',
                      height: '200px',
                    },
                  }}
                >
                  <img style={{ height: '100%' }} src={image} alt={image} />
                </Grid>
              ))}
          </Carousel>
        </Grid>
      </Grid>
      <Typography variant="h3" sx={{ mt: '10px', ml: '5px' }}>
        {restaurants.name}
        <span style={{ marginLeft: '10px' }}>
          <VerifiedIcon sx={{ color: 'blue' }} />
        </span>
      </Typography>
      <Grid sx={{ mt: '8px', ml: '8px', display: 'flex' }}>
        <Rating
          name="restaurant-rating"
          value={5}
          precision={0.5}
          readOnly
          sx={{ marginRight: '10px' }}
        />
        <Typography
          sx={{
            alignItems: 'center',
            display: 'flex',
            fontFamily: 'revert-layer',
            fontWeight: '30px',
          }}
        >
          <LocationOnIcon sx={{ color: '#DA3743', marginRight: '5px' }} />
          {restaurants.location}
        </Typography>
      </Grid>

      <Box boxShadow={3} bgcolor="white" mt={3} borderRadius={1} padding={2}>
        <Box>
          <Typography variant="h6" px={2} gutterBottom>
            Description
          </Typography>
          <Typography px={2} variant="body1" color="GrayText">
            {restaurants.description}
          </Typography>
        </Box>
        <Box>
          <Typography variant="h6" px={2} mt={5}>
            Additional Informtion
          </Typography>
          {!expanded && (
            <>
              <Typography
                px={2}
                mt={2}
                sx={{ alignItems: 'start', display: 'flex' }}
                paragraph
              >
                <span style={{ marginRight: '5px' }}>
                  <AddRoadIcon />
                </span>{' '}
                Cross Street: {restaurants.crossStreet}
                ...
              </Typography>
              <Typography
                px={2}
                sx={{ alignItems: 'start', display: 'flex' }}
                paragraph
              >
                <span style={{ marginRight: '5px' }}>
                  <LocalPhoneIcon />
                </span>{' '}
                Phone number : +251931528565
              </Typography>
            </>
          )}

          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </ExpandMore>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent>
              <Typography
                sx={{ alignItems: 'start', display: 'flex' }}
                paragraph
              >
                <span style={{ marginRight: '5px' }}>
                  <AddRoadIcon />
                </span>{' '}
                Cross Street: {restaurants.crossStreet}
              </Typography>
              <Typography
                sx={{ alignItems: 'start', display: 'flex' }}
                paragraph
              >
                <span style={{ marginRight: '5px' }}>
                  <HomeWorkIcon />
                </span>{' '}
                Neighborhood: {restaurants.neighborhood}
              </Typography>
              <Typography
                sx={{ alignItems: 'start', display: 'flex' }}
                paragraph
              >
                <span style={{ marginRight: '5px' }}>
                  <LocalParkingIcon />
                </span>{' '}
                Parking details: {restaurants.parkingDetails}
              </Typography>
              <Typography
                sx={{ alignItems: 'start', display: 'flex' }}
                paragraph
              >
                <span style={{ marginRight: '5px' }}>
                  <DirectionsBusIcon />
                </span>{' '}
                Public transit : {restaurants.publicTransit}
              </Typography>
              <Typography
                sx={{ alignItems: 'start', display: 'flex' }}
                paragraph
              >
                <span style={{ marginRight: '5px' }}>
                  <MoreIcon />
                </span>{' '}
                Additional : {restaurants.additional}
              </Typography>
              <Typography
                sx={{ alignItems: 'start', display: 'flex' }}
                paragraph
              >
                <span style={{ marginRight: '5px' }}>
                  <DinnerDiningIcon />
                </span>{' '}
                Dining style : {restaurants.diningStyle}
              </Typography>
              <Typography
                sx={{ alignItems: 'start', display: 'flex' }}
                paragraph
              >
                <span style={{ marginRight: '5px' }}>
                  <RestaurantIcon />
                </span>{' '}
                Cuisines : {restaurants.cuisines}
              </Typography>
              <Typography
                sx={{ alignItems: 'start', display: 'flex' }}
                paragraph
              >
                <span style={{ marginRight: '5px' }}>
                  <GirlIcon sx={{ fontSize: '30px' }} />
                </span>{' '}
                Dress code : {restaurants.dressCode}
              </Typography>
              <Typography
                sx={{ alignItems: 'start', display: 'flex' }}
                paragraph
              >
                <span style={{ marginRight: '5px' }}>
                  <PaidIcon />
                </span>{' '}
                Payment options : {restaurants.paymentOptions}
              </Typography>
              <Typography
                sx={{ alignItems: 'start', display: 'flex' }}
                paragraph
              >
                <span style={{ marginRight: '5px' }}>
                  <LocalPhoneIcon />
                </span>{' '}
                Phone number : {restaurants.phoneNumber}
              </Typography>
              <Typography
                sx={{ alignItems: 'start', display: 'flex' }}
                paragraph
              >
                <span style={{ marginRight: '5px' }}>
                  <LanguageIcon />
                </span>{' '}
                Website :{' '}
                <Link legacyBehavior href={restaurants.website}>
                  <a>{restaurants.website}</a>
                </Link>
              </Typography>
            </CardContent>
          </Collapse>
        </Box>
      </Box>

      <Grid
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          mb: 4,
        }}
      >
        <Button
          onClick={() => router.push('/company/edit')}
          sx={{
            mt: 10,
            width: '300px',
            height: '50px',
            bgcolor: '#DA3743',
            color: 'white',
            '&:hover': {
              backgroundColor: 'red',
            },
          }}
        >
          Edit
        </Button>
      </Grid>
    </Grid>
  )
}
