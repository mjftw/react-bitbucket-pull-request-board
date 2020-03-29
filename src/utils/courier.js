import axios from 'axios'
import { delay } from './promise'

let cancelSource = axios.CancelToken.source();

export default function courier(url, payload, params) {
    // console.log(`GET: ${url}`)

    // If cancel token used, reset it for new requests
    if (cancelSource.token.reason) {
        cancelSource = axios.CancelToken.source();
    }

    return axios.get(url, {
        params,
        cancelToken: cancelSource.token
    }).then(response => response.data);
}

export function cancelRequests() {
    cancelSource.cancel('Request cancelled by user');
}

function retryFailedRequest(error) {
    const tooManyRequestsErrMsg = 'Request failed with status code 429';

    // If request cancelled by user do not continue
    if (axios.isCancel(error)) {
        console.log(error.message);
        throw error;
    }

    // If error is "Too many requests", wait 5s and retry
    if (error.message === tooManyRequestsErrMsg) {
        const waitTimeMs = 5000;
        console.log(`GET failed: ${error.config.url}\nStatus 429: Too many requests.\nRetrying in ${waitTimeMs}ms...`);

        return delay(waitTimeMs).then(() => axios(error.config));
    }

    throw error;
}

axios.interceptors.response.use(undefined, retryFailedRequest);