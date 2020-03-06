import React from 'react';
import Box from '@material-ui/core/Box'
import styles from '../styles'
import GitInfo from './GitInfo'

export default function PullRequestInfo(props) {
    return (
        <Box className={styles().Box}>
            <GitInfo prData={props.prData}></GitInfo>
        </Box>
    );
}