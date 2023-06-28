import React, { useContext, useEffect, useState } from 'react';
import SocketContext from '../../contexts/Socket/SocketContext';
import { useAuth0 } from '@auth0/auth0-react';
import CheckCircle from 'react-feather/dist/icons/check-circle';
import AlertCircle from 'react-feather/dist/icons/alert-circle';

const AccessReady: React.FC<{ username: string }> = ({ username }) => {
  const { user } = useAuth0();
  const { ready } = useContext(SocketContext).SocketState;

  const [light, setLight] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  // const [test, setTest] = useState(['video', 'location']);

  useEffect(() => {
    if (user?.sub && ready[user?.sub].length <= 0) {
      // show green light next to their name, they're ready
      setLight(true);

    } else {
      // show red light, they aren't ready
      setLight(false);
      // create the error message
      createErrorMess();
    }
  }, [ready]);

  const createErrorMess = () => {

    if (user?.sub && ready[user?.sub].length > 0) {
      let mess = '';
      const errors = ready[user?.sub];
      // const errors = test;

      if (errors.length > 2) {
        const lastItem = errors.pop();
        mess = `Please fix your ${errors.join(', ')}, and ${lastItem}.`;
      } else if (errors.length > 1) {
        mess = `Please fix your ${errors[0]} and ${errors[1]}.`;
      } else {
        mess = `Please fix your ${errors[0]}.`;
      }

      setErrorMessage(mess);

    }
  }

  // for testing, please don't delete
  // useEffect(() => {
  //   createErrorMess();
  // }, []);

  return (
    <div>
      {light ? (
        <div>
          <CheckCircle color="green" size={20} /> {username}
        </div>
      ) : (
        <div>
          {errorMessage.length > 0 && <strong>{errorMessage}</strong>}<br />
          <AlertCircle color="red" size={20} /> {username}
        </div>
      )}
    </div>
  );
};

export default AccessReady;
