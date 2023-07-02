import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Popup from 'reactjs-popup';

export const BioDataPopup: React.FC = () => {
  const navigate = useNavigate();

  const content =
    'Corpoverse requires all bounty hunters to submit their facial structures.\n\nThank you for your cooperation.'

  return (
    <Popup
      open={true}
      modal
      contentStyle={{
        background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://media.tenor.com/HFdN8j-IG_kAAAAM/vault-boy.gif')`,
        backgroundSize: '100% auto',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
        padding: '20px',
        borderRadius: '4px',
        maxWidth: '500px',
        textAlign: 'center',
        height: 'auto',
        color: 'black'
      }}
      overlayStyle={{
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div className="popup-content">
        <h2 style={{ whiteSpace: 'pre-line' }}>{content}</h2>
        <div className="button-container">
          <button onClick={() => navigate('/profile')}>To Profile!</button>
        </div>
      </div>
    </Popup>
  );
};


