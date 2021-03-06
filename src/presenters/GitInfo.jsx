import React from 'react';
import moment from 'moment';
import {Box, Text} from 'grommet';
import {FaLevelDownAlt} from 'react-icons/fa';

function LeftText(props) {
    return (
        <Text textAlign='start' size='medium'>{props.children}</Text>
    );
}

function RightText(props) {
    return (
        <Text textAlign='end' size='medium'>{props.children}</Text>
    );
}

export default function GitInfo(props) {
    const pr = props.prData;
    return (
        <Box
            direction='row'
            justify='between'
            flex={true}
            onClick={() => window.open(pr.prUrl)}
        >
            <Box align='start'>
                <LeftText>#{pr.id} {pr.title}</LeftText>
                <LeftText>{pr.repoDisplayName}</LeftText>
                <LeftText>{pr.repoProjectKey}</LeftText>
                <LeftText>Created {moment(pr.dateCreated).fromNow()}</LeftText>
                <LeftText>Updated {moment(pr.dateUpdated).fromNow()}</LeftText>
            </Box>
            <Box width='2em' />
            <Box align='end'>
                <Box direction='row' align='end'>
                    <RightText>{pr.branchSource}</RightText>
                    <Box width='0.7em' />
                    <FaLevelDownAlt />
                </Box>
                <RightText>{pr.branchTarget}</RightText>
                <RightText><span style={{color: 'green'}}>+{pr.summary.linesAdded}</span> | <span style={{color: 'red'}}>-{pr.summary.linesRemoved}</span></RightText>
                <RightText>{pr.mergeConflicts ? <span style={{color: 'orange'}}>Merge conflicts</span> : 'No merge conflicts'} </RightText>
            </Box>
        </Box >
    );
}
//