import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
import PropTypes from 'prop-types'
import ArrowTopRightOnSquareIcon from '@heroicons/react/24/solid/ArrowTopRightOnSquareIcon'
import ChevronUpDownIcon from '@heroicons/react/24/solid/ChevronUpDownIcon'
import {
  Box,
  Button,
  Divider,
  Drawer,
  Stack,
  SvgIcon,
  Typography,
  useMediaQuery,
} from '@mui/material'
import { Logo } from 'src/components/logo'
import { Scrollbar } from 'src/components/scrollbar'
import { items } from './config'
import { SideNavItem } from './side-nav-item'
import { useAuth } from 'src/hooks/use-auth'

export const SideNav = (props) => {
  const { open, onClose } = props
  const pathname = usePathname()
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'))
  const { user } = useAuth()

  const content = (
    <Scrollbar
      sx={{
        height: '100%',
        '& .simplebar-content': {
          height: '100%',
        },
        '& .simplebar-scrollbar:before': {
          background: 'neutral.400',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box
            sx={{
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              borderRadius: 1,
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              mt: 2,
              p: '12px',
            }}
          >
            <div>
              <Typography color="inherit" variant="subtitle1">
                PeoMax
              </Typography>
              <Typography color="neutral.400" variant="body2">
                #1 Reservation System
              </Typography>
            </div>
            <SvgIcon fontSize="small" sx={{ color: 'neutral.500' }}>
              <ChevronUpDownIcon />
            </SvgIcon>
          </Box>
        </Box>
        <Divider sx={{ borderColor: 'neutral.700' }} />
        <Box
          component="nav"
          sx={{
            flexGrow: 1,
            px: 2,
            py: 3,
          }}
        >
          <Stack
            component="ul"
            spacing={0.5}
            sx={{
              listStyle: 'none',
              p: 0,
              m: 0,
            }}
          >
            {items.map((item) => {
              // Check if the item's title is "Reservations" or "Services" for employee role
              if (
                user.role === 'employee' &&
                item.title !== 'Reservations' &&
                item.title !== 'Services' &&
                item.title !== 'Manual Reservations' &&
                item.title !== 'Account'
              ) {
                // If it is not "Reservations" or "Services" for employee, skip rendering this item
                return null
              }

              // Check if the item's title is "Reservations" for non-employee role
              // if (user.role !== 'employee' && item.title === 'Reservations') {
              //   // If it is "Reservations" for non-employee, skip rendering this item
              //   return null
              // }

              const active = item.path ? pathname === item.path : false

              return (
                user.ID && (
                  <SideNavItem
                    active={active}
                    disabled={item.disabled}
                    external={item.external}
                    icon={item.icon}
                    key={item.title}
                    path={item.path}
                    title={item.title}
                  />
                )
              )
            })}
          </Stack>
        </Box>
        <Divider sx={{ borderColor: 'neutral.700' }} />
      </Box>
    </Scrollbar>
  )

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: 'neutral.800',
            color: 'common.white',
            width: 280,
          },
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    )
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: 'neutral.800',
          color: 'common.white',
          width: 280,
        },
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  )
}

SideNav.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
}
