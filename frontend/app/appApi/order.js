import { rabineFetcher } from './fetcher/rabineFetcher';
import ObjectUtils from './fetcher/objectUtils';

const API = 'orders';

export default {
  getOrders({ deadline, clientId, siteType, status }) {
    return rabineFetcher.get(`${API}?${ObjectUtils.createParamString({ deadline, clientId, siteType, status })}`);
  },

  getOrderById({ siteId, orderId }) {
    return rabineFetcher.get(`site/${siteId}/orders/${orderId}`);
  },

  updateOrder({ siteId, orderId, payload }) {
    return rabineFetcher.put(`site/${siteId}/orders/${orderId}`, { ...payload });
  },

  createOrderNote({ siteId, orderId, content }) {
    return rabineFetcher.post(`site/${siteId}/orders/${orderId}/notes`, { content });
  },

  getOrderNotes({ siteId, orderId }) {
    return rabineFetcher.get(`site/${siteId}/orders/${orderId}/notes`);
  },

  getOrderActivities({ siteId, orderId }) {
    return rabineFetcher.get(`site/${siteId}/orders/${orderId}/activity`);
  },
};
