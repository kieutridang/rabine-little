const AWS = require('aws-sdk');
const fs = require('fs');
const uuidv1 = require('uuid/v1');

const companyLogoBucket = 'rabine-client-logo';

const { AWSAccessKeyId, AWSSecretAccessKey, AWSRegion, AWSAPIVersion } = require('../constants');

AWS.config.update({
  accessKeyId: AWSAccessKeyId,
  secretAccessKey: AWSSecretAccessKey,
  region: AWSRegion
});

const s3 = new AWS.S3({ apiVersion: AWSAPIVersion });

class CompanyLogo {
  constructor(opts) {
    Object.assign(this, opts);
  }

  async uploadLogo(companyLogo) {
    const { path, filename } = companyLogo;

    const logoKey = await this.uploadLogo(path, filename);

    const logoInfo = {
      companyLogoKey: logoKey,
      companyLogoURL: this.getUrl(logoKey)
    };

    return logoInfo;
  }

  upload(path, filename) {
    return new Promise((resolve) => {

      fs.readFile(path, (err, filedata) => {
        const uuid = uuidv1();
        const today = new Date().toISOString();
        const companyLogoKey = `${today}${uuid}${filename}`;
        const params = {
          Bucket: companyLogoBucket,
          Key: `${companyLogoKey}`,
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

  getUrl(keylogo) {
    const params = {
      Bucket: companyLogoBucket,
      Key: `${keylogo}`
    };

    return s3.getSignedUrl('getObject', params);
  }

  async delete(keylogo) {
    const params = {
      Bucket: companyLogoBucket,
      Key: `${keylogo}`
    };

    s3.deleteObject(params, (err) => {
      if (err) {
        throw new Error(err);
      }
    });
  }
}

module.exports = CompanyLogo;
