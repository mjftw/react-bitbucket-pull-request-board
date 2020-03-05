import courier from './courier'
import getEnv from '../env'

export default function getBitbucketData(repoNames) {
    const workspaceName = getEnv().bitbucket.workspaceName;

    let bbData = {
        users: {},
        repos: {},
        projects: {}
    };

    return Promise.all(repoNames.map(async repoName => {
        let repoData = await bitbucketCourier(
            bitbucketRepoRootUrl(workspaceName, repoName)
        );

        bbData.repos[repoData.slug] = {
            projectKey: repoData.project.key,
            pullRequests: {},
        };

        bbData.RAWDATA = repoData;

        let prData = await bitbucketCourier(repoData.links.pullrequests.href);
        prData.values.map(prDataItem => {
            let prId = prDataItem.id;
            bbData.repos[repoName].pullRequests[prId] = {
                RAWDATA: prDataItem,
                title: prDataItem.title,
                open: prDataItem.state === "OPEN",
                createdDatetime: prDataItem,
                updatedDatetime: prDataItem.updated_on
            };
        });
    })).then(() => bbData);
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





