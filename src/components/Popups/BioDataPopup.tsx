import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Popup from 'reactjs-popup';
import { CSSProperties } from 'react';

export const BioDataPopup: React.FC = () => {
  const navigate = useNavigate();

  const content =
    'Corpoverse requires all bounty hunters to submit their facial structures.\n\nThank you for your cooperation.';

  const eyeballSvg = encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 60" width="135" height="60" style="transform: rotate(180deg)"><path transform="translate(-10, -20)" fill="#01010b" d="M50.006 20C19.509 20 4.978 50.028 5 50.028l.013-.026s13.984 29.997 44.993 29.997C78.997 80 95 50.002 95 50.002S80.997 20 50.006 20zm16.991 25.007a2 2 0 01-2 2h-11v-4h11a2 2 0 012 2zm-19 4h4v11a2 2 0 01-4 0v-11zm2-21a2 2 0 012 2v11h-4v-11a2 2 0 012-2zm-15 15h11v4h-11a2 2 0 010-4zm15.009 31c-11 0-20.891-4.573-29.399-13.104-4.086-4.096-7.046-8.26-8.61-10.867 2.787-4.546 9.53-13.969 20.187-19.569A22.889 22.889 0 0027 45.002c0 12.704 10.306 23.005 22.994 23.005C62.709 68.007 73 57.707 73 45.002a22.899 22.899 0 00-5.233-14.605c4.113 2.148 7.999 5.06 11.633 8.701 4.018 4.027 7.016 8.292 8.597 10.909-4.53 6.841-18.052 24-37.991 24z"></path></svg>'
  );

  const backgroundStyle: CSSProperties = {
    background: 'url(/textures/paper.png)',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.9)',
    padding: '20px',
    borderRadius: '4px',
    maxWidth: '90vw',
    maxHeight: '90vh',
    width: 'auto',
    height: 'auto',
    textAlign: 'center',
    color: 'black',
  };

  return (
    <Popup
      open={true}
      modal
      closeOnDocumentClick
      contentStyle={backgroundStyle}
      overlayStyle={{
        background: 'rgba(0, 0, 0, 0.5)',
      }}
    >
      <div className="popup-content">
        <h2 style={{ whiteSpace: 'pre-line', marginBottom: '15px', padding: '10px' }}>{content}</h2>
        <div className="button-container">
          <button onClick={() => navigate('/profile')}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 60"
              width="135"
              height="60"
              style={{ transform: 'rotate(180deg)' }}
              dangerouslySetInnerHTML={{ __html: decodeURIComponent(eyeballSvg) }}
            />
          </button>
        </div>
      </div>
    </Popup>
  );
};
