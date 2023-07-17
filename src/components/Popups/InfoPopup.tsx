import React from 'react';
import Popup from 'reactjs-popup';
import styled from 'styled-components';
import Info from 'react-feather/dist/icons/info';

const Wrapper = styled.div`
  border-bottom: 1px solid gray;
  font-size: 18px;
  text-align: center;
  position: fixed;
  left: 1%;
`;

const PopupContent = styled.span`
display: block;
padding: 10px;
background-color: #ffffff;
color: #333;
border-radius: 4px;
box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
white-space: pre-line;
text-align: center;
font-size: 20px;
max-height: 250px;
overflow-y: scroll;
max-width: 300px;
border: solid black 2px;
`;

const StyledInfo = styled(Info)`
  font-weight: bold;
`;

interface InfoPopupProps {
  message: string;
}

const InfoPopup: React.FC<InfoPopupProps> = ({ message }) => {
  return (
    <Popup
      trigger={
        <Wrapper>
          <StyledInfo size={30} strokeWidth={3} />
        </Wrapper>
      }
      position="right center"
      closeOnDocumentClick
      contentStyle={{ padding: '0', border: 'none' }}
    >
      <PopupContent>{message}</PopupContent>
    </Popup>
  );
};

export default InfoPopup;
