import React from 'react'
import InfoBoard from './InfoBoard'
import FilterMenu from './FilterMenu'
import { Main } from 'grommet/components/Main'
import { Box } from 'grommet/components/Box'
import { Grid } from 'grommet/components/Grid'

export default function MainWindow(props) {
    return (
        <Main direction='row'>
            <FilterMenu
                reposSelected={props.reposSelected}
                repoNameSuggestions={props.repoNameSuggestions}
                onSelectionChanged={props.updateRepoList}
            />
            <InfoBoard prData={props.prData} />
        </Main>
    );
}
