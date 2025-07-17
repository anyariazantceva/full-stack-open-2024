import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/users'

let token = null

const setToken = newToken => {
    token = `Bearer ${newToken}`
}

const getAll = async () => {
    const response = await axios.get(baseUrl, {
        headers: { Authorization: token }
    })
    return response.data
}

export default { getAll, setToken }