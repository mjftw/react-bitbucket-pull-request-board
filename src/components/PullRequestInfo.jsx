import React from 'react';
import { Box } from 'grommet/components/Box'
import GitInfo from './GitInfo'
import UserInfo from './UserInfo'

const PullRequestBox = (props) => (
    <Box
        direction='row'
        border='black'
        background='linear-gradient(45deg, #7edbff 30%, #bcf5ff 90%)'
        height='7em'
        round='small'
        pad={{
            vertical: 'xxsmall', horizontal: 'small'
        }}
        elevation='medium'
        {...props}
    />
);

export default function PullRequestInfo(props) {
    return (
        <PullRequestBox>
            <GitInfo prData={props.prData}></GitInfo>
            <UserInfo prData={props.prData}></UserInfo>
        </PullRequestBox>
    );
}