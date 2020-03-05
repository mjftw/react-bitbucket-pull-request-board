import courier from './courier'
import getEnv from '../env'

export default function getBitbucketData(repoNames) {
    const workspaceName = getEnv().bitbucket.workspaceName;

    let bbData = {
        users: {},
        repos: {},
        projects: {}
    };

    return Promise.all(repoNames.map(repoName =>
        bitbucketCourier(
            bitbucketRepoRootUrl(workspaceName, repoName)
        ).then(repoData => {
            return repoData;
        })));
}

function bitbucketCourier(url) {
    let params = {
        access_token: getEnv().bitbucket.accessToken
    };
    return courier(url, null, params);
}

function bitbucketRepoRootUrl(workspaceName, repoName) {
    const bitbucket_api_basurl = 'https://api.bitbucket.org/2.0';
    return `${bitbucket_api_basurl}/repositories/${workspaceName}/${repoName}`
}





