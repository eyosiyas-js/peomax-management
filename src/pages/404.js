import Head from 'next/head'
import NextLink from 'next/link'
import ArrowLeftIcon from '@heroicons/react/24/solid/ArrowLeftIcon'
import { Box, Button, Container, SvgIcon, Typography } from '@mui/material'
import { useAuth } from 'src/hooks/use-auth'

function Page() {
  const { user } = useAuth()
  return (
    <>
      <Head>
        <title>404 | Peomax</title>
      </Head>
      <Box
        component="main"
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexGrow: 1,
          minHeight: '100%',
        }}
      >
        <Container maxWidth="md">
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box
              sx={{
                mb: 3,
                textAlign: 'center',
              }}
            >
              <img
                alt="Under development"
                src="/assets/errors/404-image.jpg"
                style={{
                  display: 'inline-block',
                  maxWidth: '100%',
                  width: 800,
                }}
              />
            </Box>
            <Typography align="center" sx={{ mb: 3 }} variant="h3">
              404: The page you are looking for isn’t here
            </Typography>
            <Typography align="center" color="text.secondary" variant="body1">
              You either tried some shady route or you came here by mistake.
              Whichever it is, try using the navigation
            </Typography>
            {user && user.role === 'employee' ? (
              <Button
                component={NextLink}
                href="/services"
                startIcon={
                  <SvgIcon fontSize="small">
                    <ArrowLeftIcon />
                  </SvgIcon>
                }
                sx={{ mt: 3 }}
                variant="contained"
              >
                Go back to dashboard
              </Button>
            ) : (
              <Button
                component={NextLink}
                href="/"
                startIcon={
                  <SvgIcon fontSize="small">
                    <ArrowLeftIcon />
                  </SvgIcon>
                }
                sx={{ mt: 3 }}
                variant="contained"
              >
                Go back to dashboard
              </Button>
            )}
          </Box>
        </Container>
      </Box>
    </>
  )
}
export default Page
