import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import CheckCircle from 'react-feather/dist/icons/check-circle';
import AlertCircle from 'react-feather/dist/icons/alert-circle';
import { User } from '../../contexts/Socket/SocketContext';

const AccessReady: React.FC<{ player: User; errors: string[] }> = ({ player, errors }) => {
  const { user } = useAuth0();

  const [light, setLight] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (errors.includes('ok')) {
      setLight(true);
    } else {
      setLight(false);
      createErrorMessage();
    }
  }, [errors, player.authId, user?.sub]);

  const createErrorMessage = () => {
    let mess = '';

    if (errors.length > 0 && !errors.includes('ok')) {
      if (errors.length > 2) {
        const lastItem = errors.pop();
        mess = `Please fix your ${errors.join(', ')}, and ${lastItem}.`;
      } else if (errors.length > 1) {
        mess = `Please fix your ${errors[0]} and ${errors[1]}.`;
      } else {
        mess = `Please fix your ${errors[0]}.`;
      }
    }


    setErrorMessage(mess);
  };

  return (
    <div style={{ marginLeft: '12px' }}>
      {light ? (
        <CheckCircle color="green" size={20} />
      ) : (
        <div>
          <AlertCircle color="red" size={20} />
          {!errors.includes('ok') && <strong> {errorMessage}</strong>}

        </div>
      )}
    </div>
  );
};

export default AccessReady;
