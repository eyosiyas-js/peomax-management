import axios from 'axios'

const Axiosinstance = axios.create({
  baseURL: 'https://api.peomax.com',
  headers: {
    'Content-Type': 'application/json', 
  },
})

Axiosinstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      if (window.location.pathname !== '/auth/login')
        window.location.href = '/auth/login' 
    }
    return Promise.reject(error)
  },
)

export default Axiosinstance



