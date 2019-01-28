export const getUrlParams = (url = '') => {
  const hashes = url.slice(url.indexOf('?') + 1).split('&');
  const params = {};
  hashes.map((hash) => {
    const [key, val] = hash.split('=');
    params[key] = decodeURIComponent(val);
    return true;
  });
  return params;
};

export default { getUrlParams };
