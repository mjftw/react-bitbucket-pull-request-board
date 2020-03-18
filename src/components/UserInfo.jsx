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
    console.log(JSON.stringify(pr, null, 4));
    return (
        <UserInfoBox>
            <User
                avatarUrl={pr.author.avatarUrl}
                name={pr.author.name}
                numComments={pr.author.comments}
            />
            {pr.reviewers.map(reviewer =>
                <User
                    avatarUrl={reviewer.avatarUrl}
                    key={reviewer.profileUrl}
                    numComments={reviewer.comments}
                />
            )}
        </UserInfoBox>

    )
}
