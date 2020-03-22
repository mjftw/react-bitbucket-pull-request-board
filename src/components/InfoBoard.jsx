import React from 'react'
import { Box } from 'grommet/components/Box'
import PullRequestInfo from './PullRequestInfo'

const InfoBox = (props) => (
    <Box
        tag='header'
        direction='column'
        flex='grow'
        justify='start'
        pad={{ vertical: 'small', horizontal: 'medium' }}
        elevation='medium'
        {...props}
    />
);


export default function InfoBoard(props) {
    let content = null;

    // Loading repo data
    if (props.prData === null || props.prData === undefined) {
        content = null;
    }
    // No open pull request data to display
    else if (props.prData.length === 0) {
        content = <h1>No open pull requests to display...</h1>;
    }
    // Pull request data
    else {
        content = (
            <InfoBox>
                {props.prData.map(prDataItem =>
                    <PullRequestInfo prData={prDataItem} key={prDataItem.id} ></PullRequestInfo>
                )}
            </InfoBox >
        );
    }
    return content;
}
