import React from 'react';
import {Box, Menu, Image} from 'grommet';
import {PulseLoader} from 'react-spinners';
import PredictiveSelect from './PredictiveSelect';
import IntervalPicker from './IntervalPicker';
import {connect} from 'react-redux';
import {setWorkspaceSelection} from '../redux/actions';


function FilterMenu(props) {
    let avatar = null;
    let workspaceName = null;
    if (props.workspaceSelected) {
        avatar = (
            <Box
                height='10em'
                onClick={() => window.open(props.workspaceSelected.workspaceUrl)}
            >
                <Image
                    fit='contain'
                    src={props.workspaceSelected.avatarUrl}
                />
            </Box>
        );
        workspaceName = props.workspaceSelected.displayName;
    }

    let spinner = null;
    if (props.loadingReposSuggestions) {
        spinner = <PulseLoader color='steelBlue' size='0.5em' />;
    }

    return (
        <Box
            direction='column'
            pad='small'
            flex='grow'
        >
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
                <Box width='0.5em' />
                {spinner}
            </Box>
            <Box height='2em' />
            <IntervalPicker
                setInterval={props.setRefreshMins}
                interval={props.refreshMins}
                setEnabled={props.setShouldDataRefresh}
                enabled={props.shouldDataRefresh}
            />
        </Box >
    );
}


export default connect(
    (state) => ({
        workspaceSelected: state.workspaces.selected,
        loadingReposSuggestions: state.repos.loading,
        workspaceSuggestions: state.workspaces.found,
        reposSelected: state.repos.selected,
        repoNameSuggestions: state.repos.found,
    }),
    {
        setWorkspaceSelection
    }
)(FilterMenu);