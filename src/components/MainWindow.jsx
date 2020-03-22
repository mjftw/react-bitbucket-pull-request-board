import React from 'react'
import InfoBoard from './InfoBoard'
import FilterMenu from './FilterMenu'
import Sidebar from './Sidebar'
import { Main } from 'grommet/components/Main'

export default function MainWindow(props) {
    return (
        <Main direction='row'>
            <Sidebar>
                <FilterMenu
                    reposSelected={props.reposSelected}
                    repoNameSuggestions={props.repoNameSuggestions}
                    onSelectionChanged={props.updateRepoList}
                />
            </Sidebar>
            <InfoBoard prData={props.prData} />
        </Main>
    );
}
