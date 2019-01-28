const jwt = require('jsonwebtoken');

const verify = token => new Promise((resolve, reject) => {
  jwt.verify(token, 'secret', (err, decoded) => {
    if (err) {
      reject(err);
    } else {
      resolve(decoded);
    }
  });
});

module.exports = verify;
