import React from 'react';
import {Text, Box} from 'grommet';
import {FaRegCopyright} from 'react-icons/fa';

export default function Footer(props) {
    const color = 'grey';

    return (
        <Box
            direction='row'
            justify='start'
        >
            <Box width='1em' />
            <FaRegCopyright color={color} size='1em' />
            <Box width='1em' />
            <Text color={color} size='0.7em'> Merlin Webster 2020</Text>
        </Box>
    );
}
