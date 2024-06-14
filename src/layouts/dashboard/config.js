import ChartBarIcon from '@heroicons/react/24/solid/ChartBarIcon'
import CogIcon from '@heroicons/react/24/solid/CogIcon'
import LockClosedIcon from '@heroicons/react/24/solid/LockClosedIcon'
import ShoppingBagIcon from '@heroicons/react/24/solid/ShoppingBagIcon'
import TicketIcon from '@heroicons/react/24/solid/TicketIcon'

import UserIcon from '@heroicons/react/24/solid/UserIcon'
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu'
import UsersIcon from '@heroicons/react/24/solid/UsersIcon'
import FeaturedPlayListIcon from '@mui/icons-material/FeaturedPlayList'
import { SvgIcon } from '@mui/material'
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';

export const items = [
  {
    title: 'Overview',
    path: '/',
    icon: (
      <SvgIcon fontSize="small">
        <ChartBarIcon />
      </SvgIcon>
    ),
  },

  {
    title: 'My Company',
    path: '/company',
    icon: (
      <SvgIcon fontSize="small">
        <ChartBarIcon />
      </SvgIcon>
    ),
  },
  {
    title: 'Staff',
    path: '/staffs',
    icon: (
      <SvgIcon fontSize="small">
        <UsersIcon />
      </SvgIcon>
    ),
  },

  {
    title: 'Services',
    path: '/services',
    icon: (
      <SvgIcon fontSize="small">
        <ShoppingBagIcon />
      </SvgIcon>
    ),
  },

  {
    title: 'Events',
    path: '/events',
    icon: (
      <SvgIcon fontSize="small">
        <TicketIcon />
      </SvgIcon>
    ),
  },
  {
    title: 'Reservations',
    path: '/reservations',
    icon: (
      <SvgIcon fontSize="small">
        <FeaturedPlayListIcon />
      </SvgIcon>
    ),
  },
  {
    title: 'Manual Reservations',
    path: '/addreservation',
    icon: (
      <SvgIcon fontSize="small">
        <ModeEditOutlineIcon />
      </SvgIcon>
    ),
  },
  {
    title: 'Account',
    path: '/account',
    icon: (
      <SvgIcon fontSize="small">
        <UserIcon />
      </SvgIcon>
    ),
  },
  {
    title: 'Settings',
    path: '/settings',
    icon: (
      <SvgIcon fontSize="small">
        <CogIcon />
      </SvgIcon>
    ),
  },
]
