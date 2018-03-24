import {
  API_URL,
  API_LOGIN_PATH,
  API_SIGNUP_PATH,
  API_LOGOUT_PATH,
} from '../constants';
import request from './fetcher/request';
const localStorage = global.window.localStorage;

const auth = {
  callAPI(url, method = 'GET', payload = null) {
    const requestData = {
      method,
      headers: { 'Content-Type': 'application/json' },
    };

    if (payload && method !== 'GET') {
      requestData.body = payload;
    }

    return request(`${API_URL}/${url}`, requestData);
  },

  login(username, password, reRoute) {
    if (auth.loggedIn()) {
      return Promise.resolve(true);
    }

    return request(`${API_URL}/${API_LOGIN_PATH}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    }).then((response) => {
      localStorage.rabine_session = response.sessionId;
      if (reRoute) {
        window.browserHistory.push('/dashboard');
      }
      return Promise.resolve(response);
    });
  },

  logout() {
    return auth
    .callAPI(API_LOGOUT_PATH)
    .then((response) => {
      if (response) {
        localStorage.removeItem('rabine_session');
      }
    });
  },

  loggedIn() {
    return !!localStorage.rabine_session;
  },

  isAuthenticated: (api) => (...args) => {
    if (!auth.loggedIn()) {
      return Promise.reject('Unauthorized to process this action');
    }

    return api(...args);
  },

  signup(username, password, name) {
    return request(`${API_URL}/${API_SIGNUP_PATH}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, fullName: name }),
    }).then(() => {
      auth.login(username, password, true); // reroute
    });
  },
};

export default auth;
