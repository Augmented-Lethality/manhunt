import React from 'react';
import { LoginButton, SignupButton } from '../styles/Buttons';
import styled from 'styled-components';

const PageContainer = styled.div`
  background-color: #000402;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ContentContainer = styled.div`
max-width: 100%;
margin: 0 auto;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
`;

const LandingImage = styled.img`
  max-width: 100%;
`;

const LandingPage = () => {
  return (
    <PageContainer>
      <ContentContainer>
        <LandingImage src="https://i.imgur.com/TFXxFSa_d.webp?maxwidth=760&fidelity=grand" alt="Landing Image" />
        <LoginButton />
        <SignupButton />
      </ContentContainer>
    </PageContainer>
  );
};

export default LandingPage;
