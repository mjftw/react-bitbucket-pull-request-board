import React from 'react'
import { Image } from 'grommet/components/Image'
import { Box } from 'grommet/components/Box'
import { Stack } from 'grommet/components/Stack'
import CommentBubble from './CommentBubble'

const AvatarImage = (props) => (
    <Image
        fit='contain'
        fill={true}
        alignSelf='end'
        {...props}
    />

);

const UserBox = (props) => (
    <Box
        height='xsmall'
        direction='column'
        {...props}
    />
);

export default function User(props) {
    return (
        <Stack anchor='top-right'>
            <UserBox>
                <AvatarImage
                    src={props.avatarUrl}
                />
            </UserBox>
            {props.numComments ? <CommentBubble number={props.numComments} /> : null}
        </Stack>
    )
}
