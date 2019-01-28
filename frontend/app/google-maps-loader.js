import GoogleMapsLoader from 'google-maps';
GoogleMapsLoader.VERSION = '3.32';

const key = 'AIzaSyD87n8n4JOtijIIgBDsmyeS94F4nBEGQpg';

GoogleMapsLoader.KEY = key;
GoogleMapsLoader.LIBRARIES = ['places'];
GoogleMapsLoader.TYPE = 'SATELLITE';

GoogleMapsLoader.load((_google) => {
  window.google = _google;
});
