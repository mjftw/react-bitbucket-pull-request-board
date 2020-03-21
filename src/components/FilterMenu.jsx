import React from 'react'
import { Box, Text } from 'grommet'
import PredictiveTextInput from './PredictiveTextInput'

const FilterBox = (props) => (
    <Box
        direction='column'
        pad='small'
        flex='grow'
        background='light-2'
        {...props}
    >
        {props.children}
    </Box >
);

export default function FilterMenu(props) {
    return (
        <FilterBox>
            <Text>Repo names</Text>
            <PredictiveTextInput
                options={[
                    'repo1',
                    'repo12',
                    'repo13',
                    'my-first-repository',
                    'my-second-repository',
                    '123-numbers-start',
                    '321-numbers-start'
                ]}
            />

        </FilterBox>
    );
}
