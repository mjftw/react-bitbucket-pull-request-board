import React from 'react';
import Grid from '@material-ui/core/Grid'

export default function GitInfo(props) {
    const pr = props.prData;
    return (
        <Grid container spacing={3}>
            <Grid item xs={1}>
                #{pr.id}
            </Grid>
            <Grid item xs={11}>
                {pr.title}
            </Grid>
            <Grid item xs={6}>
                {pr.repoName}
            </Grid>
            <Grid item xs={6}>
                {pr.branchSource}
            </Grid>
            <Grid item xs={6}>
                {pr.repoProjectKey}
            </Grid>
            <Grid item xs={6}>
                {pr.branchTarget}
            </Grid>
            <Grid item xs={6}>
                {pr.timeSinceCreated}
            </Grid>
            <Grid item xs={6}>
                +{pr.summary.linesAdded} | -{pr.summary.linesAdded}
            </Grid>
            <Grid item xs={6}>
                {pr.timeSinceUpdated}
            </Grid>
            <Grid item xs={6}>
                {pr.mergeConflicts ? 'M' : 'No m'}erge conficts
            </Grid>
        </Grid>
    );
}