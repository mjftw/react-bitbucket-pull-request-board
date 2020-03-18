import React from 'react';
import Container from '@material-ui/core/Container'
import { FaLevelDownAlt } from 'react-icons/fa'
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
                <div style={{ 'textAlign': 'right' }}>{pr.branchSource}<FaLevelDownAlt /></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ 'textAlign': 'left' }}>{pr.repoProjectKey}</div>
                <div style={{ 'textAlign': 'right' }}>{pr.branchTarget}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ 'textAlign': 'left' }}>Created {pr.timeSinceCreated} ago</div>
                <div style={{ 'textAlign': 'right' }}><span style={{ color: 'green' }}>+{pr.summary.linesAdded}</span> | <span style={{ color: 'red' }}>-{pr.summary.linesRemoved}</span></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ 'textAlign': 'left' }}>Updated {pr.timeSinceUpdated}</div>
                <div style={{ 'textAlign': 'right' }}>{pr.mergeConflicts ? <span style={{ color: 'orange' }}>Merge conficts</span> : 'No merge conficts'} </div>
            </div>
        </Container >
    );
}
//