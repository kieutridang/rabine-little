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
  editClient(clientId, payload) {
    return rabineFetcher.put(`${API}/${clientId}`, payload);
  },
  getClientById(clientId) {
    return rabineFetcher.get(`${API}/${clientId}`);
  },
  deleteClient(clientId) {
    return rabineFetcher.delete(`${API}/${clientId}`);
  },
  uploadCompanyLogo(companyLogo) {
    return rabineFetcher.formData(`${API}/company-logo`, companyLogo);
  },
  deleteCompanyLogo(companyLogoKey) {
    return rabineFetcher.delete(`${API}/company-logo/${companyLogoKey}`);
  },
};
