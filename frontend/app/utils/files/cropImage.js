const createImage = (url, crossOrigin = 'anonymous') =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.crossOrigin = crossOrigin;
    image.src = url;
  });

/**
 * adapted from the https://github.com/DominicTobias/react-image-crop
 * @param {File} image - Image File url
 * @param {Object} pixelCrop - pixelCrop Object provided by react-easy-crop
 */
export default async function getCroppedImage(imageSrc, pixelCrop, crossOrigin) {
  const image = await createImage(imageSrc, crossOrigin);
  const canvas = document.createElement('canvas');
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext('2d');

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  // As Base64 string
  // return canvas.toDataURL('image/jpeg');

  // As a blob
  return new Promise((resolve) => {
    canvas.toBlob((file) => {
      resolve({
        blob: file,
        objectUrl: URL.createObjectURL(file),
      });
    }, 'image/jpeg');
  });
}
