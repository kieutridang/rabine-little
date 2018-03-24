import { rabineFetcher } from './rabineFetcher';
import ObjectUtils from './objectUtils';

const API = 'client';

export const clientApi = {
  getClients({ clientId, name, contactName }) {
    return rabineFetcher.get(`${API}?${ObjectUtils.createParamString({ clientId, name, contactName })}`);
  },
  createClient(client) {
    return rabineFetcher.post(`${API}`, client);
  },
};
