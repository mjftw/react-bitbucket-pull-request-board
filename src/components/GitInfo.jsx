import React from 'react';
import Container from '@material-ui/core/Container'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'

export default function GitInfo(props) {
    const pr = props.prData;
    return (
        <Container >
            <Grid container spacing={3}>
                <Grid item xs={1}>
                    #{pr.id}
                </Grid>
                <Grid item xs={11}>
                    {pr.title}<br />
                </Grid>
                <Grid item xs={6}>
                    <Box style={{ 'textAlign': 'left' }}>
                        {pr.repoName}<br />
                        {pr.repoProjectKey}<br />
                        {pr.timeSinceCreated}<br />
                        {pr.timeSinceUpdated}
                    </Box>
                </Grid>
                <Grid item xs={6} style={{ 'textAlign': 'right' }}>
                    <Box>
                        {pr.branchSource}<br />
                        {pr.branchTarget}<br />
                        +{pr.summary.linesAdded} | -{pr.summary.linesAdded}<br />
                        {pr.mergeConflicts ? 'Merge' : 'No merge'} conficts
                    </Box>
                </Grid>
            </Grid>
        </Container >
    );
}