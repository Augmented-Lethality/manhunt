import React, { useContext, useEffect, useState } from 'react';
import SocketContext from '../../contexts/Socket/SocketContext';
import { useAuth0 } from '@auth0/auth0-react';
import CheckCircle from 'react-feather/dist/icons/check-circle';
import AlertCircle from 'react-feather/dist/icons/alert-circle';

const AccessReady: React.FunctionComponent = () => {
  const { user } = useAuth0();
  const { ready } = useContext(SocketContext).SocketState;

  const [light, setLight] = useState(false);

  useEffect(() => {
    console.log(ready)
    if (user?.sub && ready[user?.sub]) {
      // show green light next to their name, they're ready
      setLight(true);
    } else {
      // show red light, they aren't ready
      setLight(false);
    }
  }, [ready]);

  return light ? <CheckCircle color="green" size={24} /> : <AlertCircle color="red" size={24} />;
};

export default AccessReady;
