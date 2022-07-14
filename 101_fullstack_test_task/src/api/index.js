import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8080/api',
})

export const insertTariffs = tariffs => api.post(`/tariffs`, tariffs)
export const getTariffs = providerId => api.get(`/tariffs/${providerId}`)

const apis = {
    insertTariffs,
    getTariffs
}

export default apis