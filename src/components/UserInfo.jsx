import React from 'react'
import Box from '@material-ui/core/Box'
import User from './User'

export default function UserInfo(props) {
    const pr = props.prData;
    return (
        <Box display="flex" margin={'0.1em'}>
            <User avatarUrl={pr.author.avatarUrl}></User>
            {pr.reviewers.map(reviewer =>
                <User avatarUrl={reviewer.avatarUrl}></User>
            )}
        </Box>

    )
}
