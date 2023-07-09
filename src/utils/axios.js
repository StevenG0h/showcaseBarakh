import Axios from 'axios'

const axios = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    headers: {
        common:{
            "Accept": 'application/json'
        },
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true,
})

export default axios