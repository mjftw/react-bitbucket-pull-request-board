import React from 'react';
import { Box } from 'grommet/components/Box'
import GitInfo from './GitInfo'
import UserInfo from './UserInfo'

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

export default function PullRequestInfo(props) {
    let allApproved = true;
    props.prData.reviewers.forEach(reviewer => {
        if (!reviewer.approved) {
            allApproved = false;
        }
    });

    return (
        <PullRequestBox approved={allApproved}>
            <GitInfo prData={props.prData}></GitInfo>
            <Box width='3em' />
            <UserInfo prData={props.prData}></UserInfo>
        </PullRequestBox>
    );
}