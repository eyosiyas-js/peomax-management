import PropTypes from 'prop-types'
import { format } from 'date-fns'
import {
  Alert,
  Box,
  Card,
  Checkbox,
  CircularProgress,
  Divider,
  Grid,
  Menu,
  MenuItem,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material'

import { Scrollbar } from 'src/components/scrollbar'

import { useState } from 'react'
import Axiosinstance from 'src/utils/axios'
import { useRouter } from 'next/router'

export default function EventTable(props) {
  const {
    count = 0,
    items = [],
    onDeselectAll,
    onDeselectOne,
    onPageChange = () => {},
    onRowsPerPageChange,
    onSelectAll,
    onSelectOne,
    page = 0,
    rowsPerPage = 0,
    selected = [],
    res,
    category,
    reload,
  } = props

  const selectedSome = selected.length > 0 && selected.length < items.length
  const selectedAll = items.length > 0 && selected.length === items.length
  const [anchorEl, setAnchorEl] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedReservationID, setSelectedReservationID] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedID, setSelectedID] = useState(null)

  const [selectedStatus, setSelectedStatus] = useState(null)
  const router = useRouter()
  const [openError, setOpenError] = useState({
    state: false,
    message: '',
  })
  const [success, setSucess] = useState({
    state: false,
    message: '',
  })
  console.log(router.pathname)
  console.log(items)
  const open = Boolean(anchorEl)
  const handleClick = (
    event,
    reservationID,
    status,
    customerCategory,
    customerID,
  ) => {
    setAnchorEl(event.currentTarget)
    setSelectedReservationID(reservationID)
    setSelectedStatus(status)
    setSelectedCategory(customerCategory)
    setSelectedID(customerID)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleCloseError = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setOpenError({
      state: false,
      message: '',
    })
  }
  const handleCloseSucess = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setSucess({
      state: false,
      message: '',
    })
  }
  if (loading)
    return (
      <Grid sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <CircularProgress color="error" />
      </Grid>
    )
  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedAll}
                    indeterminate={selectedSome}
                    onChange={(event) => {
                      if (event.target.checked) {
                        onSelectAll?.()
                      } else {
                        onDeselectAll?.()
                      }
                    }}
                  />
                </TableCell>
                <TableCell>Name</TableCell>

                <TableCell>Ticket ID</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Version</TableCell>
                <TableCell>People</TableCell>
                <TableCell>Date </TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((customer) => {
                const isSelected = selected.includes(customer.id)
                const createdAt = customer.time
                const timestamp = customer.createdAt
                const date = new Date(timestamp)

                const year = date.getUTCFullYear()
                const month = (date.getUTCMonth() + 1)
                  .toString()
                  .padStart(2, '0') // Months are zero-based, so we add 1
                const day = date.getUTCDate().toString().padStart(2, '0')

                const readableDate = `${month}/${day}/${year}`

                // console.log(readableDate) // Output
                return (
                  <TableRow hover key={customer.id} selected={isSelected}>
                    <TableCell padding="checkbox">
                      {/* <Typography onClick={handleClick}>Approve</Typography> */}
                      {(customer.status === 'pending' &&
                        router.pathname !== '/reservations') ||
                      // customer.status === 'rejected' ||
                      customer.status === 'accepted' ? (
                        <svg
                          onClick={(event) =>
                            handleClick(
                              event,
                              customer.reservationID,
                              customer.status,
                              customer.category,
                              customer.ID,
                            )
                          }
                          style={{ width: '30px', height: '30px' }}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1" // Use camel case for attribute names
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          ></path>
                        </svg>
                      ) : (
                        customer.status
                      )}

                      <Menu
                        anchorEl={anchorEl}
                        id="account-menu"
                        open={open}
                        onClose={handleClose}
                        onClick={handleClose}
                        PaperProps={{
                          elevation: 0,
                          sx: {
                            width: '120px',
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            '& .MuiAvatar-root': {
                              width: 32,
                              height: 32,
                              ml: -0.5,
                              mr: 1,
                            },
                            '&:before': {
                              content: '""',
                              display: 'block',
                              position: 'absolute',
                              top: 0,
                              right: 14,
                              width: 10,
                              height: 10,
                              bgcolor: 'background.paper',
                              transform: 'translateY(-50%) rotate(45deg)',
                              zIndex: 0,
                            },
                          },
                        }}
                        transformOrigin={{
                          horizontal: 'right',
                          vertical: 'top',
                        }}
                        anchorOrigin={{
                          horizontal: 'right',
                          vertical: 'bottom',
                        }}
                      >
                        {selectedStatus === 'pending' && (
                          <MenuItem
                            onClick={() => {
                              setLoading(true)
                              console.log({
                                reservationID: selectedReservationID,
                                ID: customer.ID,
                                category: customer.category,
                              })
                              Axiosinstance.post('/api/reservations/accept', {
                                reservationID: selectedReservationID,
                                ID: customer.ID,
                                category: customer.category,
                              })
                                .then((res) => {
                                  console.log(res.data)
                                  setLoading(false)
                                  reload(Math.random())
                                  setSucess({
                                    state: true,
                                    message: 'Reservation Accepted',
                                  })
                                })
                                .catch((err) => {
                                  console.log(err)
                                  setLoading(false)
                                  setOpenError({
                                    state: true,
                                    message:
                                      'Something went wrong, please try again',
                                  })
                                })
                            }}
                          >
                            <svg
                              fill="none"
                              stroke="currentColor"
                              style={{ width: '20px', height: '20px' }}
                              stroke-width="1.5"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                              aria-hidden="true"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M4.5 12.75l6 6 9-13.5"
                              ></path>
                            </svg>
                            Approve
                          </MenuItem>
                        )}
                        {selectedStatus === 'pending' && (
                          <MenuItem
                            onClick={() => {
                              setLoading(true)
                              Axiosinstance.post('/api/reservations/reject', {
                                reservationID: selectedReservationID,
                                ID: res,
                                category: category,
                              })
                                .then((res) => {
                                  console.log(res.data)
                                  setLoading(false)
                                  reload(Math.random())
                                  setSucess({
                                    state: true,
                                    message: 'Reservation Rejected!',
                                  })
                                })
                                .catch((err) => {
                                  console.log(err)
                                  setLoading(false)
                                  setOpenError({
                                    state: true,
                                    message:
                                      'Something went wrong, please try again',
                                  })
                                })
                            }}
                          >
                            <svg
                              fill="none"
                              stroke="currentColor"
                              stroke-width="1"
                              style={{ width: '25px', height: '25px' }}
                              viewBox="0 0 24 19"
                              xmlns="http://www.w3.org/2000/svg"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                              ></path>
                            </svg>{' '}
                            Reject
                          </MenuItem>
                        )}

                        {selectedStatus == 'accepted' && (
                          <MenuItem
                            onClick={() => {
                              setLoading(true)
                              console.log({
                                reservationID: selectedReservationID,
                                ID: customer.ID,
                                category: customer.category,
                              })
                              Axiosinstance.post('/api/reservations/attended', {
                                reservationID: selectedReservationID,
                                ID: selectedID,
                                category: selectedCategory,
                              })
                                .then((res) => {
                                  console.log(res.data)
                                  setLoading(false)
                                  reload(Math.random())
                                  setSucess({
                                    state: true,
                                    message: 'Reservation Attended!',
                                  })
                                })
                                .catch((err) => {
                                  console.log(err)
                                  setLoading(false)
                                  setOpenError({
                                    state: true,
                                    message:
                                      'Something went wrong, please try again',
                                  })
                                })
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke-width="1.5"
                              stroke="currentColor"
                              class="w-6 h-6"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15M9 12l3 3m0 0l3-3m-3 3V2.25"
                              />
                            </svg>
                            Attended
                          </MenuItem>
                        )}

                        <Divider />
                      </Menu>
                    </TableCell>
                    <TableCell>
                      {customer.firstName} {customer.lastName}
                    </TableCell>

                    <TableCell>{customer.ticketID}</TableCell>
                    <TableCell>{customer.phoneNumber}</TableCell>

                    <TableCell>
                      {customer.isPremium === true ? 'VIP' : 'Normal'}
                    </TableCell>
                    <TableCell>{customer.people}</TableCell>
                    <TableCell>{readableDate}</TableCell>

                    <TableCell>{createdAt}</TableCell>
                    <TableCell>
                      {customer.attended === true ? 'Attended' : 'Not Attended'}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[20, 35, 50]}
      />
      <Snackbar
        open={openError.state}
        autoHideDuration={2000}
        onClose={handleCloseError}
      >
        <Alert
          onClose={handleCloseError}
          variant="filled"
          severity="error"
          sx={{ width: '100%' }}
        >
          {openError.message}
        </Alert>
      </Snackbar>
      <Snackbar
        open={success.state}
        autoHideDuration={3000}
        onClose={handleCloseSucess}
      >
        <Alert
          onClose={handleCloseSucess}
          variant="filled"
          severity="success"
          sx={{ width: '100%' }}
        >
          {success.message}
        </Alert>
      </Snackbar>
    </Card>
  )
}

EventTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onDeselectAll: PropTypes.func,
  onDeselectOne: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSelectOne: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  selected: PropTypes.array,
}
