import { rabineFetcher } from './fetcher/rabineFetcher';

const API = 'plan';

export default {
  getDronePlans() {
    return rabineFetcher.get(`${API}`);
  },

  getAllDronePlans() {
    return rabineFetcher.get(`${API}?all=true`);
  },
};
