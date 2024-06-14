import PropTypes from 'prop-types'
import ListBulletIcon from '@heroicons/react/24/solid/ListBulletIcon'
import {
  Avatar,
  Box,
  Card,
  CardContent,
  LinearProgress,
  Stack,
  SvgIcon,
  Typography,
} from '@mui/material'
import { useRouter } from 'next/router'

export const OverviewTasksProgress = (props) => {
  const router = useRouter()
  const { value, sx, value1 } = props
  const calculatePercentage = (numerator, denominator) => {
    const percentage = (numerator / denominator) * 100
    return percentage.toFixed(2) // Format to two decimal places
  }

  return (
    <Card onClick={() => router.push('/tickets')} sx={sx}>
      <CardContent>
        <Stack
          alignItems="flex-start"
          direction="row"
          justifyContent="space-between"
          spacing={3}
        >
          <Stack spacing={1}>
            <Typography color="text.secondary" gutterBottom variant="overline">
              Event Reservations
            </Typography>
            {/* <Typography variant="h4">{value}%</Typography>s */}
            <Typography variant="h4">{value}</Typography>
          </Stack>
          <Avatar
            sx={{
              backgroundColor: 'warning.main',
              height: 56,
              width: 56,
            }}
          >
            <SvgIcon>
              <ListBulletIcon />
            </SvgIcon>
          </Avatar>
        </Stack>
        <Box sx={{ mt: 3 }}>
          <LinearProgress
            value={calculatePercentage(value1, value)}
            variant="determinate"
          />
          {calculatePercentage(value1, value)}% Attended
        </Box>
      </CardContent>
    </Card>
  )
}

OverviewTasksProgress.propTypes = {
  value: PropTypes.number.isRequired,
  sx: PropTypes.object,
}
