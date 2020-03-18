import React from 'react'
import { Box } from 'grommet/components/Box'
import { Stack } from 'grommet/components/Stack'
import { Text } from 'grommet/components/Text'
import User from './User'


function UserGroup(props) {
    return (
        <Stack anchor='bottom'>
            <Box direction='column'>
                <Box direction='row' justify='end' margin='0.1em'>
                    {props.children}
                </Box>
                <Box height='0.3em' />
            </Box>
            <Text size='1em'>{props.title}</Text>
        </Stack>
    );
}

export default function UserInfo(props) {
    const pr = props.prData;
    console.log(JSON.stringify(pr, null, 4));
    return (
        <Box direction='row'>
            <UserGroup title='Author'>
                <User
                    avatarUrl={pr.author.avatarUrl}
                    name={pr.author.name}
                    numComments={pr.author.comments}
                />
            </UserGroup>
            <Box width='1em' />
            <UserGroup title='Reviewers'>
                {pr.reviewers.map(reviewer =>
                    <User
                        avatarUrl={reviewer.avatarUrl}
                        key={reviewer.profileUrl}
                        numComments={reviewer.comments}
                    />
                )}
            </UserGroup>
        </Box>
    );
}
