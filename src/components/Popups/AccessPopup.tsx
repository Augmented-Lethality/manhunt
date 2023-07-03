import React, { useEffect, useState, useContext } from 'react';
import Popup from 'reactjs-popup';

interface PopupProps {
  content: string;
  accessFunctions: { [key: string]: () => void };
  errorMessages: string[];
}


export const AccessPopup: React.FC<PopupProps> = ({ content, accessFunctions, errorMessages }) => {
  const [accessButtonClicked, setAccessButtonClicked] = useState<string | null>(null);

  // refresh button reloads the window
  // const handleRefresh = () => {
  //   window.location.reload();
  // };

  // the function for the access button is triggered here
  const handleAccessButton = (accessType: string) => {
    accessFunctions[accessType]();
    setAccessButtonClicked(accessType);
  };

  return (
    <Popup
      open={true}
      modal
      closeOnDocumentClick
      contentStyle={{
        background: `url('https://media.tenor.com/EIXSHzr7TfUAAAAC/fallout-vault.gif')`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
        padding: '20px',
        borderRadius: '4px',
        maxWidth: '90vw',
        maxHeight: '90vh',
        width: 'auto',
        height: 'auto',
        textAlign: 'center',
        color: 'black',
      }}

      overlayStyle={{
        background: 'rgba(0, 0, 0, 0.5)',
      }}
    >
      <div className="popup-content" style={{ maxHeight: '70vh', overflow: 'auto' }}>
        <h4 style={{ whiteSpace: 'pre-line' }}>{content}</h4>
        <div className="button-container">
          {Object.keys(accessFunctions).map((accessType) => (
            accessType !== 'location' &&
            errorMessages.some((errorMessage) => errorMessage.includes(accessType)) && (
              <button
                key={accessType}
                onClick={() => handleAccessButton(accessType)}
                disabled={accessButtonClicked === accessType}
              >
                {accessType}
              </button>
            )
          ))}
          {/* <button onClick={handleRefresh}>Refresh Page</button> */}

        </div>
      </div>
    </Popup>
  );
};


