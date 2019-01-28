// import React from 'react';
import { MapControl } from 'react-leaflet';
import L from 'leaflet';
import './plugin/inventoryItemsPlugin';

class LeafletInventoryItems extends MapControl {

  createLeafletElement(props) {
    return L.inventoryItems(props);
  }

  updateLeafletElement(fromProps, toProps) {
    return L.inventoryItems(toProps);
  }

  componentDidMount() {
    const { map } = this.context;
    this.leafletElement.addTo(map);
  }
}

export default LeafletInventoryItems;
