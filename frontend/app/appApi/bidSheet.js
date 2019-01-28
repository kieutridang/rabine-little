import { rabineFetcher } from './fetcher/rabineFetcher';

const API = 'client';

export const bidSheetAPI = {
  addValues(clientId, params) {
    const path = `${API}/${clientId}/sheet`;
    return rabineFetcher.post(path, { bidSheetData: params });
  },
  getValues(clientId) {
    const path = `${API}/${clientId}/sheet`;
    return rabineFetcher.get(path);
  },
};
