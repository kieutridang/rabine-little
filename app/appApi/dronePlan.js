import { rabineFetcher } from './fetcher/rabineFetcher';

const API = 'plan';

export default {
  getDronePlans() {
    return rabineFetcher.get(`${API}`);
  },
};
