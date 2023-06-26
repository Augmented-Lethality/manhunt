import React, {useEffect} from 'react';
import styled from 'styled-components';
import { useFontSize } from '../contexts/FontSize';
import { Header } from '../styles/Header';
import { Container } from '../styles/Container';
import { Main } from '../styles/Main';
import Switch from 'react-switch';

// const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
//   height: 0;
//   width: 0;
//   visibility: hidden;
// `;

// const Slider = styled.span`
//   content: '';
//   position: absolute;
//   top: 4px;
//   left: 4px;
//   width: 26px;
//   height: 26px;
//   background: #fff;
//   border-radius: 50%;
//   transition: 0.4s;
// `;

// const SwitchLabel = styled.label<{ checked: boolean }>`
//   cursor: pointer;
//   width: 60px;
//   height: 34px;
//   background: ${props => props.checked ? '#7A9EC2' : '#2a2937'};
//   display: block;
//   border-radius: 34px;
//   position: relative;

//   ${HiddenCheckbox}:checked + & {
//     background: #7A9EC2;
//   }

//   ${HiddenCheckbox}:checked + & ${Slider} {
//     left: calc(100% - 4px);
//     transform: translateX(-100%);
//   }
// `;

// interface SwitchProps {
//   onChange: () => void;
//   checked: boolean;
// }

// const Switch: React.FC<SwitchProps> = ({ onChange, checked }) => (
//   <>
//     <HiddenCheckbox id="switch" onChange={onChange} checked={checked} />
//     <SwitchLabel checked={checked} htmlFor="switch">
//       <Slider />
//     </SwitchLabel>
//   </>
// );

const Settings: React.FC = () => {
  const [fontSize, setFontSize] = useFontSize();
  const [checked, setChecked] = React.useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    setTimeout(() => setFontSize(event.target.checked ? 20 : 16), 500);
  }

  return (
    <Container>
      <Header page='Settings'/>
      <Main style={{flexDirection:'row', alignItems:'start'}}>
        <label>
          <input type="checkbox" style={{height:'40px', width:'40px', margin:'20px'}} onChange={handleChange} checked={checked} />
          <h3>larger font</h3>
        </label>
      </Main>
    </Container>
  )
}

export default Settings;
