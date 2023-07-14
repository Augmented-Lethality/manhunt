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
  background: white;
  border-radius: 30px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.8);
  border: 2px solid black;
`
// Black band that holds Corpoverse and Official ID (TitleText)
const TitleContainer = styled.div`
display: flex;
align-items: center;
background: black;
padding-inline: 100%;
`;

const Corpoverse = styled.h3`
color: #717174;
letter-spacing: 4px;
flex-shrink: 1;
text-align: left;
padding: 10px;
`;

const TitleText = styled.h5`
color: #706f76;
flex-shrink: 1;
text-align: center;
padding: 10px;
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
  border: 6px solid black;
`;

const Username = styled.h2`
font-size: 1.5rem;
margin-top: 10px;
font-weight: bold;
`;

// Holds the Stats that are h5 within a div (could be cleaner)
const StatsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  width: 81vw;
  div {
    display: flex;
    flex-direction: column;
  }
  padding: 10px;
  border-top: 1px solid black;
`;

// Barcode, still uses the className='barcode'
const Barcode = styled.h2`
  margin-bottom: -30px;
  width: 75vw;
  text-align: center;
`;


const IdCard: React.FC = () => {
  const { player } = useContext(SocketContext).SocketState;

  if (!player.username.length) {
    return null;
  }

  return (
    <IdContainer >
      <TitleContainer>
        <Corpoverse>CORPOVERSE</Corpoverse><TitleText>|</TitleText>
        <TitleText>OFFICIAL ID</TitleText>
      </TitleContainer>
      <NameContainer>
        <ProfilePic
          src={player.image}
        />
        <Username>{player.username}</Username>
      </NameContainer>
      <StatsContainer>
        <>
          <div>
            <h5>Wins: {player.gamesWon}</h5>
            <h5>Kills: {player.killsConfirmed}</h5>
          </div>
          <div>
            <h5>Total Matches: {player.gamesPlayed}</h5>
            <h5 style={{ textAlign: 'center' }}>K\D: {(player.killsConfirmed / player.gamesPlayed).toFixed(2)}</h5>
          </div>
        </>
      </StatsContainer>
      <Barcode className='barcode'>asdfkjflekjg</Barcode>
    </IdContainer>

  )

};

export default IdCard;
