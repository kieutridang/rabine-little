/**
 * app.js
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

// Needed for appRedux-saga es6 generator support
import 'babel-polyfill';

// Import all the third party stuff
import React from 'react';
import Modal from 'react-modal';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import FontFaceObserver from 'fontfaceobserver';
import createHistory from 'history/createBrowserHistory';
import 'sanitize.css/sanitize.css';
import 'react-select/dist/react-select.css';

import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/ag-theme-material.css';
import { LicenseManager } from 'ag-grid-enterprise/main';

// Import root app
import App from 'containers/App';

// Import Language Provider
import LanguageProvider from 'containers/LanguageProvider';

// Load the favicon, the manifest.json file and the .htaccess file
/* eslint-disable import/no-webpack-loader-syntax */
import '!file-loader?name=[name].[ext]!./images/favicon.ico';
import '!file-loader?name=[name].[ext]!./manifest.json';
import 'file-loader?name=[name].[ext]!./.htaccess'; // eslint-disable-line import/extensions
/* eslint-enable import/no-webpack-loader-syntax */

import configureStore from './configureStore';

// Import i18n messages
import { translationMessages } from './i18n';

// Load Google Maps
import './google-maps-loader';

// Import CSS reset and Global Styles
import './global-styles';

// Observe loading of Source Sans Pro (to remove Source Sans Pro, remove the <link> tag in
// the index.html file and this observer)
const sourceSansProObserver = new FontFaceObserver('Source Sans Pro', {});

// When Open Sans is loaded, add a font-family using Open Sans to the body
sourceSansProObserver.load().then(() => {
  document.body.classList.add('fontLoaded');
}, () => {
  document.body.classList.remove('fontLoaded');
});

// Create appRedux store with history
const initialState = {};
const history = createHistory();
window.browserHistory = history;
const store = configureStore(initialState, history);
const MOUNT_NODE = document.getElementById('app');
MOUNT_NODE.setAttribute('style', 'background-color: rgba(0, 0, 0, 0.75);');

Modal.setAppElement(MOUNT_NODE);

LicenseManager.setLicenseKey('Evaluation_License_Valid_Until__11_August_2018__MTUzMzk0MjAwMDAwMA==6f92d56ec392de1c9f07ac3bc2cc7059');

const render = (messages) => {
  ReactDOM.render(
    <Provider store={store}>
      <LanguageProvider messages={messages}>
        <ConnectedRouter history={history}>
          <App history={history} />
        </ConnectedRouter>
      </LanguageProvider>
    </Provider>,
    MOUNT_NODE
  );
};

if (module.hot) {
  // Hot reloadable React components and translation json files
  // modules.hot.accept does not accept dynamic dependencies,
  // have to be constants at compile-time
  module.hot.accept(['./i18n', 'containers/App'], () => {
    ReactDOM.unmountComponentAtNode(MOUNT_NODE);
    render(translationMessages);
  });
}

// Chunked polyfill for browsers without Intl support
if (!window.Intl) {
  (new Promise((resolve) => {
    resolve(import('intl'));
  }))
    .then(() => Promise.all([
      import('intl/locale-data/jsonp/en.js'),
      import('intl/locale-data/jsonp/de.js'),
    ]))
    .then(() => render(translationMessages))
    .catch((err) => {
      throw err;
    });
} else {
  render(translationMessages);
}

// Install ServiceWorker and AppCache in the end since
// it's not most important operation and if main code fails,
// we do not want it installed
require('offline-plugin/runtime').install(); // eslint-disable-line global-require
