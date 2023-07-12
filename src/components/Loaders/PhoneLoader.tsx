import React from "react";
import styled, { keyframes } from "styled-components";
import { Header } from "../../styles/Header";
import { Main } from "../../styles/Main";
import { Container } from "../../styles/Container";

const PhoneColor = '#0D0907';

const Centered = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const PhoneContainer2 = styled.div`
  position: fixed;
  top: 25%;
  height: 300px;
  width: 300px;
`;

const PhoneAnimate = keyframes`
  0% {
    transform: translateX(calc(33.33vw - 75px));
  }
  25% {
    transform: translateX(calc(50vw - 75px));
  }
  50% {
    transform: translateX(calc(66.66vw - 75px));
  }
  75% {
    transform: translateX(calc(66.66vw - 75px));
  }
  100% {
    transform: translateX(calc(33.33vw - 75px));
  }
`;


const Phone = styled.div`
  ${Centered};
  width: 150px;
  height: 300px;
  border: 20px solid ${PhoneColor};
  border-radius: 50px;
  animation: ${PhoneAnimate} 4s linear infinite;
  animation-delay: 0.375s;
  left: 150px;

  &::after {
    content: "";
    position: absolute;
    top: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 50px;
    height: 24px;
    border-radius: 0 0 18% 18%;
    background-color: ${PhoneColor};
  }
`;

const Glass = styled.div`
  ${Centered};
  height: 100%;
  width: 100%;
  border-radius: 28px;
  background-color: white;
  opacity: 0.36;
  position: relative;
`;

const PhoneContainer = styled.div`
${Centered};
  width: 100vw;
  height: 100vh;
`;

const Logo = styled.h1`
  font-size: 3rem;
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const PhoneLoader: React.FC = () => {
  return (
    <Container>
      <Header />
      <Main>
        <PhoneContainer>
          <PhoneContainer2>
            <Phone>
              <Glass />
              <Logo className='phone-logo'>MAN HUNT</Logo>
            </Phone>
          </PhoneContainer2>
        </PhoneContainer>
      </Main>
    </Container>
  );
}

export default PhoneLoader;
