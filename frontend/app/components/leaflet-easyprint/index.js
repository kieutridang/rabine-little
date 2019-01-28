import { LayersControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-easyprint';

class LeafletEasyprint extends LayersControl {

  createLeafletElement(props) {
    return L.easyPrint(props);
  }

  componentDidMount() {
    const { map } = this.context;
    this.leafletElement.addTo(map);
  }
}

export default LeafletEasyprint;
