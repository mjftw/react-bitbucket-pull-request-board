import courier from './courier'

async function getPRData(pullRequestUrl, accessToken) {
    let prData = await bitbucketCourier(pullRequestUrl, accessToken);
    let comments = await getUserCommentCount(prData.links.comments.href, accessToken);

    return {
        title: prData.title,
        repoName: prData.source.repository.name,
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

export async function getRepoAllPRData(workspaceName, repoName, accessToken) {
    let repoData = await bitbucketCourier(
        bitbucketRepoRootUrl(workspaceName, repoName), accessToken
    );

    if (!repoData.slug) {
        return;
    }

    let pullRequestListUrl = repoData.links.pullrequests.href;
    let prListData = await bitbucketCourier(pullRequestListUrl, accessToken);
    return Promise.all(prListData.values.map(async prItem => (
        await getPRData(`${pullRequestListUrl}/${prItem.id}`, accessToken)
    )));
}

export async function getReposPRData(workspaceName, repoNames, accessToken) {
    return Promise.all(
        repoNames.map(repoName => getRepoAllPRData(workspaceName, repoName, accessToken))
    ).then(values => {
        let combinedData = [].concat(...values);
        return combinedData;
    });
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

function bitbucketCourier(url, accessToken) {
    let params = {
        access_token: accessToken
    };
    return courier(url, null, params);
}

function bitbucketRepoRootUrl(workspaceName, repoName) {
    const bitbucket_api_basurl = 'https://api.bitbucket.org/2.0';
    return `${bitbucket_api_basurl}/repositories/${workspaceName}/${repoName}`
}





