import courier from './courier'
import getEnv from '../env'

export default function getBitbucketData(repoNames) {
    const workspaceName = getEnv().bitbucket.workspaceName;

    let bbData = {
        repos: {},
        projects: {}
    };

    return Promise.all(repoNames.map(async repoName => {
        let repoData = await bitbucketCourier(
            bitbucketRepoRootUrl(workspaceName, repoName)
        );

        if (!repoData.slug) {
            return;
        }

        bbData.repos[repoData.slug] = {
            projectKey: repoData.project.key,
            pullRequests: {},
        };

        bbData.RAWDATA = repoData;

        let pullRequestListUrl = repoData.links.pullrequests.href;
        let pdListData = await bitbucketCourier(pullRequestListUrl);
        await Promise.all(pdListData.values.map(async prListDataItem => {
            let pullRequestUrl = `${pullRequestListUrl}/${prListDataItem.id}`;
            let prData = await bitbucketCourier(pullRequestUrl);
            bbData.repos[repoName].pullRequests[prData.id] = {
                title: prData.title,
                open: prData.state === 'OPEN',
                createdDatetime: prData.created_on,
                updatedDatetime: prData.updated_on,
                author: {
                    name: prData.author.display_name,
                    profileUrl: prData.author.links.html.href,
                    avatarUrl: prData.author.links.avatar.href
                },
                reviewers: [],
            };
            prData.participants.map(p => {
                if (p.role === 'REVIEWER') {
                    bbData.repos[repoName].pullRequests[prData.id].reviewers.push({
                        name: p.user.display_name,
                        profileUrl: p.user.links.html.href,
                        avatarUrl: p.user.links.avatar.href,
                        approved: p.approved
                    });
                }
            })
        }));
        // }));
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





