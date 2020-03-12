import React from 'react'
import { Box } from 'grommet/components/Box'
import PullRequestInfo from './PullRequestInfo';

const InfoBox = (props) => (
    <Box
        tag='header'
        direction='column'
        flex='grow'
        justify='between'
        background='light-2'
        pad={{ vertical: 'small', horizontal: 'medium' }}
        elevation='medium'
        {...props}
    />
);

export default function InfoBoard(props) {
    if (props.prData === null || props.prData === undefined) {
        return (
            <h1>Repo data missing</h1>
        );
    }
    else if (props.prData.length === 0) {
        return (
            <h1>No open pull requests to display...</h1>
        );
    }
    else {
        return (
            <InfoBox>
                {props.prData.map(prDataItem =>
                    <PullRequestInfo prData={prDataItem} key={prDataItem.id} ></PullRequestInfo>
                )}
            </InfoBox >
        );
    }
}
