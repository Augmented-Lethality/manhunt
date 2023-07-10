import React from 'react';
import useCameraAccess from '../../custom-hooks/useCameraAccess';
import useLocationAccess from '../../custom-hooks/useLocationAccess';
import useOrientationAccess from '../../custom-hooks/useOrientationAccess';
import styled from 'styled-components';

const AccessCheckContainer = styled.div`
  margin: 20px;
  box-sizing: border-box;
  height: 100%;
  overflow: scroll;
  text-align: center;
  display: grid;
  grid-gap: 20px;
`;


interface AccessCheckProps {
  type: string;
}

const AccessCheck: React.FC<AccessCheckProps> = ({ type }) => {

  if (type === 'Camera') {
    const { checking, accessMessage, checkCameraAccess } = useCameraAccess();

    return (
      <AccessCheckContainer>
        {checking ? (
          <h4>Checking Camera Access...</h4>
        ) : (
          <>
            {accessMessage && (
              <>
                <h4 style={{ whiteSpace: 'pre-line' }}>{accessMessage}</h4>
                <button onClick={checkCameraAccess}>Retry Camera Access</button>
              </>
            )}
            {!accessMessage && !checking && <h4>Camera Check Complete</h4>}
          </>
        )}
      </AccessCheckContainer>
    );
  }


  if (type === 'Location') {
    const { checking, accessMessage, checkLocationAccess } = useLocationAccess();

    return (
      <AccessCheckContainer>
        {checking ? (
          <h4>Checking Location Access...</h4>
        ) : (
          <>
            {accessMessage && (
              <>
                <h4 style={{ whiteSpace: 'pre-line' }}>{accessMessage}</h4>
                <button onClick={checkLocationAccess}>Retry Location Access</button>
              </>
            )}
            {!accessMessage && !checking && <h4>Location Check Complete</h4>}
          </>
        )}
      </AccessCheckContainer>
    );
  }


  if (type === 'Orientation') {
    const { checking, accessMessage, checkOrientationAccess } = useOrientationAccess();

    return (
      <AccessCheckContainer>
        {checking ? (
          <h2>Checking Orientation Access...</h2>
        ) : (
          <>
            {accessMessage && (
              <>
                <h4 style={{ whiteSpace: 'pre-line' }}>{accessMessage}</h4>
                <button onClick={checkOrientationAccess}>Enable Device Orientation</button>
              </>
            )}
            {!accessMessage && !checking && <h4>Orientation Check Complete</h4>}
          </>
        )}
      </AccessCheckContainer>
    );
  }

};

export default AccessCheck;
