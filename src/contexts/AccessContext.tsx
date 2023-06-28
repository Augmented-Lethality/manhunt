import React, { createContext, useState } from 'react';

// declaring children type, which is the nested components
type AccessProviderProps = {
  children: React.ReactNode;
};

// types of the boolean states and the functions to set the state
type AccessContextType = {
  videoAccessError: boolean;
  locationAccessError: boolean;
  orientationAccessError: boolean;
  bioDataError: boolean;
  setVideoAccessError: (error: boolean) => void;
  setLocationAccessError: (error: boolean) => void;
  setOrientationAccessError: (error: boolean) => void;
  setBioDataError: (error: boolean) => void;
};

// the context of the states which can be accessed by the nested components
// must import it to use
export const AccessContext = createContext<AccessContextType>({
  videoAccessError: false,
  locationAccessError: false,
  orientationAccessError: false,
  bioDataError: false,
  setVideoAccessError: () => { },
  setLocationAccessError: () => { },
  setOrientationAccessError: () => { },
  setBioDataError: () => { },
});

// the component to be placed around the components you want to access the context
export const AccessProvider: React.FC<AccessProviderProps> = (props) => {
  const { children } = props;

  const [videoAccessError, setVideoAccessError] = useState(false);
  const [locationAccessError, setLocationAccessError] = useState(false);
  const [orientationAccessError, setOrientationAccessError] = useState(false);
  const [bioDataError, setBioDataError] = useState(false);


  return (
    <AccessContext.Provider
      value={{
        videoAccessError, locationAccessError, orientationAccessError, bioDataError, setVideoAccessError,
        setLocationAccessError, setOrientationAccessError, setBioDataError
      }}
    >
      {children}
    </AccessContext.Provider>
  );
};
