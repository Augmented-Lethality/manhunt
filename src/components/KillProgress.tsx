import React from 'react';
import styled, { css, keyframes } from 'styled-components';

interface TargetRecognitionProps {
    progress: number; // Progress from 0 to 10
}

const StyledSvg = styled.svg`
    position: absolute;
    transform: rotate(-90deg);
`;

const ProgressCircle = styled.circle<{ progress: number, circumference: number }>`
    stroke: #f06;
    fill: transparent;
    stroke-width: 3;
    stroke-dasharray: ${(props) => props.circumference};
    stroke-dashoffset: ${(props) => props.circumference};
    transition: stroke-dashoffset 0.5s ease-out;
    stroke-dashoffset: ${(props) => props.circumference - props.progress / 10 * props.circumference};
`;

const TargetRecognition: React.FC<TargetRecognitionProps> = ({ progress }) => {
    const radius = 20;
    const stroke = 3;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;

    return (
        <StyledSvg
            height={radius * 2}
            width={radius * 2}
        >
            <circle
                stroke="#6cf"
                fill="transparent"
                strokeWidth={stroke}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
            />
            <ProgressCircle
                progress={progress}
                circumference={circumference}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
            />
        </StyledSvg>
    );
};

export default TargetRecognition;