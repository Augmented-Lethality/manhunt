import React, { useContext, useEffect, } from 'react';
import styled from "styled-components";

import SocketContext from '../contexts/Socket/SocketContext'

// Holds the entire ID
const IdContainer = styled.div`
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

const ProfilePic = styled.img`
  height: 100px;
  border: 6px solid #717174;
`;

const Username = styled.h2`
font-size: 1.5rem;
margin-top: 10px;
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
  }
  padding: 10px;
  border-top: 1px solid #717174;
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


const IdPaper: React.FC = () => {
  const { player } = useContext(SocketContext).SocketState;

  if (!player.username.length) {
    return null;
  }

  return (
    <IdContainer className='paper'>
      <TitleContainer>
        <Corpoverse>CORPOVERSE</Corpoverse>
        <TitleText>Temporary ID</TitleText>
      </TitleContainer>
      <NameContainer>
        <ProfilePic
          src={player.image}
        />
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
