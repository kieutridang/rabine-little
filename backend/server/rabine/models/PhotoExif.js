import PhotoExifDB from '~/schemas/PhotoExif';

class PhotoExif {
  async getFolderItems(siteFolder, areaFolder) {
    const folderPath = `^${siteFolder}/${areaFolder}/`;
    const query = {};

    if (folderPath && typeof folderPath === 'string') {
      query.relativePath = { $regex: folderPath };
    }

    return PhotoExifDB.find(query).then((exifItems) => {
      return exifItems;
    });
  }
}

module.exports = PhotoExif;
