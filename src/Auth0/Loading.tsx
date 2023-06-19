import React from 'react';
import styled, { keyframes } from 'styled-components';

const bounce = keyframes`
  to {
    opacity: 0.3;
    transform: translate3d(0, -1rem, 0);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;

  div {
    width: 1rem;
    height: 1rem;
    margin: 2rem 0.3rem;
    background: #979fd0;
    border-radius: 50%;
    animation: 0.9s ${bounce} infinite alternate;

    &:nth-child(2) {
      animation-delay: 0.3s;
    }

    &:nth-child(3) {
      animation-delay: 0.6s;
    }
  }
`;


const PageLoader: React.FC = () => (
    <LoadingContainer>
      <div></div>
      <div></div>
      <div></div>
    </LoadingContainer>
);

export default PageLoader;

