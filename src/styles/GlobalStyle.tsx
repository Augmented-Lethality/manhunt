import { createGlobalStyle } from 'styled-components';

const GlobalStyle: React.NamedExoticComponent<any> = createGlobalStyle`

  body {
    margin: 0;
    padding: 0;
    height: 100vh;
    width: 100vw;
    box-sizing: border-box;
    background: #4C4E61;
    color: #6e6b8c;
    font-family: 'Source Code Pro';
    font-size: var(--font-size);
    word-wrap: break-word;
  }

  button{
    background: #6e6b8c;
    color: #dddddd;
    font-size: 1em;
    margin: 1em;
    padding: 0.25em 1em;
    border: 2px solid #6e6b8c;
    border-radius: 3px;
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
    font-family: 'Fascinate';
    font-size: 2rem;
    margin: 0;
  }

  .react-icon{
    font-size: 3rem;
    color: #6e6b8c;
  }

  .react-icon-large{
    position: relative;
    top: -11px;
    font-size: 2rem;
    padding: 10px;
    border-radius: 50%;
    background-color: rgb(48 48 58);
    color: #6e6b8c;
    border: 3px solid #6e6b8c;
    box-shadow: 0 0 0 4px #1b1b1b;
  }
  
  .react-icon-logo{
  font-size: 3rem;
  color: black;
  background: #e6a733;
  border-radius: 50%;
  padding: 2vw;
  border: 2px solid black;
  }

  p {
    font-size: calc(var(--font-size) * 1.5);
    color: #6e6b8c;
  }

  // h1, h2, h3, h4, h5, h6 {
  //   color: #979fd0;
  // }

  h1 {
    font-size: 2rem;
    margin: 0;
  }

  h3 {
    font-size: calc(var(--font-size) * 1.5);
    color: #b8b8b8;
    font-weight: 400;    
  }

  input {
    border: none;
    background: none;
    height: 100%;
    width: 100%;
    font-size: calc(var(--font-size) * 1.5);
    color: #979fd0;
  }
`;

export default GlobalStyle;
