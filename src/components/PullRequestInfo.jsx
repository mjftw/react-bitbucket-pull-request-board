import React from 'react';
import { Box } from 'grommet/components/Box'
import GitInfo from './GitInfo'
import UserInfo from './UserInfo'

const PullRequestBox = (props) => (
    <Box
        direction='row'
        border={true}
        background='linear-gradient(45deg, #7edbff 30%, #bcf5ff 90%)'
        round='small'
        justify='between'
        flex={true}
        pad={{
            vertical: 'xsmall', horizontal: 'small'
        }}
        elevation='medium'
        {...props}
    />
);

export default function PullRequestInfo(props) {
    return (
        <PullRequestBox>
            <GitInfo prData={props.prData}></GitInfo>
            <Box width='3em' />
            <UserInfo prData={props.prData}></UserInfo>
        </PullRequestBox>
    );
}