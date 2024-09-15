import axios from 'axios'

// Set config defaults when creating the instance
export const instance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  headers: {
    Authorization: "Bearer " + localStorage.getItem("logToken"),
  },
});

// let { token } = useSelector((state) => ({ ...state.loginStore }))

// Alter defaults after instance has been created
// instance.defaults.headers.common['Authorization'] = localStorage.getItem("logToken");