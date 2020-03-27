import axios from 'axios'

export default function courier(url, payload, params) {
    console.log(`GET: ${url}`)
    return axios.get(url, { params })
        .then(response => response.data);
}