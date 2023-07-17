import React, { useEffect, useState, useContext } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { ButtonToFindGame, ButtonToHostGame } from '../styles/Buttons';
import SocketContext from '../contexts/Socket/SocketContext';
import { Header } from '../styles/Header';
import { Main } from '../styles/Main';
import { useFontSize } from '../contexts/FontSize';

import { BioDataPopup } from '../components/Popups/BioDataPopup';

import InfoPopup from '../components/Popups/InfoPopup';

const HomePage = () => {
  const { user, isAuthenticated } = useAuth0();
  const { users, player } = useContext(SocketContext).SocketState;
  const { LeaveGame } = useContext(SocketContext);
  const [fontSize, setFontSize] = useFontSize();

  const [showBioPopup, setBioPopUp] = useState(false);

  useEffect(() => {
    if (player.largeFont) {
      setFontSize(20);
    }
    if (!player.facialDescriptions) {
      setBioPopUp(true);
    }
  }, [player])

  useEffect(() => {
    LeaveGame(user);
  }, [])


  if (!isAuthenticated || !user) {
    return null;
  }

  const infoMessage = 'Corpoverse provides two options: Host a Contract or Find Available Contracts. \n\n' +
    'If you host, you decide the parameters of the game, otherwise you\'re at the mercy of the other hunters. \n\n'
  // +
  // 'Not sure what the game is about? Head over to our About section.'

  return (
    <>
      <Header page={'Home'} users={users} />
      <Main>
        {showBioPopup && <BioDataPopup />}
        <ButtonToHostGame />
        <ButtonToFindGame />
        <InfoPopup message={infoMessage} />
      </Main>
    </>
  );
};

export default HomePage;
