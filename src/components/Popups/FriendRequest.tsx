import React, { useState } from 'react';
import Popup from 'reactjs-popup';
import { XCircle, UserPlus } from 'react-feather';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: fixed;
  right: 4%;
  top: 150px;
  background: #ffffff59;
  border: black solid;
  border-radius: 50%;
  height: 75px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 75px;
  z-index: 2;
  backdrop-filter: blur(1px);
  box-shadow: 0 -1px 0 2px #afd5d66b,
  0 1px 0 2px #00000063,
  5px 10px 2px #00000030;
`;

interface PopupProps {
  username: string;
  sendFriendRequest: (username: string) => Promise<{message: string}>;
}

const FriendRequestPopup: React.FC<PopupProps> = ({ username, sendFriendRequest }) => {
  const [requestStatus, setRequestStatus] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const handleSendRequest = async () => {
    const response = await sendFriendRequest(username);
    setRequestStatus(response.message);
  };

  const openPopup = () => {
    setOpen(true);
  };

  const closePopup = () => {
    setOpen(false);
  };

  return (
    <Popup
      open={open}
      onOpen={openPopup}
      onClose={closePopup}
      trigger={
        <Wrapper>
          <UserPlus/>
        </Wrapper>
      }
      modal
      closeOnDocumentClick
      contentStyle={{
        padding: '20px'
      }}
      overlayStyle={{
        background: 'rgba(0, 0, 0, 0.5)',
      }}
    >
      <div className="glassmorphism centered column padded">
        <div className='right'>
          <XCircle onClick={closePopup} style={{marginRight: '15px'}}/>
        </div>
        {requestStatus ? (
          <h4>{requestStatus}</h4>
        ) : (
          <>
            <h4>Do you want to send a friend request to {username}?</h4>
            <button onClick={handleSendRequest}>
              Yes, send request
            </button>
          </>
        )}
      </div>
    </Popup>
  );
};

export default FriendRequestPopup;
