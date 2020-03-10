import React from 'react';
import Container from '@material-ui/core/Container'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'

export default function GitInfo(props) {
    const pr = props.prData;
    return (
        <Container >
            <Grid container spacing={3}>
                <Grid item xs={1}>#{pr.id}</Grid>
                <Grid item xs={11}>{pr.title}</Grid>
            </Grid>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ 'textAlign': 'left' }}>{pr.repoName}</div>
                <div style={{ 'textAlign': 'right' }}>{pr.branchSource}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ 'textAlign': 'left' }}>{pr.repoProjectKey}</div>
                <div style={{ 'textAlign': 'right' }}>{pr.branchTarget}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ 'textAlign': 'left' }}>{pr.timeSinceCreated}</div>
                <div style={{ 'textAlign': 'right' }}>+{pr.summary.linesAdded} | -{pr.summary.linesAdded}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ 'textAlign': 'left' }}>{pr.timeSinceUpdated}</div>
                <div style={{ 'textAlign': 'right' }}>{pr.mergeConflicts ? 'Merge' : 'No merge'} conficts</div>
            </div>
        </Container >
    );
}
//