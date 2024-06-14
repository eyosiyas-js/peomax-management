import { configureStore } from '@reduxjs/toolkit'
import userReducer from './features/userSlice'
import thunk from 'redux-thunk' // Import Redux Thunk middleware

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
})
