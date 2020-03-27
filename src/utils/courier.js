import axios from 'axios'

export default function courier(url, payload, params) {
    return axios.get(url, { params })
        .then(response => response.data);
}