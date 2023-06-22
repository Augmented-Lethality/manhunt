import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  @import url(https://fonts.googleapis.com/css?family=Source+Code+Pro);
  @import url(https://fonts.googleapis.com/css?family=Source+Code+Pro);

  body {
    margin: 0;
    padding: 0;
    height: 100vh;
    width: 100vw;
    box-sizing: border-box;
    background: rgb(48 48 58);
    color: #6e6b8c;
    font-family: 'Source Code Pro';
    font-size: 1rem;
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

  .logo{
    color: #e6a733;
    font-family: 'Fascinate';
    font-size: 2rem;
    margin: 0;
  }

  // p {
  //   font-size: 1rem;
  //   color: #979fd0;
  // }

  // h1, h2, h3, h4, h5, h6 {
  //   color: #979fd0;
  // }

  h1 {
    font-size: 2rem;
    margin: 0;
  }

  // h2 {
  //   font-size: 1.75rem;
  // }

  // h3 {
  //   font-size: 1.5rem;
  // }
`;

export default GlobalStyle;
