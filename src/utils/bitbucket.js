import qs from 'qs';
import courier from './courier';
import getEnv from '../env';

async function getPRData(pullRequestUrl, accessToken, repoSlug) {
    let prData = await bitbucketCourier(pullRequestUrl, accessToken);
    let comments = await getUserCommentCount(prData.links.comments.href, accessToken);

    return {
        dataFetchDate: new Date().toISOString(),
        title: prData.title,
        prUrl: prData.links.html.href,
        repoUrl: prData.source.repository.links.html.href,
        repoName: repoSlug,
        repoDisplayName: prData.source.repository.name,
        id: prData.id,
        repoProjectKey: null, //FIXME: Removed field as not available in prData
        open: prData.state === 'OPEN',
        dateCreated: prData.created_on,
        dateUpdated: prData.updated_on,
        mergeConflicts: await getConflictStatus(prData.links.diff.href, accessToken),
        summary: await getDiffSummary(prData.links.diffstat.href, accessToken),
        branchSource: prData.source.branch.name,
        branchTarget: prData.destination.branch.name,
        author: {
            name: prData.author.display_name,
            profileUrl: prData.author.links.html.href,
            avatarUrl: prData.author.links.avatar.href,
            comments: (prData.author.display_name in comments) ? comments[ prData.author.display_name ] : 0
        },
        reviewers: prData.participants.filter(p => (
            p.role === 'REVIEWER')
        ).map(p => ({
            name: p.user.display_name,
            profileUrl: p.user.links.html.href,
            avatarUrl: p.user.links.avatar.href,
            comments: (p.user.display_name in comments) ? comments[ p.user.display_name ] : 0,
            approved: p.approved
        }))
    };
}

export async function getRepoPRDataPromises(workspaceName, repoName, accessToken) {
    let repoData = await bitbucketCourier(
        bitbucketRepoRootUrl(workspaceName, repoName), accessToken
    );

    if (!repoData.slug) {
        return;
    }

    let pullRequestListUrl = repoData.links.pullrequests.href;
    let prListData = await bitbucketCourier(pullRequestListUrl, accessToken);
    return prListData.values.map(async prItem => (
        await getPRData(`${pullRequestListUrl}/${prItem.id}`, accessToken, repoData.slug)
    ));
}

export function getPrUid(prItem) {
    return `${prItem.repoName} #${prItem.id}`;
}

async function getUserCommentCount(commentsUrl, accessToken) {
    let comments = await bitbucketCourier(commentsUrl, accessToken);
    let userCommentCount = {};
    comments.values.forEach(comment => {
        let userName = comment.user.display_name;
        if (!(userName in userCommentCount)) {
            userCommentCount[ userName ] = 1;
        }
        else {
            userCommentCount[ userName ]++;
        }
    });
    return userCommentCount;
}

export async function getWorkspaces(accessToken) {
    let teamsData = await bitbucketCourier(`${getEnv().bitbucket.apiBaseUrl}/teams`,
        accessToken,
        {
            role: 'member',
            pagelen: 100
        });

    return teamsData.values.map(value => ({
        name: value.username,
        displayName: value.display_name,
        avatarUrl: value.links.avatar.href,
        workspaceUrl: value.links.html.href
    }));
}

export async function getRepoListPage(pageUrl, workspaceName, accessToken) {
    let pageData = null;

    if (!pageUrl) {
        // Get first page of workspace repository list, last updated first
        pageData = await bitbucketCourier(
            `${getEnv().bitbucket.apiBaseUrl}/repositories/${workspaceName}`,
            accessToken,
            {
                sort: '-updated_on',
                pagelen: 100
            }
        );
    }
    else {
        pageData = await courier(pageUrl);
    }

    // Return the repo names from the current page, and url for the next
    return {
        repoNames: pageData.values.map(repo => repo.slug),
        nextPageUrl: (pageData.next !== undefined) ? pageData.next : null
    };
}

async function getConflictStatus(diffUrl, accessToken) {
    let diff = await bitbucketCourier(diffUrl, accessToken);
    return diff.includes('<<<<<<<');
}

async function getDiffSummary(diffstatUrl, accessToken) {
    let diffstat = await bitbucketCourier(diffstatUrl, accessToken);
    let summary = {
        linesAdded: 0,
        linesRemoved: 0
    };

    diffstat.values.forEach(stat => {
        if ('lines_added' in stat) {
            summary.linesAdded += stat.lines_added;
        }
        if ('lines_added' in stat) {
            summary.linesRemoved += stat.lines_removed;
        }
    });

    return summary;
}

function bitbucketCourier(url, accessToken, params) {
    let extraParams = {
        access_token: accessToken
    };
    return courier(url, null, {...params, ...extraParams});
}

function bitbucketRepoRootUrl(workspaceName, repoName) {
    return `${getEnv().bitbucket.apiBaseUrl}/repositories/${workspaceName}/${repoName}`;
}

export function getAccessTokenFromURL() {
    const hashArgs = qs.parse(window.location.hash.slice(1));
    return hashArgs.access_token || null;
}

export function redirectBitbucketOauthUrl() {
    window.location.replace(getEnv().bitbucket.oauthUrl);
}