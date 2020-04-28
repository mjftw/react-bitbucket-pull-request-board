import React, { Fragment } from 'react'
import ReactTooltip from 'react-tooltip'

let next_tooltip_id = 0;

export default function WithTooltip(props) {
    if(props.tooltip === undefined) {
        return props.children;
    }

    const tooltip_id = (next_tooltip_id++).toString();

    return(
        <Fragment>
            <div data-tip data-for={tooltip_id}>
                {props.children}
            </div>
            <ReactTooltip {...props.tooltipProps} id={tooltip_id}>
                {props.tooltip}
            </ReactTooltip>
        </Fragment>
    );
}