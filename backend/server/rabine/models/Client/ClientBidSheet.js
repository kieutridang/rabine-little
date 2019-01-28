import ClientBidSheetDB from '~/schemas/ClientBidSheet';

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

class ClientBidSheet {
  constructor(opts) {
    Object.assign(this, opts);
  }

  loadOption(opts) {
    Object.assign(this, opts);
  }

  async _mapModel(clientBidSheet = {}) {
    const {
      _id,
      clientId,
      bidSheetData,
      createdDate
    } = clientBidSheet;


    return {
      id: _id,
      clientId,
      bidSheetData,
      createdDate
    };
  }

  async create(clientId, bidSheetData) {

    return this.site.client.getById(clientId)
    .then((client) => {

      if (!client) {
        throw new Error('No client found');
      }

      const options = { upsert: true, new: true, setDefaultsOnInsert: true };

      return ClientBidSheetDB.findOneAndUpdate(
        { deleted: false, clientId },
        { clientId, bidSheetData },
        options
      )
      .then(data => this._mapModel(data));
    });
  }

  async getByClient(clientId) {
    const query = { deleted: false, clientId };

    return ClientBidSheetDB.findOne(query)
    .then(data => this._mapModel(data));
  }


  async uploadPhoto(clientId, photo) {
    const { path, filename } = photo;

    const bidSheetPhotoKey = await this.uploadPhotoFile(path, filename);

    const logoInfo = {
      bidSheetPhotoKey,
      bidSheetPhotoUrl: this.getUrl(bidSheetPhotoKey)
    };

    return logoInfo;
  }

  uploadPhotoFile(path, filename) {
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

module.exports = ClientBidSheet;
