import PropTypes from 'prop-types'
import ArrowDownIcon from '@heroicons/react/24/solid/ArrowDownIcon'
import ArrowUpIcon from '@heroicons/react/24/solid/ArrowUpIcon'
import {
  Avatar,
  Card,
  CardContent,
  Stack,
  SvgIcon,
  Typography,
} from '@mui/material'
import TicketIcon from '@heroicons/react/24/solid/TicketIcon'
import { useRouter } from 'next/router'

export const OverviewBudget = (props) => {
  const { difference, positive = false, sx, value } = props
  const router = useRouter()

  return (
    <Card sx={sx} onClick={() => router.push('/reservations')}>
      <CardContent>
        <Stack
          alignItems="flex-start"
          direction="row"
          justifyContent="space-between"
          spacing={3}
        >
          <Stack spacing={1}>
            <Typography color="text.secondary" variant="overline">
              Reservations
            </Typography>
            <Typography variant="h4">{value}</Typography>
          </Stack>
          <Avatar
            sx={{
              backgroundColor: 'error.main',
              height: 56,
              width: 56,
            }}
          >
            <SvgIcon>
              <TicketIcon />
            </SvgIcon>
          </Avatar>
        </Stack>
        {difference && (
          <Stack alignItems="center" direction="row" spacing={2} sx={{ mt: 2 }}>
            <Stack alignItems="center" direction="row" spacing={0.5}>
              <SvgIcon color={positive ? 'success' : 'error'} fontSize="small">
                {positive ? <ArrowUpIcon /> : <ArrowDownIcon />}
              </SvgIcon>
              <Typography
                color={positive ? 'success.main' : 'error.main'}
                variant="body2"
              >
                {difference}
              </Typography>
            </Stack>
            <Typography color="text.secondary" variant="caption">
              Event Booked
            </Typography>
          </Stack>
        )}
      </CardContent>
    </Card>
  )
}

OverviewBudget.prototypes = {
  difference: PropTypes.number,
  positive: PropTypes.bool,
  sx: PropTypes.object,
  value: PropTypes.string.isRequired,
}
