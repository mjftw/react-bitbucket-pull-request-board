import React from 'react'
import { Text } from 'grommet/components/Text'
import { Stack } from 'grommet/components/Stack'
import { FaCommentAlt, FaRegCommentAlt } from 'react-icons/fa'

export default function CommentBubble(props) {
    return (
        <Stack anchor='top'>
            <FaCommentAlt
                size='1.5em'
                fill='white'
            />
            <FaRegCommentAlt
                size='1.5em'
                fill='grey'
            />
            <Text size='0.9em'>
                <b>{props.number}</b>
            </Text>
        </Stack>
    );
}
