import { injectGlobal } from 'styled-components';

/* eslint no-unused-expressions: 0 */
injectGlobal`
  html,
  body {
    height: 100%;
    width: 100%;
  }

  body {
    font-family: 'Source Sans Pro', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  body.fontLoaded {
    font-family: 'Source Sans Pro', 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  #app {
    background-color: #f4f6f7;
    min-height: 100%;
    min-width: 100%;
  }

  p,
  label {
    font-family: 'Source Sans Pro', Georgia, Times, 'Times New Roman', serif;
    line-height: 1.5em;
  }
`;
