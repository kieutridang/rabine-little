import { rabineFetcher } from './fetcher/rabineFetcher';

const API = 'site';
const PHOTOS_API = 'photos';

export default {
  getSiteAreas(params) {
    const query = params.token ? `token=${params.token}` : '';
    return rabineFetcher.get(`${API}/${params.siteId}/areas?${query}`);
  },
  getSiteArea(params) {
    let query = '';
    const { token, page, pageSize } = params;
    if (token) {
      query = page ? `?token=${token}&page=${page}&pageSize=${pageSize}` : `?token=${token}`;
    } else {
      query = page ? `?page=${page}&pageSize=${pageSize}` : '';
    }

    return rabineFetcher.get(`${API}/${params.siteId}/areas/${params.areaId}${query}`);
  },
  toggleAreaPhotoDefected(args = {}) {
    const { params: { siteId, areaId, photoId, defected } } = args;
    const path = `${API}/${siteId}/areas/${areaId}/photos/${photoId}/defect/${defected}`;

    return rabineFetcher.put(path);
  },
  setAreaPhotoDefectedType(args = {}) {
    const { params: { siteId, areaId, photoId, repairId } } = args;
    const path = `${API}/${siteId}/areas/${areaId}/photos/${photoId}/defectType/${repairId}`;

    return rabineFetcher.put(path);
  },
  setAreaPhotoDefectedSeverity(args = {}) {
    const { params: { siteId, areaId, photoId, severity } } = args;
    const path = `${API}/${siteId}/areas/${areaId}/photos/${photoId}/severity/${severity}`;

    return rabineFetcher.put(path);
  },
  toggleAreaPhotoRepair(args = {}) {
    const { params: { siteId, areaId, photoId, repair } } = args;
    const path = `${API}/${siteId}/areas/${areaId}/photos/${photoId}/repair/${repair}`;

    return rabineFetcher.put(path);
  },
  setAreaPhotoRepairName(args = {}) {
    const { params: { siteId, areaId, photoId, repairName } } = args;
    const path = `${API}/${siteId}/areas/${areaId}/photos/${photoId}/repairName/${repairName}`;

    return rabineFetcher.put(path);
  },
  addAreaPhotoRepair(args = {}) {
    const { photoId, repairId, repairName, index } = args;
    const path = `${PHOTOS_API}/${photoId}/repairs`;
    const payload = { repairId, repairName, index };

    return rabineFetcher.post(path, payload);
  },
  deleteAreaPhotoRepair(args = {}) {
    const { photoId, repairId } = args;
    const path = `${PHOTOS_API}/${photoId}/repairs/${repairId}`;

    return rabineFetcher.delete(path);
  },
  getAreaPhotoRepairs(photoId) {
    const path = `${PHOTOS_API}/${photoId}/repairs`;

    return rabineFetcher.get(path);
  },

  createAnnotation(args = {}) {
    const { photoId } = args;
    return rabineFetcher.post(`photos/${photoId}/annotations`, args);
  },
  getAnnotations(photoId) {
    return rabineFetcher.get(`photos/${photoId}/annotations`);
  },
  updateAnnotation(args = {}) {
    const { annotationId, data } = args;
    return rabineFetcher.put(`photos/${data.photoId}/annotations/${annotationId}`, data);
  },
  deleteAnnotation(args = {}) {
    const { photoId, annotationId } = args;
    return rabineFetcher.delete(`photos/${photoId}/annotations/${annotationId}`);
  },
  setDeleteAreaPhoto(args = {}) {
    const { siteId, areaId, photoId, isDeleted } = args;
    const path = `${API}/${siteId}/areas/${areaId}/photo/${photoId}/is-deleted/${isDeleted}`;
    return rabineFetcher.put(path);
  },
  setDeleteAreaPhotos(args = {}) {
    const { siteId, areaId, isDeleted } = args;
    const path = `${API}/${siteId}/areas/${areaId}/is-deleted/${isDeleted}`;
    return rabineFetcher.put(path);
  },
};
