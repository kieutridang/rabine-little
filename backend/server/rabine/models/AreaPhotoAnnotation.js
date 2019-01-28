import AreaPhotoAnnotationDB from '~/schemas/AreaPhotoAnnotation';

class AreaPhotoAnnotation {
  constructor(opts) {
    Object.assign(this, opts);
  }

  _mapModels(photoAnnotationItems = []) {
    return photoAnnotationItems.map(photoAnnotationItem => this._mapModel(photoAnnotationItem));
  }

  _mapModel(photoAnnotationItem) {
    const {
      _id,
      photoId,
      title,
      index,
      description,
      geojson
    } = photoAnnotationItem;

    return {
      _id,
      photoId,
      title,
      index,
      description,
      geojson
    };
  }

  async create(photoId, annotationPayload) {
    const annotation = { ...annotationPayload, photoId };
    const photoAnnotation = new AreaPhotoAnnotationDB(annotation);

    return photoAnnotation.save()
      .then(data => this._mapModel(data));
  }

  async update(annotationId, annotationPayload) {
    const query = { _id: annotationId };
    const annotation = { ...annotationPayload };

    return AreaPhotoAnnotationDB.findOneAndUpdate(query, annotation, { new: true })
      .then(data => this._mapModel(data));
  }

  async remove(annotationId) {
    return AreaPhotoAnnotationDB.remove({ _id: annotationId })
      .then(data => this._mapModel(data));
  }

  async getAnnotationsOfPhoto(photoId) {
    return AreaPhotoAnnotationDB.find({ photoId })
      .then(data => this._mapModels(data));
  }
}

module.exports = AreaPhotoAnnotation;
