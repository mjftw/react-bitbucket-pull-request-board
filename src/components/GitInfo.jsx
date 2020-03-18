import React from 'react';
import { Box } from 'grommet/components/Box'
import { Text } from 'grommet/components/Text'
import { FaLevelDownAlt } from 'react-icons/fa'

function LeftText(props) {
    return (
        <Text textAlign='left' size='medium'>{props.children}</Text>
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
        <Box direction='row' justify='between' flex={true}>
            <Box align='start'>
                <LeftText>#{pr.id} {pr.title}</LeftText>
                <LeftText>{pr.repoName}</LeftText>
                <LeftText>{pr.repoProjectKey}</LeftText>
                <LeftText>Created {pr.timeSinceCreated} ago</LeftText>
                <LeftText>Updated {pr.timeSinceUpdated} ago</LeftText>
            </Box>
            <Box width='2em' />
            <Box align='end'>
                <Box direction='row' align='end'>
                    <RightText>{pr.branchSource}</RightText>
                    <Box width='0.7em' />
                    <FaLevelDownAlt />
                </Box>
                <RightText>{pr.branchTarget}</RightText>
                <RightText><span style={{ color: 'green' }}>+{pr.summary.linesAdded}</span> | <span style={{ color: 'red' }}>-{pr.summary.linesRemoved}</span></RightText>
                <RightText>{pr.mergeConflicts ? <span style={{ color: 'orange' }}>Merge conficts</span> : 'No merge conficts'} </RightText>
            </Box>
        </Box >
    );
}
//