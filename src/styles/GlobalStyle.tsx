import { createGlobalStyle } from 'styled-components';

const GlobalStyle: React.NamedExoticComponent<any> = createGlobalStyle`

body {
  margin: 0;
  padding: 0;
  height: 100%;
  min-height: 100vh;
  width: 100vw;
  box-sizing: border-box;
  color: black;
  font-family: 'Source Code Pro';
  font-size: var(--font-size);
  word-wrap: break-word;
  background: url("/textures/background-small.png") no-repeat;
  background-size: cover;
}

* {
  box-sizing: border-box;
}

.glassmorphism{
  background: #ffffff1f;
  border: solid 1px #ffffff3d;
  backdrop-filter: blur(5px);
  color: white;
  border-radius: 45px 43px;
  box-shadow: 0 5px 10px 2px #00000030;
}

button{
  width: 200px;
  height: 70px;
  border-radius: 20px;
  background: #bf360c;
  border: 2px solid #bf360c;
  font-size: 1.5rem;
  color: white;
}

.neon-button {
  width: 200px;
  height: 70px;
  border-radius: 20px;
  background: #ffffff4d;
  border: 2px solid #97fff4;
  box-shadow: 0 0 5px 2px #49b7b7, inset 0 0 30px 2px #4fcaca;
  font-size: 1.5rem;
  color: white;
}

.barcode {
  font-family: 'Libre Barcode 39';
}

.metal-button {
  background: conic-gradient(
    hsl(74.36deg, 12.38%, 65.19%),
    hsl(0deg, 0%, 91.72%),
    hsl(0deg, 0%, 95.32%),
    hsl(96.76deg, 10.53%, 61.79%),
    hsl(124.7deg, 13.52%, 72.85%),
    hsl(0deg, 0%, 96.37%),
    hsl(0deg, 0%, 99.8%),
    hsl(73.25deg, 21.84%, 71.66%),
    hsl(60.31deg, 7.49%, 64.58%)
  );
  
  width: 50px;
  height: 50px;
  color: black;
  border: 2px solid #575757;
  border-radius: 50%;
  position: relative;
  box-shadow: 0 0 0 0.5px white,
    -3px 2px 5px 1px rgb(0 0 0 / 56%),
    0 0 0 2px white;
}

.plastic-button{
  color: #cacaca;
  background: linear-gradient(10deg, #4a4a4a, #2c2c2c);
  border: 2px solid black;
  height: 30px;
  width: 30px;
  margin-inline: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  box-shadow: -3px 3px 10px 0px #0000008a, 0 0.5px 0 2px #434343;
}
.alt-user-pic {
  background: #6854bb;
  color: #e0dfe5;
  font-size: 2rem;
  font-family: 'Open Sans';
  font-weight: 400;
  border-radius: 50%;
  margin-right: 15px;
  width: 10vw;
  height: 10vw;
  display: flex;
  justify-content: center;
}

.alt-user-pic-large {
  background: #6854bb;
  color: #e0dfe5;
  font-size: 5rem;
  font-family: 'Open Sans';
  font-weight: 400;
  border-radius: 50%;
  padding: 40px;
  width: 10vw;
  height: 10vw;
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo{
  color: #e6a733;
  font-family: 'Fascinate Inline';
  text-shadow: -4px 3px 0 #000, 1px -1px 0 #000, -3px 1px 0 #000, 1px 1px 0 #000;
  margin: -0.2rem;
  filter: none;
  z-index: 2;
}

.phone-logo {
  color: #e6a733;
  font-family: 'Fascinate Inline';
  text-shadow: -2px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
  filter: drop-shadow(-3px 3px 0px #000);
  text-align: center;
}

.react-icon{
  font-size: 3rem;
}

.react-icon-large{
  border-radius: 50%;
  padding: 10px;
  background-color: black;
  color: cyan;
  border: 3px solid cyan;
  box-shadow: 0 0 0 5px black;
}

.react-icon-logo{
font-size: 3rem;
color: black;
background: #e6a733;
border-radius: 50%;
padding: 2vw;
border: 2px solid black;
}

.end-game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh; 
}

.profile-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.trophy-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.digital {
  background-image: linear-gradient( 0deg, #000000 13%, #001e19 71%, #111111 90%, #000000 100% );    border: 2px solid #4d4d4d;
  background-size: 1px 5px;
  border-radius: 12px;
  text-align: center;
  color: cyan;
  text-size: 2rem;
  font-family: 'VT323';
}

.digital-h1 {
  font-family: inherit;
  color: black;
  -webkit-text-stroke: 0.1px cyan;
  font-size: 3rem;
}

.digital-h1 {
  font-family: inherit;
  font-size: 1.6rem;
  color: cyan;
}

.digital-container{
  box-shadow: 0 0 0 20px #000000,
  -6px 12px 15px 12px #00000094,
  0 0 0 30px #2d2b2b,
  0.5px -3px 0 32px #4b4848;
}

p {
  font-size: calc(var(--font-size) * 1.5);
}

h1, h2, h3, h4, h5, h6 {
  margin: 0
}

h2, h3, h4, h5, h6 {
  font-weight: 400;
}

h1 {
  font-size: 1.8rem;
  font-family: 'Sonsie One';
  color: #7DBAFF;
  text-shadow:
  -1px -1px 0 #000,
    1px -1px 0 #000,
  -1px 1px 0 #000,
    1px 1px 0 #000;
  filter: drop-shadow(-3px 3px 0px #000);

  ::after {
    content: attr(data-text);
    position: absolute;
    left: 4px;
    top: 4px;
    color: #000;
  }
}

.xl {
  font-size: 
}

h2 {
  font-size: 2rem;
  word-spacing: -10px;
}

h3 {
  font-size: 1.5;
  word-spacing: 10px;
  font-weight: 400;
}

h4 {
  font-size: 1.2rem;
}

h5 {
  font-size: 1rem;
}

h6 {
  font-size: calc(var(--font-size) * 0.8);
  margin-inline: 30px;
  font-weight: 400;
}

input {
  border: none;
  background: none;
  font-size: calc(var(--font-size) * 1.5);
  color: cyan;
}
input:focus {outline:none;}

.drop-down-menu {
  background: linear-gradient(19deg, #ffffff26 0%, #00ffff26 100%), linear-gradient(90deg, #00ffff2b 0%, #ffffff1f 45%);
  border: solid 1px #00ffe8b8;
}

.centered {
  display: flex;
  justify-content: center;
  align-items: center;
}

.row {
  display: flex;
  flex-direction: row;
}

.column {
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  padding: 1rem;
  padding-bottom: 0;
  height: 100px;
  background-color: #FFB11A;
  border-bottom: 5px solid #4d3810;
  justify-content: space-between;
  box-shadow: 0 10px 10px 2px #00000047;
  position: relative;
}


`;

export default GlobalStyle;
