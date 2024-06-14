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

export const OverviewTotalProfit = (props) => {
  const { value, sx, value1 } = props
  const router = useRouter()
  const calculatePercentage = (numerator, denominator) => {
    const percentage = (numerator / denominator) * 100
    return percentage.toFixed(2) // Format to two decimal places
  }

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
            <Typography color="text.secondary" gutterBottom variant="overline">
              Reservation Attended
            </Typography>
            {/* <Typography variant="h4">{value}%</Typography>s */}
            <Typography variant="h4">
              {calculatePercentage(value1, value)}%
            </Typography>
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
        </Box>
      </CardContent>
    </Card>
  )
}

OverviewTotalProfit.propTypes = {
  value: PropTypes.number.isRequired,
  sx: PropTypes.object,
}
