import PropTypes from 'prop-types'
import { format } from 'date-fns'
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Modal,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  makeStyles,
} from '@mui/material'

import { Scrollbar } from 'src/components/scrollbar'

import { useState } from 'react'
import Axiosinstance from 'src/utils/axios'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'

export default function UsersTable(props) {
  const {
    count = 0,
    items = [],
    onDeselectAll,
    onPageChange = () => {},
    onRowsPerPageChange,
    onSelectAll,
    page = 0,
    rowsPerPage = 0,
    selected = [],
    reload,
  } = props
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handlePasswordToggle = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword)
  }

  const handleConfirmPasswordToggle = () => {
    setShowConfirmPassword(
      (prevShowConfirmPassword) => !prevShowConfirmPassword,
    )
  }
  const selectedSome = selected.length > 0 && selected.length < items.length
  const selectedAll = items.length > 0 && selected.length === items.length
  const [anchorEl, setAnchorEl] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadingModal, setLoadingModal] = useState(false)

  const [id, setID] = useState()
  const [openError, setOpenError] = useState({
    state: false,
    message: '',
  })
  const [success, setSucess] = useState({
    state: false,
    message: '',
  })

  const [openModal, setOpenModal] = useState(false)

  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  console.log(items)
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
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Signed Up</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((customer) => {
                const isSelected = selected.includes(customer.id)
                const createdAt = customer.createdAt
                const date = new Date(createdAt)
                const formattedDate = `${
                  date.getMonth() + 1
                }/${date.getDate()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
                // console.log(formattedDate)

                return (
                  <TableRow hover key={customer.id} selected={isSelected}>
                    <TableCell padding="checkbox">
                      <Button
                        disabled={loading}
                        variant="contained"
                        onClick={() => {
                          setID(customer.userID)
                          setLoading(true)
                          console.log(customer.firstName)
                          Axiosinstance.delete(
                            `/api/users/${customer.userID}/ban`,
                          )
                            .then((res) => {
                              reload(Math.random())

                              setLoading(false)
                              setSucess({
                                state: true,
                                message: res.data.message,
                              })
                            })
                            .catch((err) => {
                              console.log(err)
                              setLoading(false)
                              setOpenError({
                                state: true,
                                message: err
                                  ? err.response?.data?.error
                                  : 'Something Went Wrong! Try Again',
                              })
                            })
                        }}
                      >
                        {loading && customer.userID === id ? (
                          <CircularProgress color="success" />
                        ) : customer.isBanned ? (
                          'Unban'
                        ) : (
                          'Ban'
                        )}
                      </Button>
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
                        <Divider />
                      </Menu>
                    </TableCell>
                    <TableCell>
                      <Stack
                        alignItems="center"
                        direction="row"
                        onClick={handleClick}
                        spacing={2}
                      >
                        <Typography variant="subtitle2">
                          {`${customer.firstName} `}
                          {customer.lastName}
                        </Typography>
                      </Stack>
                    </TableCell>

                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.role}</TableCell>

                    <TableCell>{formattedDate}</TableCell>
                    <TableCell>
                      {customer.isBanned ? 'Banned' : 'Active'}
                    </TableCell>
                    <TableCell padding="checkbox">
                      <Button
                        sx={{ width: 180 }}
                        disabled={loading}
                        variant="contained"
                        onClick={() => {
                          setID(customer.userID)
                          setOpenModal(true)
                        }}
                      >
                        {loading ? (
                          <CircularProgress color="success" />
                        ) : (
                          'Change Password'
                        )}
                      </Button>
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
        rowsPerPageOptions={[5, 10, 25]}
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

      <Modal
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        open={openModal}
        onClose={() => setOpenModal(false)}
      >
        <Box sx={{ width: 400 }}>
          <Card sx={{ mx: 'auto', maxWidth: 'sm' }}>
            <CardHeader
              title={
                <Typography variant="h5" component="h2">
                  Password Change
                </Typography>
              }
              subheader={
                <Typography variant="body1">
                  Please enter your password and confirm it.
                </Typography>
              }
              sx={{
                '& .MuiCardHeader-title': { mb: 1 },
                '& .MuiCardHeader-subheader': { mb: 0 },
              }}
            />
            <CardContent sx={{ mt: '-30px' }}>
              <Box
                sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
              >
                <div sx={{ position: 'relative' }}>
                  <TextField
                    id="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    required
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handlePasswordToggle}>
                            {showPassword ? (
                              <VisibilityOffIcon />
                            ) : (
                              <VisibilityIcon />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>
                <div sx={{ position: 'relative' }}>
                  <TextField
                    id="confirm-password"
                    label="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    fullWidth
                    required
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleConfirmPasswordToggle}>
                            {showConfirmPassword ? (
                              <VisibilityOffIcon />
                            ) : (
                              <VisibilityIcon />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>
                <Button
                  fullWidth
                  disabled={!password}
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    if (password !== confirmPassword)
                      return setOpenError({
                        state: true,
                        message: 'Password Does not Match!',
                      })
                    setLoadingModal(true)
                    Axiosinstance.put(`/api/manager/change-password/${id}`, {
                      password,
                      confirmPassword,
                    })
                      .then((res) => {
                        setLoadingModal(false)
                        setSucess({
                          state: true,
                          message: res.data.message,
                        })
                      })
                      .catch((err) => {
                        console.log(err)
                        setLoadingModal(false)
                        setOpenError({
                          state: true,
                          message: err
                            ? err?.response?.data?.error
                            : 'Something went wrong, please Try again',
                        })
                      })
                  }}
                >
                  {loadingModal ? (
                    <CircularProgress color="success" />
                  ) : (
                    'Confirm'
                  )}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Modal>
    </Card>
  )
}

UsersTable.propTypes = {
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
