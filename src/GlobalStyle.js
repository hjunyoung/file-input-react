import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';

const GlobalStyle = createGlobalStyle`
  ${reset};

  * {
    margin:0;
    padding:0;
    box-sizing: border-box;
  }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 16px;
  }
  a {
    text-decoration: none;
    color: inherit
  }
  button {
    background-color: transparent;
    border: 0;
    cursor: pointer;
  }
`;

export default GlobalStyle;
