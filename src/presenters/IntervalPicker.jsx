import React from 'react';
import {Box, RangeInput, CheckBox} from 'grommet';
import {setRefreshMins, setShouldDataRefresh} from '../redux/refresh/actions';
import {connect} from 'react-redux';

function IntervalPicker(props) {
    let intervalInput = null;
    if (props.enabled) {
        intervalInput = (
            <Box>
                Update every {props.interval} mins
                <RangeInput
                    value={props.interval}
                    min={1}
                    max={60}
                    step={1}
                    onChange={(event) => props.setInterval(event.target.value)}
                />
            </Box>
        );
    }
    return (
        <Box>
            <Box
                direction='row'
                flex='grow'
                justify='between'
            >
                Live data
                <CheckBox
                    checked={props.enabled}
                    onChange={(event) => props.setEnabled(event.target.checked)}
                    toggle
                />
            </Box>
            {intervalInput}
        </Box>
    );
}

export default connect(
    (state) => ({
        enabled: state.refresh.shouldDataRefresh,
        interval: state.refresh.mins
    }),
    {
        setInterval: setRefreshMins,
        setEnabled: setShouldDataRefresh
    }
)(IntervalPicker);