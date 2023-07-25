import React from 'react';
import styled from 'styled-components';

const ProgressContainer = styled.div`
  position: relative;
  width: 35vh;
  border: 1px solid black;
  border-radius: 0 0 10px 10px;
  height: 33px;
  top: 164px;
  margin-inline: auto;
  background-color: #1a1a1a;
`;

const ProgressBar = styled.div<{ progress: number }>`
  position: absolute;
  top: 0;
  left: 0;
  width: ${(props) => props.progress * 10}%; /* Calculate the width based on the progress */
  height: 100%;
  background-color: #f06;
  transition: width 0.5s ease-out;
`;

interface TargetRecognitionProps {
  progress: number;
}

const TargetRecognition: React.FC<TargetRecognitionProps> = ({ progress }) => {
  return (
    <ProgressContainer>
      <ProgressBar progress={progress} />
    </ProgressContainer>
  );
};

export default TargetRecognition;
