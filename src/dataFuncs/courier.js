import axios from 'axios'

function courier(url, payload, params) {
    return axios.get(url, { params })
        .then(response => response)
        .catch(error => error);
}

export function bitbucketCourier(path, payload = '', params = {}) {
    const bitbucket_api_basurl = 'https://api.bitbucket.org/2.0';
    const bitbucket_api_key = '' //REDACTED

    let url = `${bitbucket_api_basurl}`;
    if (path) {
        url += `/${path}`;
    }
    params.access_token = `${bitbucket_api_key}`;

    return courier(url, payload, params);
}