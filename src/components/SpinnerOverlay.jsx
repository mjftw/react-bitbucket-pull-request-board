import React from 'react'
import RingLoader from 'react-spinners/RingLoader'
import { Layer } from 'grommet'

export default function SpinnerOverlay(props) {
    const spinnerLayer = (
        <Layer
            full={false}
            modal={true}
            animate={true}
            animation='fadeIn'
            plain={true}
        >
            <RingLoader size='5em' color='midnightBlue' />
        </Layer>
    );

    return (
        <React.Fragment>
            {props.show ? spinnerLayer : null}
            {props.children}
        </React.Fragment>
    );
}
