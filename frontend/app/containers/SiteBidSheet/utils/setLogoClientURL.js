import { dataURItoBlob } from '../../../utils/files/fileUtils';

const setLogoClientURL = (data) => {
  const bidSheetData = data;
  const { bb, mimeString } = dataURItoBlob(bidSheetData.clientLogoBase64);
  bidSheetData.loadedFromStore = true;
  if (mimeString === bidSheetData.clientLogo.mimeType) {
    bidSheetData.clientLogo.blobUrl = URL.createObjectURL(bb);
  } else {
    bidSheetData.clientLogo.blobUrl = null;
  }
  return bidSheetData;
};

export default setLogoClientURL;
