import axios from 'axios';
import {delay} from './promise';

let cancelSource = axios.CancelToken.source();
const cancelRequestErrorMessage = 'Request cancelled by user';

export default function courier(url, payload, params) {
    // console.log(`GET: ${url}`)

    // If cancel token used, reset it for new requests
    if (requestsAreCancelled()) {
        cancelSource = axios.CancelToken.source();
    }

    return axios.get(url, {
        params,
        cancelToken: cancelSource.token
    }).then(response => response.data);
}

export function cancelRequests() {
    cancelSource.cancel(cancelRequestErrorMessage);
}

export function requestsAreCancelled() {
    return cancelSource.token.reason !== undefined;
}

function handleRequestError(error) {
    // If request cancelled by user log message
    if (axios.isCancel(error)) {
        throw error.message;
    }

    // If error is "Too many requests", wait 5s and retry
    const tooManyRequestsErrMsg = 'Request failed with status code 429';
    if (error.message === tooManyRequestsErrMsg) {
        const waitTimeMs = 5000;
        console.log(`GET failed: ${error.config.url}\nStatus 429: Too many requests.\nRetrying in ${waitTimeMs}ms...`);

        return delay(waitTimeMs).then(() => axios(error.config));
    }

    throw error;
}

export function errorIs401(error) {
    const error401Message = "Request failed with status code 401";
    return error === error401Message ||
        error.message === error401Message;
}

export function errorIsRequestCancelled(error) {
    return error === cancelRequestErrorMessage ||
        error.message === cancelRequestErrorMessage;
}

axios.interceptors.response.use(undefined, handleRequestError);