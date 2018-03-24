import 'whatwg-fetch';
import ObjectUtils from './objectUtils';
import auth from '../auth';

const { isAuthenticated } = auth;

const FetcherFactory = {
  createApi({ urlModifier, getHeaders }) {
    const createHeaders = () => {
      const headers = new Headers();
      ObjectUtils.forEach(getHeaders(), (value, key) => {
        headers.append(key, value);
      });

      return headers;
    };

    const withPayload = isAuthenticated((method) => (url, data) => {
      const headers = createHeaders();
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json');

      return fetch(
        urlModifier(url),
        {
          method,
          body: data == null ? undefined : JSON.stringify(data),
          headers,
        }
      )
        .then(checkStatus)
        .then(checkException)
        .then(parseJSON);
    });

    const withoutPayload = isAuthenticated((method) => (url) => {
      const headers = createHeaders();
      headers.append('Content-Type', 'application/json');

      return fetch(
        urlModifier(url),
        {
          method,
          headers,
        }
      )
        .then(checkStatus)
        .then(checkException)
        .then(parseJSON);
    });

    return {
      get: withoutPayload('GET'),
      delete: withoutPayload('DELETE'),
      post: withPayload('POST'),
      put: withPayload('PUT'),
    };
  },
};

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  // parse response
  return response.json().then((json) => { // eslint-disable-line arrow-body-style
    return {
      json,
      throwError: true,
    };
  });
}

// this checks if response had an error and in this case it throws it
function checkException(response) {
  if (response.throwError === true) {
    const error = {};
    error.error = response.json;
    throw error;
  }

  return response;
}

function parseJSON(response) {
  return response.json();
}

export default FetcherFactory;
