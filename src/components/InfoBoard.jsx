import React from 'react'
import { Box, Text } from 'grommet'
import PullRequestInfo from './PullRequestInfo'
import { getPrUid } from '../utils/bitbucket'

const InfoBox = (props) => (
    <Box
        tag='header'
        direction='column'
        flex='grow'
        justify='start'
        pad={{ vertical: 'small', horizontal: 'medium' }}
        elevation='medium'
        {...props}
    />
);

const Center = (props) => (
    <Box
        direction='column'
        flex='grow'
        justify='around'
    >
        <Box
            direction='row'
            flex='shrink'
            justify='around'
        >
            {props.children}
        </Box>
    </Box>
);

const InfoBubble = (props) => (
    <Box
        border={true}
        background='linear-gradient(45deg, #ffe7b3 30%, #fff7e6 90%)'
        round='small'
        flex='shrink'
        pad={{
            vertical: 'medium', horizontal: 'medium'
        }}
        elevation='large'
    >
        {props.children}
    </Box>
);


export default function InfoBoard(props) {
    let content = null;

    // No open pull request data to display
    if (props.prData === null || props.prData === undefined || props.prData.length === 0) {
        content = (
            <Center>
                <InfoBubble>
                    <Text textAlign='center'>
                        No open pull requests to display<br />
                        Try adding more repositories
                    </Text>
                </InfoBubble>
            </Center>
        );
    }
    // Pull request data
    else {
        content = (
            <InfoBox>
                {props.prData.map(prDataItem =>
                    <PullRequestInfo
                        prData={prDataItem}
                        key={getPrUid(prDataItem)}
                    />
                )}
            </InfoBox >
        );
    }
    return content;
}
