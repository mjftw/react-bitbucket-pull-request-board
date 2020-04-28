import React from 'react'
import { Image, Box, Stack } from 'grommet'
import { TiTick } from 'react-icons/ti'
import CommentBubble from './CommentBubble'

export default function User(props) {
    return (
        <Stack anchor='top-right'>
            <Box
                height='xsmall'
                direction='column'
                onClick={() => window.open(props.profileUrl)}
            >
                <Image
                    fit='contain'
                    fill={true}
                    alignSelf='end'
                    src={props.avatarUrl}
                />
            </Box>
            <Box direction='row'>
                {props.numComments ? <CommentBubble number={props.numComments} /> : null}
                {props.tick ? <TiTick size='2em' fill='green' /> : null}
            </Box>
        </Stack>
    );
}
