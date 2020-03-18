import React from 'react';
import { Box } from 'grommet/components/Box'
import { Text } from 'grommet/components/Text'
import { FaLevelDownAlt } from 'react-icons/fa'

export default function GitInfo(props) {
    const pr = props.prData;
    return (
        <Box direction='row' justify='between' flex={true}>
            <Box align='start'>
                <Text>#{pr.id} {pr.title}</Text>
                <Text textAlign='left'>{pr.repoName}</Text>
                <Text textAlign='left'>{pr.repoProjectKey}</Text>
                <Text textAlign='left'>Created {pr.timeSinceCreated} ago</Text>
                <Text textAlign='left'>Updated {pr.timeSinceUpdated} ago</Text>
            </Box>
            <Box width='2em' />
            <Box align='end'>
                <Box direction='row' align='end'>
                    <Text textAlign='end'>{pr.branchSource}</Text>
                    <Box width='0.7em' />
                    <FaLevelDownAlt />
                </Box>
                <Text textAlign='end'>{pr.branchTarget}</Text>
                <Text textAlign='end'><span style={{ color: 'green' }}>+{pr.summary.linesAdded}</span> | <span style={{ color: 'red' }}>-{pr.summary.linesRemoved}</span></Text>
                <Text textAlign='end'>{pr.mergeConflicts ? <span style={{ color: 'orange' }}>Merge conficts</span> : 'No merge conficts'} </Text>
            </Box>
        </Box >
    );
}
//