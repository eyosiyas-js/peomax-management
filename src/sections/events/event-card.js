import PropTypes from 'prop-types'
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon'
import ClockIcon from '@heroicons/react/24/solid/ClockIcon'
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Modal,
  Paper,
  Stack,
  SvgIcon,
  Typography,
  useTheme,
} from '@mui/material'
import { useRouter } from 'next/router'
import { editRestaurant } from 'src/redux/features/userSlice'
import { useDispatch } from 'react-redux'
import { DeleteForever } from '@mui/icons-material'
import Axiosinstance from 'src/utils/axios'
import { useState } from 'react'

export default function EventCard(props) {
  const theme = useTheme()
  const { event } = props
  const router = useRouter()
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const handleDelete = (SelectedEvent) => {
    Axiosinstance.delete(`/api/events/${SelectedEvent.eventID}`)
      .then((res) => {
        console.log(res.data)
        window.location.reload()
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <Card
      // onClick={() => {
      //   router.push(`/services/${event.category}/${event.ID}`)
      // }}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <CardContent
        onClick={() => {
          dispatch(
            editRestaurant({
              category: event.name,
              id: event.eventID,
            }),
          )
          router.push(`/events/tickets`)
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            pb: 3,
          }}
        >
          <CardMedia
            component="img"
            sx={{
              height: '200px',
              borderRadius: '10px',
              [theme.breakpoints.down('1300')]: {
                // Styles applied for screen sizes of 'sm' and above
                // display: 'none',
                height: 150,
              },
            }}
            image={event.image}
            alt={event.name}
          />
        </Box>
        <Typography align="center" gutterBottom variant="h5">
          {event.name}
        </Typography>
      </CardContent>
      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        spacing={2}
        sx={{ p: 2 }}
      >
        <Stack alignItems="center" direction="row" spacing={1}>
          <SvgIcon color="action" fontSize="small">
            <ClockIcon />
          </SvgIcon>
          <Typography color="text.secondary" display="inline" variant="body2">
            Total Books - {event.totalBooks}
          </Typography>
        </Stack>
        <Stack
          onClick={() => handleOpen()}
          alignItems="center"
          direction="row"
          spacing={1}
        >
          <SvgIcon color="action" fontSize="small">
            <DeleteForever />
          </SvgIcon>
          <Typography
            sx={{ cursor: 'pointer' }}
            color="text.secondary"
            display="inline"
            variant="body2"
          >
            Delete
          </Typography>
        </Stack>

        <Stack alignItems="center" direction="row" spacing={1}>
          <SvgIcon color="action" fontSize="small">
            <ArrowDownOnSquareIcon />
          </SvgIcon>
          <Button
            onClick={() => {
              dispatch(
                editRestaurant({
                  category: event.category,
                  id: event.eventID,
                }),
              )
              router.push(`/events/edit`)
            }}
            sx={{ cursor: 'pointer' }}
            color="text.secondary"
            display="inline"
            variant="body2"
          >
            Edit
          </Button>
        </Stack>
      </Stack>
      <Modal
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        open={open}
        onClose={handleClose}
      >
        <Paper
          style={{
            padding: 10,
            border: 'none',
            width: '500px',
            backgroundColor: 'white',
            borderRadius: 8,
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.25)',
          }}
        >
          <h2 style={{ color: '#222' }}>
            Are you sure you want to delete this?
          </h2>
          <Typography style={{ color: '#222' }}>
            This action cannot be undone.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button style={{ color: '#222' }} onClick={handleClose}>
              Cancel
            </Button>
            <Button color="error" onClick={() => handleDelete(event)}>
              Delete
            </Button>
          </Box>
        </Paper>
      </Modal>
    </Card>
  )
}

EventCard.propTypes = {
  event: PropTypes.object.isRequired,
}
