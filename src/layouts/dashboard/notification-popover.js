import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import PropTypes from 'prop-types'
import {
  Box,
  Card,
  CardContent,
  Divider,
  MenuItem,
  MenuList,
  Popover,
  Typography,
} from '@mui/material'
import { useAuth } from 'src/hooks/use-auth'
import { useDispatch, useSelector } from 'react-redux'
import {
  editRestaurant,
  removeNotificationCollection,
  selectNotificationCollection,
} from 'src/redux/features/userSlice'
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber'
import Axiosinstance from 'src/utils/axios'

export const NotificationPopover = (props) => {
  const { anchorEl, onClose, open } = props
  const router = useRouter()
  const auth = useAuth()
  const notifications = useSelector(selectNotificationCollection)
  const [allData, setAllData] = useState([])
  const dispatch = useDispatch()
  const [finish, setFinish] = useState()
  useEffect(() => {
    Axiosinstance.get(
      '/api/reservations/all/?status=pending&page=1&count=50',
    ).then((res) => {
      setAllData(res.data.reservations)
      setFinish(Math.random(1))
    })
  }, [])
  useEffect(() => {
    setAllData((prevData) => {
      const uniqueData = new Set([...notifications, ...prevData])
      const deduplicatedArray = [...uniqueData]
      console.log({ notifications, allData: deduplicatedArray })

      return deduplicatedArray
    })
  }, [finish, notifications]) // Include fi

  const handleNotification = (notification) => {
    dispatch(
      editRestaurant({
        id: notification.id,
        category: notification.category,
        reservationID: notification.reservationID,
        notification: true,
      }),
    )
    router.push(`/services/view`)
    dispatch(removeNotificationCollection(notification.id))
  }
  function convertISOToFormatted(timestamp) {
    const dtObject = new Date(timestamp)

    const optionsDate = { year: 'numeric', month: '2-digit', day: '2-digit' }
    const formattedDate = dtObject.toLocaleDateString('en-US', optionsDate)

    const optionsTime = { hour: '2-digit', minute: '2-digit', hour12: true }
    const formattedTime = dtObject.toLocaleTimeString('en-US', optionsTime)

    return `${formattedDate} ${formattedTime}`
  }

  // Example usage
  // const timestamp = '2023-08-17T20:24:00.244Z'
  // const { formattedDate, formattedTime } = convertISOToFormatted(timestamp)
  // console.log('Formatted Date:', formattedDate)
  // console.log('Formatted Time:', formattedTime)

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: 'left',
        vertical: 'bottom',
      }}
      onClose={onClose}
      open={open}
      PaperProps={{ sx: { width: 340, height: '100vh' } }}
    >
      <Box
        sx={{
          py: 1.5,
          px: 2,
        }}
      >
        <Typography variant="overline">Notifications</Typography>
      </Box>
      <Divider />
      <MenuList
        disablePadding
        dense
        sx={{
          p: '8px',
          '& > *': {
            borderRadius: 1,
          },
        }}
      >
        {allData.map((notification) => (
          <Card
            onClick={() => handleNotification(notification)}
            sx={{
              borderRadius: '5px',
              height: '70px',
              backgroundColor: '#9DED33', // Light green background color
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'start',
              paddingX: '10px',
            }}
          >
            <ConfirmationNumberIcon
              sx={{ fontSize: 36, color: 'white', marginRight: '1px' }}
            />
            <CardContent>
              <Typography variant="h6" sx={{ mb: '5px' }}>
                {notification.name}
              </Typography>
              <Typography variant="body2">
                {notification.service
                  ? notification.service
                  : `${notification.firstName} ${notification.lastName}`}
              </Typography>
              <Typography variant="h8" sx={{ mb: '5px' }}>
                {convertISOToFormatted(notification.createdAt)}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </MenuList>
    </Popover>
  )
}

NotificationPopover.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
}
