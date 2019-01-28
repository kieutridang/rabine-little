import { rabineFetcher } from './fetcher/rabineFetcher';

const API = 'site';

export const areaVideosApi = {
  getAreaVideos(params) {
    let query = '';
    const { token, page, pageSize } = params;

    if (token) {
      query = page ? `?token=${token}&page=${page}&pageSize=${pageSize}` : `?token=${token}`;
    } else {
      query = page ? `?page=${page}&pageSize=${pageSize}` : '';
    }

    return rabineFetcher.get(`${API}/${params.siteId}/areas/${params.areaName}/video${query}`);
  },
};
