import React from 'react'
import { Box, Text } from 'grommet'
import User from './User'
import WithTooltip from './WithTooltip'


function UserGroup(props) {
    const childrenWithSpacer = React.Children.map(props.children, child => {
        return (
            <React.Fragment>
                {child}
                <Box width='0.3em' />
            </React.Fragment>
        );
    });

    return (
        <Box direction='column'>
            <Box direction='row' justify='start'>
                {childrenWithSpacer}
            </Box>
            <Text size='small' textAlign='center'>{props.title}</Text>
        </Box>
    );
}

export default function UserInfo(props) {
    const pr = props.prData;

    const reviewersGroup = (pr.reviewers && pr.reviewers.length) ?
        (
            <UserGroup title={'Reviewer' + ((pr.reviewers.length > 1) ? 's' : '')}>
                {pr.reviewers.map(reviewer =>
                    <WithTooltip
                        key={reviewer.profileUrl}
                        tooltip={reviewer.name}
                    >
                        <User
                            avatarUrl={reviewer.avatarUrl}
                            profileUrl={reviewer.profileUrl}
                            numComments={reviewer.comments}
                            tick={reviewer.approved}
                        />
                    </WithTooltip>
                )}
            </UserGroup>
        ) : null;

    return (
        <Box direction='row' flex='shrink'>
            <UserGroup title='Author'>
                <WithTooltip tooltip={pr.author.name}>
                    <User
                        avatarUrl={pr.author.avatarUrl}
                        profileUrl={pr.author.profileUrl}
                        name={pr.author.name}
                        numComments={pr.author.comments}
                    />
                </WithTooltip>
            </UserGroup>
            <Box width='0.5em' />
            {reviewersGroup}
        </Box>
    );
}
