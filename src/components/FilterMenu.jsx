import React from 'react'
import { Box, Text, Menu, Image } from 'grommet'
import { PulseLoader } from 'react-spinners'
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

const AvatarImage = (props) => (
    <Box
        height='10em'
    >
        <Image
            fit='contain'
            {...props}
        />
    </Box>
);

export default function FilterMenu(props) {
    let avatar = null;
    if (props.workspaceSelected) {
        avatar = <AvatarImage src={props.workspaceSelected.avatarUrl} />
    }

    let spinner = null;
    if (props.loadingReposSuggestions) {
        spinner = <PulseLoader color='navy' size='0.7em' />;
    }

    return (
        <FilterBox>
            {avatar}
            <Box height='0.1em' />
            < Menu
                alignSelf='center'
                label='Workspace'
                items={
                    props.workspaceSuggestions.map(workspace => ({
                        label: workspace.displayName,
                        onClick: (() => props.setWorkspaceSelection(workspace))
                    }))
                }
            />
            <hr size='1' width='100%' align='center' />
            <Box height='1em' />

            <Box
                direction='row'
                justify='between'
            >
                <Text>Repo names</Text>
                {spinner}
            </Box>
            <PredictiveTextInput
                selected={props.reposSelected}
                options={props.repoNameSuggestions}
                setSelection={props.setReposSelection}
            />
        </FilterBox >
    );
}
