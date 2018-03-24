import React from 'react';
import { Map } from 'react-leaflet';
import { GoogleLayer } from 'react-leaflet-google';

const key = 'AIzaSyD87n8n4JOtijIIgBDsmyeS94F4nBEGQpg';
const satellite = 'SATELLITE';

const GoogleMapsLayer = () => (
  <Map center={[42.0975, -71.5035166015625]} zoom={18} zoomControl>
    <GoogleLayer googlekey={key} maptype={satellite} />
  </Map>
);

export default GoogleMapsLayer;
