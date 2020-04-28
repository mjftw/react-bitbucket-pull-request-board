import React, { Fragment } from 'react'
import ReactTooltip from 'react-tooltip'

let next_tooltip_id = 0;

export default function withTooltip(element, tooltip, tooltipProps) {
    if(tooltip === undefined) {
        return element;
    }

    const tooltip_id = (next_tooltip_id++).toString();

    return(
        <Fragment>
            <div data-tip data-for={tooltip_id}>
                {element}
            </div>
            <ReactTooltip {...tooltipProps} id={tooltip_id}>{tooltip}</ReactTooltip>
        </Fragment>
    );
}