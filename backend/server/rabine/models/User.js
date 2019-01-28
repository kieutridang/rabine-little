import jwt from 'jsonwebtoken';

import InvitedUserDB from '~/schemas/InvitedUser';
import UserDB from '~/schemas/User';
import Mailer from '~/util/mailer';
import { clientUrl } from '~/constants';
import { jwtSecretKey } from '~/config';
import logger from 'utils/logger';

class User {
  _mapModels(usersDB) {
    return usersDB.map((user) => {
      const { _id, fullName, username, role, userType, company, clientTitle } = user;

      return {
        id: _id,
        fullName,
        username,
        role,
        userType,
        company,
        clientTitle
      };
    });
  }

  _mapModel(userDB = {}) {
    const { _id, fullName, username, role } = userDB;

    return {
      id: _id,
      fullName,
      username,
      role
    };
  }

  async create(userRequest) {
    const { fullName, username, userType, company, clientTitle } = userRequest;

    try {
      const existedUser = await this.findUserByUsername(userRequest);
      if (!existedUser) {
        const invitedUser = new InvitedUserDB({
          fullName,
          username,
          userType,
          company,
          clientTitle
        });

        const savedUser = await invitedUser.save();
        this.sendInviteUserEmail(savedUser);
        return savedUser;
      }

      throw new Error('User existed');
    } catch (err) {
      logger.error('There is error when receiving plans', err);
      throw err;
    }
  }

  async sendInviteUserEmail(user) {
    const target = { email: user.username };

    Mailer.send(
      'invite',
      target,
      'Rabinesite — You’re Invited!',
      {
        clientUrl,
        _id: user._id,
        fullName: user.fullName,
        email: user.username
      }
    );
  }

  async findUserByUsername(userRequest) {
    try {
      const { username } = userRequest;
      const user = await UserDB.findOne({ username });

      return user;
    } catch (err) {
      throw new Error(err);
    }
  }

  async requestResetPassword(email) {
    const existedUser = await this.findUserByUsername({ username: email });

    if (existedUser) {
      const resetToken = jwt.sign(
        { email },
        jwtSecretKey,
        { algorithm: 'HS256', expiresIn: '1h' }
      );
      const target = { email };

      Mailer.send(
        'reset-password',
        target,
        'Rabinesite - Please reset your password',
        {
          clientUrl,
          fullName: existedUser.fullName,
          email,
          resetToken
        }
      );
      return resetToken;
    }

    throw new Error('User not existed');
  }

  async resetPassword(newPassword, token) {
    try {
      const decoded = await jwt.verify(token, jwtSecretKey);
      const { email } = decoded;

      return UserDB.update(
        { username: email },
        { $set: { password: newPassword } },
        { new: true }
      )
      .then(data => data)
      .catch((err) => {
        throw new Error(err);
      });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async listInvitedUser(filter) {
    const query = { deleted: false };
    const { name, id } = filter;

    if (name && typeof name === 'string') {
      query.fullName = { $regex: name };
    }
    if (id && typeof id === 'string') {
      query._id = id;
    }

    try {
      const invitedUserDB = await InvitedUserDB.find(query);

      return this._mapModels(invitedUserDB);
    } catch (err) {
      throw new Error(err);
    }
  }

  async list(filter) {
    const query = { deleted: false };
    const { name } = filter;

    if (name && typeof name === 'string') {
      query.fullName = { $regex: name };
    }

    try {
      const usersDB = await UserDB.find(query);

      return this._mapModels(usersDB);
    } catch (err) {
      throw new Error(err);
    }
  }
}

module.exports = User;
