import React from 'react';
import Box from '@material-ui/core/Box'
import styles from '../styles'
import GitInfo from './GitInfo'
import UserInfo from './UserInfo'

export default function PullRequestInfo(props) {
    return (
        <Box className={styles().Box} display="flex" border={1} marginTop={'0.1em'}>
            <GitInfo prData={props.prData}></GitInfo>
            <UserInfo prData={props.prData}></UserInfo>
        </Box>
    );
}