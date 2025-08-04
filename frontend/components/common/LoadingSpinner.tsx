import React from 'react';
import { LoadingSpinnerProps } from '../../types/index';

export function LoadingSpinner({ style = {} }: LoadingSpinnerProps): JSX.Element {
    return (
        <div className="picsart-loader" style={style}></div>
    );
} 