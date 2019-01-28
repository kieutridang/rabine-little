import jwtDecode from 'jwt-decode';
import {
  API_LOGIN_PATH,
  API_SIGNUP_PATH,
  API_LOGOUT_PATH,
} from '../constants';
import { rabineFetcher } from './fetcher/rabineFetcher';
const { localStorage = {} } = global.window;

const auth = {
  login(username, password, reRoute) {
    if (auth.loggedIn()) {
      return Promise.resolve(true);
    }

    return rabineFetcher.post(API_LOGIN_PATH, { username, password })
      .then((response) => {
        localStorage.token = response.token;
        if (reRoute) {
          window.browserHistory.push('/dashboard');
        }
        return Promise.resolve(response);
      });
  },

  logout() {
    return rabineFetcher.get(API_LOGOUT_PATH)
      .then((response) => {
        if (response) {
          localStorage.removeItem('token');
          localStorage.removeItem('mapControlsState');
        }
      });
  },

  loggedIn() {
    return !!localStorage.token;
  },

  isAuthenticated: (api) => (...args) => api(...args),

  signup(username, password, name) {
    const data = { username, password, fullName: name };
    return rabineFetcher.post(API_SIGNUP_PATH, data)
      .then(() => {
        auth.login(username, password, true); // reroute
      });
  },

  userInfo() {
    if (auth.loggedIn()) {
      return jwtDecode(localStorage.token).userInfo;
    }
    return null;
  },
};

export default auth;
