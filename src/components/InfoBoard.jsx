import React from 'react'
import Container from '@material-ui/core/Container'
import GitInfo from './GitInfo'
import PullRequestInfo from './PullRequestInfo';

export default function InfoBoard(props) {
    if (props.prData) {
        return (
            <Container style={{ margin: '0.5rem' }}>
                {props.prData.map(prDataItem =>
                    <PullRequestInfo prData={prDataItem}></PullRequestInfo>
                )}
            </Container >
        );
    }
    else {
        return (
            <h1>Repo data missing</h1>
        );
    }
}
