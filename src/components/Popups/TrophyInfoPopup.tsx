import React from 'react';
import Popup from 'reactjs-popup';
import styled from 'styled-components';
import Info from 'react-feather/dist/icons/info';

const Wrapper = styled.div`
  border-bottom: 1px solid gray;
  font-size: 18px;
  text-align: center;
  position: absolute;
  bottom: 0.5em;
  right: 1em; 
`;

const PopupContent = styled.div`
  display: block;
  padding: 10px;
  background-color: #ffffff;
  color: #333;
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  white-space: pre-line;
  text-align: left;
  font-size: 15px;
  max-height: 250px;
  overflow-y: auto;
  max-width: 300px;
  border: solid black 2px;
  text-decoration: none; 
`;

const TrophyName = styled.div`
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  white-space: nowrap;
  flex-shrink: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledInfo = styled(Info)`
  font-weight: bold;
  text-decoration: none; 
`;

interface TrophyInfoPopupProps {
  message: string;
}

const TrophyInfoPopup: React.FC<TrophyInfoPopupProps> = ({ message }) => {
  return (
    <Popup
      trigger={
        <Wrapper>
          <StyledInfo size={30} strokeWidth={3} />
        </Wrapper>
      }
      position="top right"
      closeOnDocumentClick
      contentStyle={{ padding: '0', border: 'none' }}
    >
      <PopupContent>
        <TrophyName>{message.split('\n')[0]}</TrophyName>
        {message
          .split('\n')
          .slice(1)
          .map((line, index) => {
            const parts = line.split(': ');
            if (parts.length > 1) {
              return (
                <div key={index}>
                  <span style={{ fontWeight: 'bold' }}>{parts[0]}: </span>
                  {parts.slice(1).join(': ')}
                </div>
              );
            } else {
              return <div key={index}>{line}</div>;
            }
          })}
      </PopupContent>
    </Popup>
  );
};

export default TrophyInfoPopup;

