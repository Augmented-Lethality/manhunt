import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  @import url(https://fonts.googleapis.com/css?family=Source+Code+Pro);

  body {
    margin: 0;
    padding: 20px;
    display: flex;
    height: 100vh;
    box-sizing: border-box;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: rgb(48 48 58);
    color: white;
    font-family: 'Source Code Pro';
    font-size: 1rem;
    word-wrap: break-word;
  }

  button{
    background: #6e6b8c;
    color: white;
    font-size: 1em;
    margin: 1em;
    padding: 0.25em 1em;
    border: 2px solid #6e6b8c;
    border-radius: 3px;
  }

  // p {
  //   font-size: 1rem;
  //   color: #979fd0;
  // }

  // h1, h2, h3, h4, h5, h6 {
  //   color: #979fd0;
  // }

  // h1 {
  //   font-size: 2rem;
  // }

  // h2 {
  //   font-size: 1.75rem;
  // }

  // h3 {
  //   font-size: 1.5rem;
  // }
`;

export default GlobalStyle;
