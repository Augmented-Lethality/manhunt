// import React, { useContext, useEffect, useState } from 'react';
// import SocketContext from '../../contexts/Socket/SocketContext';
// import { ButtonToGame } from '../Buttons';
// import { useAuth0 } from '@auth0/auth0-react';
// import TimerInput from './TimerInput';


// const HostControls: React.FunctionComponent = () => {
//   const { games, ready } = useContext(SocketContext).SocketState;
//   const [hasReadyErrors, setHasReadyErrors] = useState(false);
//   const { user } = useAuth0();
//   const [showControls, setShowControls] = useState(false);

//   //Determine who can see the controls and who can't
//   useEffect(() => {
//     (games.length > 0 && games[0].host === user?.sub)
//     ? setShowControls(true)
//     : setShowControls(false);
//   }, [games]);

//   // if any of the ready objects don't have a value of 'ok', can't start the game
//   useEffect(() => {
//     const hasErrors = Object.values(ready).some((errors: string[]) => !errors.includes('ok'));
//     setHasReadyErrors(hasErrors);
//   }, [ready]);

//   return (
//     <>
//       {showControls && (
//         <>
          
          
//         </>
//       )}
//     </>
//   );
// };

// export default HostControls;
