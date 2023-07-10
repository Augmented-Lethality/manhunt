import React, { useEffect, useState, useContext } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

import SocketContext from '../../contexts/Socket/SocketContext';

const LocationCheck: React.FC = () => {
  const { user, isAuthenticated } = useAuth0();
  const { player } = useContext(SocketContext).SocketState;

  return (
    <div>
    </div>
  );
};

export default LocationCheck;
