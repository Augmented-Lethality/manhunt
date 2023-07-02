import React, { useEffect, useState, useContext } from 'react';
import Popup from 'reactjs-popup';

interface PopupProps {
  content: string;
  accessFunction: () => void;
}

export const AccessPopup: React.FC<PopupProps> = ({ content, accessFunction }) => {
  const [message, setMessage] = useState('');

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleAccessButton = () => {
    accessFunction();
  };

  if (content.includes('Camera')) {
    setMessage(content);
  }

  return (
    <Popup
      open={true}
      modal
      closeOnDocumentClick
      contentStyle={{
        background: 'white',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
        padding: '20px',
        borderRadius: '4px',
        maxWidth: '500px',
        textAlign: 'center',
      }}
      overlayStyle={{
        background: 'rgba(0, 0, 0, 0.5)',
      }}
    >
      <div className="popup-content">
        <h2>{content}</h2>
        <div className="button-container">
          <button onClick={handleRefresh}>Refresh Page</button>
          <button onClick={handleAccessButton}>Button For Access</button>

        </div>
      </div>
    </Popup>
  );
};


