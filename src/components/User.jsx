import React from 'react'

export default function User(props) {
    return (
        <div>
            <img src={props.avatarUrl} style={imgStyle} />
        </div>
    )
}

const imgStyle = {
    height: '6em',
    width: '6em'
};