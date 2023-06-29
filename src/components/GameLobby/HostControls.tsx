import React, { useContext, useEffect, useState } from 'react';
import SocketContext from '../../contexts/Socket/SocketContext';
import { ButtonToGame } from '../Buttons';
import { useAuth0 } from '@auth0/auth0-react';
import TimerInput from './TimerInput';


const HostControls: React.FunctionComponent = () => {
  const { games, ready } = useContext(SocketContext).SocketState;
  const [hasReadyErrors, setHasReadyErrors] = useState(false);
  const { user } = useAuth0();

  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    if (games.length > 0 && games[0].host === user?.sub) {
      setShowControls(true);
    } else {
      setShowControls(false);
    }
  }, [games]);

  useEffect(() => {
    const hasErrors = Object.values(ready).some((errors: string[]) => errors.length > 0);
    setHasReadyErrors(hasErrors);
  }, [ready]);

  return (
    <div>
      {showControls && (games[0].hunted.length > 0 && !hasReadyErrors && <ButtonToGame />)}
      {showControls && <TimerInput />}
    </div>
  );
};

export default HostControls;
