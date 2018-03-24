import FetcherFactory from './fetcherFactory';
import { API_URL } from '../../constants';
const getHeaders = () => ({});

export const rabineFetcher = FetcherFactory.createApi({
  urlModifier: (url) => `${API_URL}/${url}`,
  getHeaders: () => getHeaders(),
});

