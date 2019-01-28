import AWS from 'aws-sdk';

import logger from 'utils/logger';

import {
  AWSAccessKeyId,
  AWSSecretAccessKey,
  AWSRegion,
  AWSAPIVersion,
  AWSRabineUpliftDest
} from '~/constants';

AWS.config.update({
  accessKeyId: AWSAccessKeyId,
  secretAccessKey: AWSSecretAccessKey,
  region: AWSRegion
});

const s3 = new AWS.S3({ apiVersion: AWSAPIVersion });

const Delimiter = '/';

class S3Folder {
  constructor(opts) {
    Object.assign(this, opts);
  }

  loadOption(opts) {
    Object.assign(this, opts);
  }

  async listS3(siteFolder, bucket, all = false, name = null) {

    if (all) {
      return this.list(name, bucket);
    }

    const existingSites = await this.site.list({ });
    const existingS3Folders = existingSites.filter(i => i.rabineS3Folder)
      .map(i => `${i.rabineS3Folder}`);

    const folders = await this.list(name, bucket);
    return folders.filter(folder => !existingS3Folders.includes(folder.name));
  }

  async list(siteFolder, bucket) {

    const params = {
      Bucket: bucket || AWSRabineUpliftDest,
      Delimiter
    };

    let prefix = null;

    if (siteFolder) {
      prefix = `${siteFolder}${Delimiter}`;
      params.Prefix = prefix;
    }

    return new Promise((resolve, reject) => {
      s3.listObjects(params, (err, response = {}) => {
        if (err) {
          logger.info('there is err', err);
          reject(err);
        } else {
          const CommonPrefixes = response.CommonPrefixes || [];

          const folders = CommonPrefixes.map((c) => {
            const { Prefix } = c;
            let name = Prefix;

            if (prefix) {
              name = name.replace(prefix, '');
            }

            name = name.replace('/', '');

            return {
              id: name,
              name
            };
          });

          resolve(folders);
        }
      });
    });
  }
}

module.exports = S3Folder;
