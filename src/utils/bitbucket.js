import courier from './courier'
import getEnv from '../env';

async function getPRData(pullRequestUrl, accessToken, repoSlug) {
    let prData = await bitbucketCourier(pullRequestUrl, accessToken);
    let comments = await getUserCommentCount(prData.links.comments.href, accessToken);

    return {
        title: prData.title,
        repoName: repoSlug,
        repoDisplayName: prData.source.repository.name,
        id: prData.id,
        repoProjectKey: null, //FIXME: Removed field as not available in prData
        open: prData.state === 'OPEN',
        timeSinceCreated: timeDeltaString(prData.created_on),
        timeSinceUpdated: timeDeltaString(prData.updated_on),
        mergeConflicts: await getConflitStatus(prData.links.diff.href, accessToken),
        summary: await getDiffSummary(prData.links.diffstat.href, accessToken),
        branchSource: prData.source.branch.name,
        branchTarget: prData.destination.branch.name,
        author: {
            name: prData.author.display_name,
            profileUrl: prData.author.links.html.href,
            avatarUrl: prData.author.links.avatar.href,
            comments: (prData.author.display_name in comments) ? comments[prData.author.display_name] : 0
        },
        reviewers: prData.participants.filter(p => (
            p.role === 'REVIEWER')
        ).map(p => ({
            name: p.user.display_name,
            profileUrl: p.user.links.html.href,
            avatarUrl: p.user.links.avatar.href,
            comments: (p.user.display_name in comments) ? comments[p.user.display_name] : 0,
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

async function getUserCommentCount(commentsUrl, accessToken) {
    let comments = await bitbucketCourier(commentsUrl, accessToken);
    let userCommentCount = {};
    comments.values.forEach(comment => {
        let userName = comment.user.display_name;
        if (!(userName in userCommentCount)) {
            userCommentCount[userName] = 1;
        }
        else {
            userCommentCount[userName]++;
        }
    })
    return userCommentCount;
}

export async function getWorkspaces(accessToken) {
    let teamsData = await bitbucketCourier(`${getEnv().bitbucket.apiBaseUrl}/teams`,
        accessToken, { role: 'member' });

    return teamsData.values.map(value => ({
        name: value.username,
        displayName: value.display_name,
        avatarUrl: value.links.avatar.href
    }))
}

export async function getRepoListPage(workspaceName, pageUrl, accessToken) {
    let pageData = null;

    if (!pageUrl) {
        // Get first page of workspace repository list, last updated first
        pageData = await bitbucketCourier(
            `${getEnv().bitbucket.apiBaseUrl}/repositories/${workspaceName}`,
            accessToken,
            { sort: '-updated_on' }
        )
    }
    else {
        pageData = await courier(pageUrl);
    }

    // Check if another page of data is available, and create
    // a promise to get if it is
    let getNextPage = null;
    if (pageData.next !== undefined) {
        getNextPage = getRepoListPage(workspaceName, pageData.next, accessToken);
    }

    // Return the repo names from the current page, and a promise to get the next
    return {
        repoNames: pageData.values.map(repo => repo.slug),
        getNextPage: getNextPage
    }
}

async function getConflitStatus(diffUrl, accessToken) {
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

function timeDeltaString(timestamp) {
    let nowTime = Date.now();
    let thenTime = Date.parse(timestamp);
    let msecs = (nowTime - thenTime);
    let secs = Math.floor(msecs / 1000) % 60;
    let mins = Math.floor((msecs / (1000 * 60)) % 60);
    let hours = Math.floor((msecs / (1000 * 60 * 60)) % 24);
    let days = Math.floor((msecs / (1000 * 60 * 60 * 24)) % 7);

    let daysString = () => `${days} day` + (days === 1 ? '' : 's');
    let hoursString = () => `${hours} hour` + (hours === 1 ? '' : 's');
    let minsString = () => `${mins} min` + (mins === 1 ? '' : 's');
    let secsString = () => `${secs} sec` + (secs === 1 ? '' : 's');

    let timeString = '';
    if (days) {
        timeString = `${daysString()}, ${hoursString()}`;
    }
    else if (hours) {
        timeString = `${hoursString()}, ${minsString()}`;
    }
    else if (mins) {
        timeString = `${minsString()}, ${secsString()}`;
    }
    return timeString;
}

function bitbucketCourier(url, accessToken, params) {
    let extraParams = {
        access_token: accessToken
    };
    return courier(url, null, { ...params, ...extraParams });
}

function bitbucketRepoRootUrl(workspaceName, repoName) {
    return `${getEnv().bitbucket.apiBaseUrl}/repositories/${workspaceName}/${repoName}`
}





