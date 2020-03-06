import courier from './courier'
import getEnv from '../env'


export default async function getPRData(repoNames) {
    const workspaceName = getEnv().bitbucket.workspaceName;

    let bbData = {};

    return Promise.all(repoNames.map(async repoName => {
        let repoData = await bitbucketCourier(
            bitbucketRepoRootUrl(workspaceName, repoName)
        );

        if (!repoData.slug) {
            return;
        }

        let pullRequestListUrl = repoData.links.pullrequests.href;
        let pdListData = await bitbucketCourier(pullRequestListUrl);
        await Promise.all(pdListData.values.map(async prListDataItem => {
            let pullRequestUrl = `${pullRequestListUrl}/${prListDataItem.id}`;
            let prData = await bitbucketCourier(pullRequestUrl);
            let comments = await getUserCommentCount(prData.links.comments.href);

            bbData[prData.id] = {
                title: prData.title,
                repoName: repoName,
                id: prData.id,
                repoProjectKey: repoData.project.key,
                open: prData.state === 'OPEN',
                timeSinceCreated: timeDeltaString(prData.created_on),
                timeSinceUpdated: timeDeltaString(prData.updated_on),
                mergeConflicts: await getConflitStatus(prData.links.diff.href),
                summary: await getDiffSummary(prData.links.diffstat.href),
                branchSource: prData.source.branch.name,
                branchTarget: prData.destination.branch.name,
                author: {
                    name: prData.author.display_name,
                    profileUrl: prData.author.links.html.href,
                    avatarUrl: prData.author.links.avatar.href,
                    comments: (prData.author.display_name in comments) ? comments[prData.author.display_name] : 0
                },
                reviewers: [],
            };
            prData.participants.map(p => {
                if (p.role === 'REVIEWER') {
                    bbData[prData.id].reviewers.push({
                        name: p.user.display_name,
                        profileUrl: p.user.links.html.href,
                        avatarUrl: p.user.links.avatar.href,
                        comments: (p.user.display_name in comments) ? comments[p.user.display_name] : 0,
                        approved: p.approved
                    });
                }
            })
        }));
    })).then(() => Object.keys(bbData).map(key => bbData[key]));
}

async function getUserCommentCount(commentsUrl) {
    let comments = await bitbucketCourier(commentsUrl);
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

async function getConflitStatus(diffUrl) {
    let diff = await bitbucketCourier(diffUrl);
    return diff.includes('<<<<<<<');
}

async function getDiffSummary(diffstatUrl) {
    let diffstat = await bitbucketCourier(diffstatUrl);
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
    timeString += ' ago'
    return timeString;
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





