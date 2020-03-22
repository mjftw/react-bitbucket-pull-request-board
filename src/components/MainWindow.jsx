import React from 'react'
import InfoBoard from './InfoBoard'
import FilterMenu from './FilterMenu'
import Sidebar from './Sidebar'
import SpinnerOverlay from './SpinnerOverlay'
import { Box } from 'grommet/components/Box'

export default function MainWindow(props) {
    return (
        <SpinnerOverlay show={props.loadingData}>
            <Box direction='row' height='100vh'>
                <Sidebar>
                    <FilterMenu
                        reposSelected={props.reposSelected}
                        repoNameSuggestions={props.repoNameSuggestions}
                        onSelectionChanged={props.updateRepoList}
                    />
                </Sidebar>
                <InfoBoard
                    prData={props.prData}
                />
            </Box>
        </SpinnerOverlay>
    );
}