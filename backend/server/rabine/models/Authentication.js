import crypto from 'crypto';
import jwt from 'jsonwebtoken';

import { jwtSecretKey } from '~/config';

import User from '~/schemas/User';
import InvitedUser from '~/schemas/InvitedUser';

class Authentication {
  constructor(opts) {
    Object.assign(this, opts);
  }

  async logout(sessionId) {
    return sessionId;
  }

  createToken(user) {
    const sessionId = this._generateKey();
    const { _id, username, fullName, role } = user;

    const userInfo = {
      _id,
      username,
      fullName,
      role
    };

    const permission = {};

    const session = {
      sessionId,
      userInfo,
      permission
    };

    const token = jwt.sign(session, jwtSecretKey, { algorithm: 'HS256' });
    return token;
  }

  async login(loginRequest) {
    const { username: userName, password } = loginRequest;

    return this._getUser(userName)
      .then((user) => {
        if (user && user.password === password) {
          const token = this.createToken(user);
          const { _id, username, fullName, role } = user;

          return {
            _id,
            token,
            username,
            fullName,
            role
          };
        }
        throw new Error('No authentication');
      });
  }

  async register(registerRequest) {
    const { username, password, fullName } = registerRequest;
    const isInvited = await this._getInvitedUser(username);
    if (!isInvited) {
      throw new Error('User is not invited yet');
    }
    return this._getUser(username)
      .then((existingUser) => {
        if (existingUser) {
          throw new Error('username is duplicated');
        }

        const sessionId = this._generateKey();
        const role = 'normal';

        const newUser = new User({
          username,
          password,
          fullName,
          sessionId,
          role
        });

        return newUser.save()
          .then((user) => {
            if (user && user.password === password) {
              const token = this.createToken(user);
              const {
                _id,
                username: existingUserName,
                fullName: existingFullName,
                role: existingRole
              } = user;

              return {
                _id,
                token,
                username: existingUserName,
                fullName: existingFullName,
                role: existingRole
              };
            }

            throw new Error('No authentication');
          });
      });
  }

  async _getInvitedUser(username) {
    return InvitedUser.findOne({ username })
      .then(data => data)
      .catch((err) => {
        throw new Error(err);
      });
  }

  async _getUser(username) {
    return User.findOne({ username });
  }

  _generateKey() {
    const sha = crypto.createHash('sha256');
    sha.update(Math.random().toString());
    return sha.digest('hex');
  }
}

module.exports = Authentication;
