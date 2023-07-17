import React from 'react';
import Popup from 'reactjs-popup';
import styled from 'styled-components';
import Info from 'react-feather/dist/icons/info';

const Wrapper = styled.div`
  width: 100%;
  border-bottom: 1px solid gray;
  font-size: 18px;
  text-align: center;
  padding: 5px;
  bottom: 0;
  position: fixed;
`;

const PopupContent = styled.span`
  display: block;
  padding: 10px;
  background-color: white;
  color: #333;
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  margin-left: 10px;
  margin-right: 10px;
  white-space: pre-line;
  text-align: center;
  font-size: 20px;
`;

const StyledInfo = styled(Info)`
  font-weight: bold;
`;

interface InfoPopupProps {
  message: string
}

const InfoPopup: React.FC<InfoPopupProps> = ({ message }) => {
  return (
    <Popup
      trigger={
        <Wrapper>
          <StyledInfo size={30} strokeWidth={3} />
        </Wrapper>
      }
      position="top center"
      closeOnDocumentClick
    >
      <PopupContent>
        {message}
      </PopupContent>
    </Popup>
  );
};

export default InfoPopup;
