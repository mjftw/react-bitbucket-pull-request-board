import React from 'react'
import Container from '@material-ui/core/Container'
import PullRequestInfo from './PullRequestInfo';

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
            <Container style={{ margin: '0.5rem' }}>
                {props.prData.map(prDataItem =>
                    <PullRequestInfo prData={prDataItem} key={prDataItem.id} ></PullRequestInfo>
                )
                }
            </Container >
        );
    }
}
