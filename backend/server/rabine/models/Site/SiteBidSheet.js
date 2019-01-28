import SiteSnapDB from '~/schemas/SiteSnap';

const AWS = require('aws-sdk');
const fs = require('fs');
const uuidv1 = require('uuid/v1');

// will be use same folder with logo
// in the future should be renamed to rabine-photo
const companyLogoBucket = 'rabine-client-logo';
const {
  AWSAccessKeyId,
  AWSSecretAccessKey,
  AWSRegion,
  AWSAPIVersion
} = require('../../constants');

AWS.config.update({
  accessKeyId: AWSAccessKeyId,
  secretAccessKey: AWSSecretAccessKey,
  region: AWSRegion
});

const s3 = new AWS.S3({ apiVersion: AWSAPIVersion });

class SiteBidSheet {
  constructor(opts) {
    Object.assign(this, opts);
  }

  loadOption(opts) {
    Object.assign(this, opts);
  }

  _mapModels(siteBidSheets = []) {
    return siteBidSheets.map(siteBidSheet => this._mapModel(siteBidSheet));
  }

  _mapModel(siteBidSheet = {}) {
    const {
      _id,
      siteId,
      layerId,
      bidSheetPhotoKey,
      bidSheetPhotoUrl,
      createdDate
    } = siteBidSheet;

    return {
      id: _id,
      siteId,
      layerId,
      bidSheetPhotoKey,
      bidSheetPhotoUrl,
      createdDate
    };
  }

  async create(payload) {
    const {
      siteId,
      layerId,
      bidSheetPhotoKey,
      bidSheetPhotoUrl
    } = payload;

    const site = this.site.getById(siteId);

    if (!site) {
      throw new Error('No site found');
    }

    const where = {
      deleted: false,
      siteId,
      layerId
    };
    const update = {
      bidSheetPhotoKey,
      siteId,
      layerId,
      bidSheetPhotoUrl
    };
    const opts = {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true
    };

    const data = await SiteSnapDB.findOneAndUpdate(where, update, opts);
    return this._mapModel(data);
  }

  async getBySite(siteId) {
    const query = { deleted: false, siteId };
    return SiteSnapDB.find(query)
      .then(data => this._mapModels(data))
      .then((photos) => {
        const newPhotos = photos.map(photo => ({
          ...photo,
          bidSheetPhotoUrl: this.getUrl(photo.bidSheetPhotoKey)
        }));
        return newPhotos;
      });
  }

  async uploadPhoto({ siteId, layerId, photo }) {
    const { path, filename } = photo;
    const bidSheetPhotoKey = await this.uploadPhotoFile(path, filename);
    const logoInfo = {
      siteId,
      layerId,
      bidSheetPhotoKey,
      bidSheetPhotoUrl: this.getUrl(bidSheetPhotoKey)
    };

    return this.create(logoInfo);
  }

  async uploadPhotoFile(path, filename) {
    return new Promise((resolve) => {
      fs.readFile(path, (err, filedata) => {
        const uuid = uuidv1();
        const today = new Date().toISOString();
        const photoKey = `${today}${uuid}${filename}`;

        const params = {
          Bucket: companyLogoBucket,
          Key: `bidsheet/${photoKey}`,
          Body: filedata
        };

        s3.upload(params, (error, data) => {
          if (error) {
            throw new Error(error);
          }

          return resolve(data.Key);
        });
      });
    });
  }

  getUrl(photoKey) {
    const params = {
      Bucket: companyLogoBucket,
      Key: photoKey
    };

    return s3.getSignedUrl('getObject', params);
  }
}

module.exports = SiteBidSheet;
