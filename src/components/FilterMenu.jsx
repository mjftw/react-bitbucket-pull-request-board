import React from 'react'
import { Box, Menu, Image } from 'grommet'
import { PulseLoader } from 'react-spinners'
import PredictiveSelect from './PredictiveSelect'

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
    let workspaceName = null;
    if (props.workspaceSelected) {
        avatar = <AvatarImage src={props.workspaceSelected.avatarUrl} />
        workspaceName = props.workspaceSelected.displayName
    }

    

    let spinner = null;
    if (props.loadingReposSuggestions) {
        spinner = <PulseLoader color='steelBlue' size='0.5em' />;
    }

    return (
        <FilterBox>
            {avatar}
            <Box height='0.1em' />
            <Menu
                alignSelf='center'
                label={workspaceName}
                items={
                    props.workspaceSuggestions.map(workspace => ({
                        label: workspace.displayName,
                        onClick: (() => props.setWorkspaceSelection(workspace))
                    }))
                }
            />
            <hr size='1' width='100%' align='center' />
            <Box height='1em' />
            <Box direction='row'>
                <PredictiveSelect
                    label='Select repositories'
                    selected={props.reposSelected}
                    options={props.repoNameSuggestions}
                    setSelection={props.setReposSelection}
                    placeholder='Start typing to filter list...'
                    ignoreCase={true}
                />
                <Box width='0.5em'/>
                {spinner}
            </Box>
        </FilterBox >
    );
}
