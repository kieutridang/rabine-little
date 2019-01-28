import { rabineFetcher } from './fetcher/rabineFetcher';

const API = 'repair';

export default {
  getComments(repairInstanceId) {
    const path = `${API}/${repairInstanceId}/comment`;
    return rabineFetcher.get(path);
  },

  getCommentById(params) {
    const { repairInstanceId, commentId } = params;
    const path = `${API}/${repairInstanceId}/comment/${commentId}`;
    return rabineFetcher.get(path);
  },

  createComment(repairInstanceId, payload) {
    return rabineFetcher.post(`${API}/${repairInstanceId}/comment`, payload);
  },

  createSharedComment(repairInstanceId, payload) {
    return rabineFetcher.post(`${API}/${repairInstanceId}/shared/comment`, payload);
  },

  deleteComment(repairInstanceId, commentId) {
    return rabineFetcher.delete(`${API}/${repairInstanceId}/comment/${commentId}`);
  },
};
