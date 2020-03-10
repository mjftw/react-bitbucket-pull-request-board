import React from 'react'
import Box from '@material-ui/core/Box'

export default function UserInfo(props) {
    const pr = props.prData;
    return (
        <Box display="flex" margin={'0.1em'}>
            <img src={pr.author.avatarUrl}></img>
            {pr.reviewers.map(reviewer =>
                <img src={reviewer.avatarUrl}></img>
            )}
        </Box>

    )
}
