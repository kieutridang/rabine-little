export const updateUrlParameter = (originalUri, key, value) => {
  let uri = originalUri;
  const i = uri.indexOf('#');
  const hash = i === -1 ? '' : uri.substr(i);
  uri = i === -1 ? uri : uri.substr(0, i);
  const re = new RegExp(`([?&])${key}=.*?(&|$)`, 'i');
  const separator = uri.indexOf('?') !== -1 ? '&' : '?';
  if (!value) {
    uri = uri.replace(new RegExp(`([?&]?)${key}=[^&]*`, 'i'), '');
    if (uri.slice(-1) === '?') {
      uri = uri.slice(0, -1);
    }
    if (uri.indexOf('?') === -1) uri = uri.replace(/&/, '?');
  } else if (uri.match(re)) {
    uri = uri.replace(re, `$1${key}=${value}$2`);
  } else {
    uri = `${uri + separator + key}=${value}`;
  }
  return uri + hash;
};

export const equalMatch = (value, filter) => {
  if (value && filter) {
    return value.toString() === filter.toString();
  } else if (!value) {
    return false;
  }

  return true;
};

export const formatBytes = (bytes) => {
  if (bytes < 1024) return `${bytes} Bytes`;
  else if (bytes < 1048576) return `${(bytes / 1024).toFixed(3)} KB`;
  else if (bytes < 1073741824) return `${(bytes / 1048576).toFixed(3)} MB`;
  return `${(bytes / 1073741824).toFixed(3)} GB`;
};
