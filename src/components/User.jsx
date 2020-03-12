import React from 'react'
import { Image } from 'grommet/components/Image'
import { Box } from 'grommet/components/Box'

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
        <UserBox>
            <AvatarImage src={props.avatarUrl} />
        </UserBox>
    )
}
