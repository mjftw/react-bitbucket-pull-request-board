import React from 'react'
import { Image, Box, Stack } from 'grommet'
import { TiTick } from 'react-icons/ti'
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
                </UserBox>,
            <Box direction='row'>
                {props.numComments ? <CommentBubble number={props.numComments} /> : null}
                {props.tick ? <TiTick size='2em' fill='green' /> : null}
            </Box>
        </Stack>
    );
}
