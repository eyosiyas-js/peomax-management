import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography,
} from '@mui/material'

// const user = {
//   avatar: '/assets/avatars/avatar-anika-visser.png',
//   city: 'Los Angeles',
//   country: 'USA',
//   jobTitle: 'Senior Developer',
//   name: 'Anika Visser',
//   timezone: 'GTM-7',
// }

export default function AccountProfile({ user }) {
  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography gutterBottom variant="h5">
            {user.email}
          </Typography>
          <Typography color="text.secondary" variant="body2">
            Role: {user.role}
          </Typography>
          <Typography color="text.secondary" variant="body2">
            {user.name}
          </Typography>
        </Box>
      </CardContent>
      <Divider />
      <CardActions>
        <Button fullWidth variant="text">
          Account Details
        </Button>
      </CardActions>
    </Card>
  )
}
