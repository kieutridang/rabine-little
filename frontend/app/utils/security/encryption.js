const CryptoJS = require('crypto-js');

export const encryptPlainText = (text) => {
  const encrypted = CryptoJS.SHA256(text, 'rabinesite_secret');
  return encrypted.toString();
};

