import React, { useContext, useEffect, useState } from 'react';
import SocketContext from '../../contexts/Socket/SocketContext';
import { useAuth0 } from '@auth0/auth0-react';
import CheckCircle from 'react-feather/dist/icons/check-circle';
import AlertCircle from 'react-feather/dist/icons/alert-circle';

const AccessReady: React.FunctionComponent = () => {
  const { user } = useAuth0();
  const { ready } = useContext(SocketContext).SocketState;

  const [light, setLight] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [test, setTest] = useState(['video', 'location', 'bio']);

  useEffect(() => {
    console.log(ready)
    // createErrorMess();
    console.log(errorMessage)
    if (user?.sub && ready[user?.sub].length <= 0) {
      // show green light next to their name, they're ready
      setLight(true);

    } else {
      // show red light, they aren't ready
      setLight(false);
      // createErrorMess();
    }
  }, [ready]);

  const createErrorMess = () => {
    // if (user?.sub && ready[user?.sub].length > 0) {
    let mess = '';
    console.log(test, test.length)

    if (test.length > 2) {
      const lastItem = test.pop();
      mess = `Please fix your ${test.join(', ')}, and ${lastItem}.`;
    } else if (test.length > 1) {
      mess = `Please fix your ${test[0]} and ${test[1]}.`;
    } else {
      mess = `Please fix your ${test[0]}.`;
    }

    setErrorMessage(mess);

    // }
  }


  useEffect(() => {
    createErrorMess();
  }, []);



  return (
    <div>
      {light ? <CheckCircle color="green" size={24} /> : <AlertCircle color="red" size={24} />}
      {errorMessage.length > 0 && <strong>Error Mess: {errorMessage}</strong>
      }
    </div>
  );
};

export default AccessReady;
