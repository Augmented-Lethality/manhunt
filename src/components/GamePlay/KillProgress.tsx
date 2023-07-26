import React from 'react';
import styled from 'styled-components';

//Contains the ProgressBar
const ProgressContainer = styled.div`
  position: relative;
  width: 35vh;
  border-radius: 0 0 10px 10px;
  height: 33px;
  top: 160px;
  margin-inline: auto;
  background-color: #1a1a1a;
`;

//Displays how much progress has been made as a percentage of the progress container
const ProgressBar = styled.div<{ progress: number, goal: number }>`
  position: absolute;
  top: 0;
  left: 0;
  width: ${(props) => props.progress / props.goal * 100}%;
  height: 100%;
  background-color: #f06;
  transition: width 0.5s ease-out;
`;

interface TargetRecognitionProps {
  progress: number;
  targetCounterGoal: number;
}

const TargetRecognition: React.FC<TargetRecognitionProps> = ({ progress, targetCounterGoal }) => {
  return (
    <ProgressContainer>
      <ProgressBar progress={progress} goal={targetCounterGoal}/>
    </ProgressContainer>
  );
};

export default TargetRecognition;
