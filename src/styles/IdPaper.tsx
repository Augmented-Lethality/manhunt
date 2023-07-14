import React, { useContext } from 'react';
import styled from "styled-components";

import SocketContext from '../contexts/Socket/SocketContext'

const lightGrey = '#717174'

// Holds the entire ID
const IdContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  margin: 20px;
  margin-inline: auto;
  padding: 20px;
  height: 385px;
  width: 90vw;
  overflow: hidden;
  border-radius: 30px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.8);
  background-color: #fff;

  svg {
    position: absolute;
    top: 28%;
    right: 30%;
  }
`;

// Corpoverse and Temporary ID (TitleText)
const TitleContainer = styled.div`
display: flex;
align-items: center;
padding-inline: 100%;
flex-direction: column;
`;

const Corpoverse = styled.h3`
color: black;
letter-spacing: 4px;
flex-shrink: 1;
font-size: 1.5em;
`;

const TitleText = styled.h5`
color: black;
flex-shrink: 1;
text-align: center;
padding: 5px;
`;

// Name Container holds ProfilePic and Username
const NameContainer = styled.div`
display: flex;
flex-direction: column;
align-items: center;
margin: 10px;
`;

const Username = styled.h2`
font-size: 1.5rem;
margin-top: 60px;
font-weight: bold;
`;

// Holds the Stamp
const StampContainer = styled.div`
  display: flex;
  justify-content: space-around;
  width: 81vw;
  div {
    display: flex;
    flex-direction: column;
    margin-top: 8px;
  }
  padding: 10px;
  border-top: 1px solid ${lightGrey};
`;

const Stamp = styled.div`
transform: rotate(3deg);
color: #c22727;
font-size: 2rem;
font-weight: 700;
border: 0.25rem solid #c22727;
padding: 0.3rem 1rem;
border-radius: 1rem;
font-family: 'Courier';
mix-blend-mode: multiply;
margin: 5px;
text-align: center;
`;

// Barcode, still uses the className='barcode'
const Barcode = styled.h2`
  margin-bottom: -30px;
  width: 75vw;
  text-align: center;
`;

export function Eyeball() {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 100 60'
      width='130'
      height='60'
      style={{
        opacity: '.2'
      }}
    >
      <path
        transform='translate(-10, -20)'
        fill='#01010b'
        d='M50.006 20C19.509 20 4.978 50.028 5 50.028l.013-.026s13.984 29.997 44.993 29.997C78.997 80 95 50.002 95 50.002S80.997 20 50.006 20zm16.991 25.007a2 2 0 01-2 2h-11v-4h11a2 2 0 012 2zm-19 4h4v11a2 2 0 01-4 0v-11zm2-21a2 2 0 012 2v11h-4v-11a2 2 0 012-2zm-15 15h11v4h-11a2 2 0 010-4zm15.009 31c-11 0-20.891-4.573-29.399-13.104-4.086-4.096-7.046-8.26-8.61-10.867 2.787-4.546 9.53-13.969 20.187-19.569A22.889 22.889 0 0027 45.002c0 12.704 10.306 23.005 22.994 23.005C62.709 68.007 73 57.707 73 45.002a22.899 22.899 0 00-5.233-14.605c4.113 2.148 7.999 5.06 11.633 8.701 4.018 4.027 7.016 8.292 8.597 10.909-4.53 6.841-18.052 24-37.991 24z'
      ></path>
    </svg>
  );
}


const IdPaper: React.FC = () => {
  const { player } = useContext(SocketContext).SocketState;

  if (!player.username.length) {
    return null;
  }

  return (
    <IdContainer className='paper'>
      <Eyeball />
      <TitleContainer>
        <Corpoverse>CORPOVERSE</Corpoverse>
        <TitleText>Temporary ID</TitleText>
      </TitleContainer>
      <NameContainer>
        <Username>{player.username}</Username>
      </NameContainer>
      <StampContainer>
        <>
          <div>
            <Stamp>NOT VERIFIED</Stamp>
          </div>
        </>
      </StampContainer>
      <Barcode className='barcode'>asdfkjflekjg</Barcode>
    </IdContainer>

  )

};

export default IdPaper;
