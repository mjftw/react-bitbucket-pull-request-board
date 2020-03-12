import React from 'react'
import { Box } from 'grommet/components/Box'
import User from './User'

const UserInfoBox = (props) => (
    <Box
        direction='row'
        justify='end'
        margin='0.1em'
        {...props}
    />
);

export default function UserInfo(props) {
    const pr = props.prData;
    return (
        <UserInfoBox>
            <User avatarUrl={pr.author.avatarUrl} name={pr.author.name}></User>
            {pr.reviewers.map(reviewer =>
                <User avatarUrl={reviewer.avatarUrl} key={reviewer.profileUrl}></User>
            )}
        </UserInfoBox>

    )
}
