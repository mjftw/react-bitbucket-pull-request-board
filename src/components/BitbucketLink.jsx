import React from 'react'
import { Box, Text, Layer, Button } from 'grommet'
import { FaBitbucket } from 'react-icons/fa'
import getEnv from '../env'

const bitbucketAuthUrl = `https://bitbucket.org/site/oauth2/authorize?client_id=${getEnv().bitbucket.oauthClientId}&response_type=token`;

export default function BitbucketLink() {
    return (
        <Layer>
            <Box
                pad='small'
                flex='shrink'
            >
                <Button
                    icon={<FaBitbucket color='navy' />}
                    label='Connect to Bitbucket'
                    onClick={() => window.open(bitbucketAuthUrl)}
                />
            </Box>
        </Layer>
    )
}
