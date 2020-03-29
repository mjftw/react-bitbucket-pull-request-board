import axios from 'axios'

export default function courier(url, payload, params) {
    // console.log(`GET: ${url}`)
    return axios.get(url, { params })
        .then(response => response.data);
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function retryFailedRequest(error) {
    const tooManyRequestsErrMsg = 'Request failed with status code 429';

    // If error is "Too many requests", wait 5s and retry
    if (error.message === tooManyRequestsErrMsg) {
        const waitTimeMs = 5000;
        console.log(`GET failed: ${error.config.url}\nStatus 429: Too many requests.\nRetrying in ${waitTimeMs}ms...`);

        return delay(waitTimeMs).then(() => axios(error.config));
    }

    throw error;
}

axios.interceptors.response.use(undefined, retryFailedRequest);