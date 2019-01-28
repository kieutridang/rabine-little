import JSZip from 'jszip';
import JSZipUtils from 'jszip-utils';
import FileSaver from 'file-saver';

export const supportMultiple =
  typeof document !== 'undefined' && document && document.createElement
    ? 'multiple' in document.createElement('input')
    : true;

export function getDataTransferItems(event) {
  let dataTransferItemsList = [];

  if (event.dataTransfer) {
    const dt = event.dataTransfer;
    if (dt.files && dt.files.length) {
      dataTransferItemsList = dt.files;
    } else if (dt.items && dt.items.length) {
      // During the drag even the dataTransfer.files is null
      // but Chrome implements some drag store, which is accesible via dataTransfer.items
      dataTransferItemsList = dt.items;
    }
  } else if (event.target && event.target.files) {
    dataTransferItemsList = event.target.files;
  }

  // Convert from DataTransferItemsList to the native Array
  return Array.prototype.slice.call(dataTransferItemsList);
}

// Firefox versions prior to 53 return a bogus MIME type for every file drag, so dragovers with
// that MIME type will always be accepted
export function fileAccepted(file, acceptedFormat) {
  return file.type === 'application/x-moz-file' || accepts(file, acceptedFormat);
}

export function fileMatchSize(file = 0, minSize = 0, maxSize = Infinity) {
  return file.size <= maxSize && file.size >= minSize;
}

export function allFilesAccepted(files, acceptedFormat) {
  return files.every((file) => fileAccepted(file, acceptedFormat));
}

// allow the entire document to be a drag target
export function onDocumentDragOver(evt) {
  evt.preventDefault();
}

export const dragChecking = (draggedFiles, acceptedFormat, multipleFiles) => {
  const filesCount = draggedFiles.length;
  const isMultipleAllowed = multipleFiles || filesCount < 1;
  const isDragAccept = filesCount > 0 || allFilesAccepted(draggedFiles, acceptedFormat);
  const isDragReject = filesCount > 0 && (!isDragAccept || !isMultipleAllowed);
  return { isDragAccept, isDragReject };
};

function isIe(userAgent) {
  return userAgent.indexOf('MSIE') !== -1 || userAgent.indexOf('Trident/') !== -1;
}

function isEdge(userAgent) {
  return userAgent.indexOf('Edge/') !== -1;
}

export function isIeOrEdge(userAgent = window.navigator.userAgent) {
  return isIe(userAgent) || isEdge(userAgent);
}

export function accepts(file, acceptedFiles) {
  if (file && acceptedFiles) {
    const acceptedFilesArray = Array.isArray(acceptedFiles) ? acceptedFiles : acceptedFiles.split(',');
    const fileName = file.name || '';
    const mimeType = file.type || '';
    const baseMimeType = mimeType.replace(/\/.*$/, '');

    return acceptedFilesArray.some((type) => {
      const validType = type.trim();
      if (validType.charAt(0) === '.') {
        return fileName.toLowerCase().endsWith(validType.toLowerCase());
      } else if (/\/\*$/.test(validType)) {
        // This is something like a image/* mime type
        return baseMimeType === validType.replace(/\/.*$/, '');
      }
      return mimeType === validType;
    });
  }
  return true;
}

export const downloadBlobFile = (blob, filename) => {
  const uri = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.download = filename || 'download.csv';
  a.href = uri;

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  return { uri };
};

export const destroyDownloadResource = ({ uri }) => {
  window.URL.revokeObjectURL(uri);
};

const urlToPromise = (url) =>
  new Promise((resolve, reject) => {
    JSZipUtils.getBinaryContent(url, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });

export const exportZipFile = (downloadItems, fileName) => {
  const zip = new JSZip();
  downloadItems.map((item) => {
    zip.folder().file(item.title, urlToPromise(item.url), { binary: true });
    return true;
  });
  zip.generateAsync({ type: 'blob' }).then((blob) => {
    FileSaver.saveAs(blob, `${fileName}.zip`);
  });
};


export const getBlobFromBlobURL = (blobUrl) => new Promise((resolve, reject) => {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', blobUrl, true);
  xhr.responseType = 'blob';
  xhr.onload = (e) => {
    if (e.target.status === 200) {
      const myBlob = e.target.response;
      resolve(myBlob);
    } else {
      reject(e);
    }
  };
  xhr.send();
});

export const getBase64FromBlob = (blob) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(blob);
  reader.onloadend = () => {
    const base64data = reader.result;
    resolve(base64data);
  };
  reader.onerror = (err) => {
    reject(err);
  };
});

export const dataURItoBlob = (dataURI, sliceSize = 512) => {
  const byteCharacters = atob(dataURI.split(',')[1]);

  // separate out the mime component
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i += 1) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  const bb = new Blob(byteArrays, { type: mimeString });

  return { bb, mimeString };
};

export const blobToFile = (theBlob, fileName) => {
  const blob = theBlob;
  blob.lastModifiedDate = new Date();
  blob.name = fileName;

  return blob;
};
