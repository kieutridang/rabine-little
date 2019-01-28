import axios from 'axios';
import * as awsCli from 'aws-cli-js';

import {
  AWSAccessKeyId,
  AWSSecretAccessKey,
  AWSRabineUpliftDest,
  AWSRabineUpliftSrc,
  S3TransferUrl
} from '~/config';

import logger from 'utils/logger';

const { Options, Aws } = awsCli;

class S3AWS {
  constructor(opts) {
    Object.assign(this, opts);
    const options = new Options(AWSAccessKeyId, AWSSecretAccessKey);
    this.aws = new Aws(options);
  }

  loadOption(opts) {
    Object.assign(this, opts);
  }

  _buildS3RemoveUrl() {
    return `${S3TransferUrl}/api/s3/remove`;
  }

  _buildS3CopyUrl() {
    return `${S3TransferUrl}/api/s3/copy`;
  }

  async copyFolder(siteInfo) {
    const { siteId, folder } = siteInfo;

    this.syncRemoveOldS3Folder(folder);
    await this.site.syncSiteAreas(siteId, folder);

    return this.syncCopyS3SourceToDestination(folder);
  }

  async syncCopyS3SourceToDestination(folder) {
    const url = this._buildS3CopyUrl();

    return url && axios.post(url, { folder })
      .then(response => response.data)
      .catch((err) => {
        throw new Error(err);
      });
  }

  syncRemoveOldS3Folder(folder) {
    const url = this._buildS3RemoveUrl();

    return url && axios.post(url, { folder })
      .catch((err) => {
        throw new Error(err);
      });
  }

  async getItemListOfFolder(sourceFolder) {
    const info = { images: [], videos: [] };

    try {
      const data = await this.aws.command(`s3 ls ${sourceFolder} --recursive --summarize | grep -i '.jpeg\\|.jpg'`);

      const lines = data.raw.split('\n').filter((i) => {
        const lower = i ? i.toLowerCase() : '';
        return lower.includes('.jpg') || lower.includes('.jpeg');
      });

      info.images = lines.map(i => i && i.split(' ')[i.split(' ').length - 1]);
    } catch (err) {
      logger.error('error getting info from s3 folder', err);
    }

    try {
      const videoData = await this.aws.command(`s3 ls ${sourceFolder}Videos/ --recursive --summarize | grep -i '.mp4'`);
      const videoLines = videoData.raw.split('\n').filter(i => i.indexOf('.mp4') > 0);
      info.videos = videoLines.map(i => i && i.split(' ')[i.split(' ').length - 1]);
    } catch (err) {
      logger.error('error getting info from s3 videos folder', err);
    }

    return info;
  }

  async syncFolderItems(siteInfo) {
    const { folder } = siteInfo;

    if (folder && folder.length > 0) {
      const srcFolder = `s3://${AWSRabineUpliftSrc}/${folder}/`;
      // const destFolder = `s3://${AWSRabineUpliftDest}/${folder}/`;

      const sourceInfo = await this.getItemListOfFolder(srcFolder);
      const destinationInfo = await this.areaPhoto.getAreaPhotosOfFolder(folder);

      // get difference between 2 info
      const differenceUrls = destinationInfo.filter(item =>
        sourceInfo.images.indexOf(item.url) < 0 &&
        sourceInfo.videos.indexOf(item.url) < 0)
        .map(i => i.url);

      if (differenceUrls && differenceUrls.length > 0) {
        await this.areaPhoto.removeAreaPhotos(differenceUrls);
      }

      return {
        differenceUrls,
        sourceInfo,
        destinationInfo
      };
    }

    throw new Error('folder is incorrect');
  }

  async syncFolder() {
    const sourceFolder = `s3://${AWSRabineUpliftSrc}/`;
    const destFolder = `s3://${AWSRabineUpliftDest}/`;

    try {
      await this.aws.command(`s3 sync ${sourceFolder} ${destFolder}`);
    } catch (err) {
      logger.error('error syncing the s3 folder', sourceFolder, destFolder, err);
    }

    return {
      raw: 'sync is in processing'
    };
  }

  async getInfo(getInfoRequest) {
    const { folder } = getInfoRequest;

    const info = {
      imageCount: -1,
      videoCount: -1,
      syncedPhotos: -1,
      syncedVideos: -1
    };

    const sourceFolder = `s3://${AWSRabineUpliftSrc}/${folder}/`;

    try {
      info.syncedPhotos = await this.areaPhoto.getAreaPhotosCountOf(folder);
      info.syncedVideos = await this.areaVideo.getAreaVideosCountOf(folder);
    } catch (err) {
      logger.error('error getting count of s3 photos/videos', sourceFolder, err);
    }

    try {
      const data = await this.aws.command(`s3 ls ${sourceFolder} --recursive --summarize | grep -i '.jpeg\\|.jpg'`);

      const lines = data.raw.split('\n')
        .filter((i) => {
          const lowered = i ? i.toLowerCase() : '';
          return lowered.includes('.jpg') || lowered.includes('.jpeg');
        })
        .map(i => i && i.split(' ')[i.split(' ').length - 1])
        .filter(i => i && i.split('/').length === 3);

      info.imageCount = lines.length;
    } catch (err) {
      logger.error('error getting ingo for s3 folder', sourceFolder, err);
    }

    try {
      const videoData = await this.aws.command(`s3 ls ${sourceFolder}Videos/ --recursive --summarize | grep -i '.mp4'`);
      const videoLines = videoData.raw.split('\n')
        .filter(i => i.includes('.mp4'))
        .map(i => i && i.split(' ')[i.split(' ').length - 1])
        .filter(i => i && i.split('/').length === 4);

      info.videoCount = videoLines.length;
    } catch (err) {
      logger.error('error getting info from s3 videos folder', err);
    }

    return info;
  }
}

module.exports = S3AWS;
