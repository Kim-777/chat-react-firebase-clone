import React from 'react';

const Badge = ({style, children, variant}) => {

    const styling = {
        display: 'inline-block',
        width: children && '20px',
        height: children && '20px',
        borderRadius: '4px',
        alignContent: 'center',
        textAlign: 'center',
        lineHeight: '20px',
        backgroundColor: variant ? `${variant}` : '',
        ...style,
    }

    return (
        <span style={styling}>
            {children}
        </span>
    )
}

export default Badge
