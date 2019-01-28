import { rabineFetcher } from './fetcher/rabineFetcher';

const API = 'site';

export default {
  getComments(siteId) {
    const path = `${API}/${siteId}/map/comment`;
    return rabineFetcher.get(path);
  },

  getCommentById(params) {
    const { siteId, commentId } = params;
    const path = `${API}/${siteId}/map/comment/${commentId}`;
    return rabineFetcher.get(path);
  },

  createComment(siteId, payload) {
    return rabineFetcher.post(`${API}/${siteId}/map/comment`, payload);
  },

  createSharedComment(siteId, payload) {
    return rabineFetcher.post(`${API}/${siteId}/map/shared/comment`, payload);
  },

  deleteComment(siteId, commentId) {
    return rabineFetcher.delete(`${API}/${siteId}/map/comment/${commentId}`);
  },
};
