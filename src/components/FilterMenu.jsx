import React from 'react'
import { Box, Text } from 'grommet'
import PredictiveTextInput from './PredictiveTextInput'

const FilterBox = (props) => (
    <Box
        direction='column'
        pad='small'
        flex='grow'
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
                selected={props.reposSelected}
                options={props.repoNameSuggestions}
                onSelectionChanged={props.onSelectionChanged}
            />
        </FilterBox>
    );
}
