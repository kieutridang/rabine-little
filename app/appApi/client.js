import { rabineFetcher } from './fetcher/rabineFetcher';
import ObjectUtils from './fetcher/objectUtils';

const API = 'client';

export const clientApi = {
  getClients({ clientId, name, contactName }) {
    return rabineFetcher.get(`${API}?${ObjectUtils.createParamString({ clientId, name, contactName })}`);
  },
  createClient(client) {
    return rabineFetcher.post(`${API}`, client);
  },
};
