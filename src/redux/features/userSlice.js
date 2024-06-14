import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    companyInfo: null,
    Restaurants: null,
    RestaurantDetails: null,
    Events: null,
    Edit: null,
    Notification: null,
    NotificationCollection: [],
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload
    },
    logout: (state) => {
      state.user = null
    },
    addRestaurants: (state, action) => {
      state.Restaurants = action.payload
    },
    removeRestaurants: (state) => {
      state.Restaurants = null
    },
    addEvents: (state, action) => {
      state.Events = action.payload
    },
    removeEvents: (state) => {
      state.Events = null
    },
    addRestaurantDetails: (state, action) => {
      state.RestaurantDetails = {
        ...state.RestaurantDetails,
        ...action.payload,
      }
    },
    removeRestaurantDetails: (state) => {
      state.RestaurantDetails = null
    },
    addCompanyInfo: (state, action) => {
      state.companyInfo = action.payload
    },
    removeCompanyInfo: (state) => {
      state.companyInfo = null
    },
    editRestaurant: (state, action) => {
      state.Edit = action.payload
    },
    addNotification: (state, action) => {
      state.Notification = action.payload
    },
    clearNotification: (state) => {
      state.Notification = null
    },
    addNotificationCollection: (state, action) => {
      state.NotificationCollection.push(action.payload)
    },
    removeNotificationCollection: (state, action) => {
      state.NotificationCollection = state.NotificationCollection = state.NotificationCollection.filter(
        (notification) => notification.id !== action.payload,
      )
    },
  },
})

export const {
  login,
  logout,
  addRestaurants,
  removeRestaurants,
  addRestaurantDetails,
  removeRestaurantDetails,
  addEvents,
  removeEvents,
  addCompanyInfo,
  removeCompanyInfo,
  editRestaurant,
  addNotification,
  clearNotification,
  addNotificationCollection,
  removeNotificationCollection,
} = userSlice.actions
export const selectUser = (state) => state.user.user
export const selectRestaurant = (state) => state.user.Restaurants
export const selectRestaurantDetails = (state) => state.user.RestaurantDetails
export const selectEvent = (state) => state.user.Events
export const selectCompanyInfo = (state) => state.user.companyInfo
export const selectEdit = (state) => state.user.Edit
export const selectNotification = (state) => state.user.Notification
export const selectNotificationCollection = (state) =>
  state.user.NotificationCollection

export default userSlice.reducer
