import { rabineFetcher } from './fetcher/rabineFetcher';
import ObjectUtils from './fetcher/objectUtils';

const API = 'user';

export const userApi = {
  getUsers({ userId, name, contactName }) {
    return rabineFetcher.get(`${API}?${ObjectUtils.createParamString({ userId, name, contactName })}`);
  },
  createUser(user) {
    return rabineFetcher.post(`${API}`, user);
  },
  getUserById(userId) {
    return rabineFetcher.get(`${API}/${userId}`);
  },
  inviteUser(user) {
    return rabineFetcher.post(`invite-${API}`, user);
  },
  getInvitedUsers() {
    return rabineFetcher.get(`invite-${API}`);
  },
  getInvitedUserById(userId) {
    return rabineFetcher.get(`invite-${API}/${userId}`);
  },
  resetPasswordUser(email) {
    return rabineFetcher.post('request-reset-password', email);
  },
  changePasswordUser(data) {
    return rabineFetcher.post('reset-password', data);
  },

};
