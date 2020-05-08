import React from 'react';
import {Box, Text} from 'grommet';
import GitInfo from './GitInfo';
import UserInfo from './UserInfo';
import LiveTimeSince from './LiveTimeSince';

const PullRequestBox = (props) => (
    <Box
        direction='row'
        border={true}
        background={props.approved ?
            'linear-gradient(45deg, #8ee2c1 30%, #c8f4e6 90%)' :
            'linear-gradient(45deg, #7edbff 30%, #bcf5ff 90%)'
        }
        round='small'
        flex='shrink'
        pad={{
            vertical: 'xsmall', horizontal: 'small'
        }}
        margin='0.2em'
        elevation='medium'
        {...props}
    >
        {props.children}
    </Box>
);

function getApprovedStatus(reviewersInfo, policyAllMustApprove) {
    let allApproved = true;
    let anyApproved = false;

    reviewersInfo.forEach(reviewer => {
        if (reviewer.approved) {
            anyApproved = true;
        }
        else {
            allApproved = false;
        }
    });

    return policyAllMustApprove ? allApproved : anyApproved;
}

export default function PullRequestInfo(props) {
    const approved = getApprovedStatus(props.prData.reviewers, false);

    return (
        <PullRequestBox approved={approved}>
            <Box flex='grow' direction='column'>
                <GitInfo prData={props.prData} />
                <Box height='0.5em' />
                <Text size='1em' color='dark-3'>
                    Refreshed <LiveTimeSince timestamp={props.prData.dataFetchDate} />
                </Text>
            </Box>
            <Box width='3em' />
            <UserInfo prData={props.prData} />
        </PullRequestBox>
    );
}