import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import useCameraAccess from '../../custom-hooks/useCameraAccess';
import useLocationAccess from '../../custom-hooks/useLocationAccess';
import useOrientationAccess from '../../custom-hooks/useOrientationAccess';
import styled from 'styled-components';
import CheckCircle from 'react-feather/dist/icons/check-circle';
import AlertCircle from 'react-feather/dist/icons/alert-circle';

const AccessCheckContainer = styled.div`
  margin: 20px;
  box-sizing: border-box;
  height: 100%;
  overflow: scroll;
  text-align: center;
`;


interface AccessCheckProps {
  type: string;
  count: number;
  setCount: (count: number) => void;
}

const AccessCheck: React.FC<AccessCheckProps> = ({ type, setCount, count }) => {

  const updateCount = (checking: boolean, accessMessage: string) => {
    if (!checking && !accessMessage) {
      setCount(count + 1);
    }
  }

  if (type === 'Camera') {
    const { checking, accessMessage, checkCameraAccess } = useCameraAccess();

    useEffect(() => {
      updateCount(checking, accessMessage);
    }, [checking, accessMessage])

    return (
      <AccessCheckContainer>
        {checking ? (
          <h4>Checking Camera Access...</h4>
        ) : (
          <>
            {accessMessage && (
              <><AlertCircle color="red" size={20} />
                <h4 style={{ whiteSpace: 'pre-line', marginBottom: '5px' }}>{accessMessage}</h4>
              </>
            )}
            {!accessMessage && !checking && (<><h4>Camera </h4><CheckCircle color="green" size={20} /></>)}
          </>
        )}
      </AccessCheckContainer>
    );
  }


  if (type === 'Location') {
    const { checking, accessMessage, checkLocationAccess } = useLocationAccess();

    useEffect(() => {
      updateCount(checking, accessMessage);
    }, [checking, accessMessage])

    return (
      <AccessCheckContainer>
        {checking ? (
          <>
            <h4>Checking Location Access...</h4>
          </>
        ) : (
          <>
            {accessMessage && (
              <><AlertCircle color="red" size={20} />
                <h4 style={{ whiteSpace: 'pre-line', marginBottom: '5px' }}>{accessMessage}</h4>
              </>
            )}
            {!accessMessage && !checking && (<><h4>Location </h4><CheckCircle color="green" size={20} /></>)}
          </>
        )}
      </AccessCheckContainer>
    );
  }


  if (type === 'Orientation') {
    const { checking, accessMessage, checkOrientationAccess } = useOrientationAccess();

    useEffect(() => {
      updateCount(checking, accessMessage);
    }, [checking, accessMessage])

    return (
      <AccessCheckContainer>
        {checking ? (
          <h2>Checking Orientation Access...</h2>
        ) : (
          <>
            {accessMessage && (
              <><AlertCircle color="red" size={20} />
                <h4 style={{ whiteSpace: 'pre-line', marginBottom: '5px' }}>{accessMessage}</h4>
                <button onClick={checkOrientationAccess}>Enable Device Orientation</button>
              </>
            )}
            {!accessMessage && !checking && (<><h4>Device Orientation</h4><CheckCircle color="green" size={20} /></>)}
          </>
        )}
      </AccessCheckContainer>
    );
  }

};

export default AccessCheck;
