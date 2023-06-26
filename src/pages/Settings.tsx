import React from 'react'
import { Header } from '../styles/Header';
import { Container } from '../styles/Container';
import { Main } from '../styles/Main';
import styled from 'styled-components';
import { useFontSize } from '../contexts/FontSize';

const SwitchInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
`;

const Slider = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #2a2937;
  -webkit-transition: .4s;
  transition: .4s;
  border-radius: 34px;
  &:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: #dddddd;
    -webkit-transition: .4s;
    transition: .4s;
    border-radius: 50%;
  }
`;

const SwitchLabel = styled.label`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
  margin: 30px;
  & ${SwitchInput}:checked + ${Slider} {
    background-color: #7A9EC2;
    &:before {
      -webkit-transform: translateX(26px);
      -ms-transform: translateX(26px);
      transform: translateX(26px);
    }
  }

`;

const Switch = ({ ...props }) => (
  <SwitchLabel>
    <SwitchInput type="checkbox" {...props} />
    <Slider className="slider round"></Slider>
  </SwitchLabel>
);


const Settings: React.FC = () => {
  const [fontSize, setFontSize] = useFontSize();

  const toggleLargeFont = () => {
    if(fontSize === 16) {
      setFontSize(20);
    } else {
      setFontSize(16);
    }
  }

  return (
    <Container>
      <Header page='Settings'/>
      <Main style={{flexDirection:'row', alignItems:'baseline'}}>
        <Switch onChange={toggleLargeFont}/>
        <h3>Larger Font</h3>
      </Main>
    </Container>
  )
}

export default Settings;
