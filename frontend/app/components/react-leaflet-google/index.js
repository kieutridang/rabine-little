import PropTypes from 'prop-types';
import { GridLayer } from 'react-leaflet';
import '../leaflet-google';

export class GoogleLayer extends GridLayer {
  static propTypes = {
    googlekey: PropTypes.string.isRequired,
    maptype: PropTypes.string,
    asclientid: PropTypes.bool,
  };

  static contextTypes = GridLayer.contextTypes;
  static childContextTypes = GridLayer.childContextTypes;

  componentWillMount() {
    super.componentWillMount();

    this.leafletElement = new L.GridLayer.GoogleMutant(this.props); // eslint-disable-line
  }

  componentDidUpdate(prevProps) {
    const {
      opacity,
      zIndex,
    } = this.props;

    if (opacity !== prevProps.opacity) {
      this.leafletElement.setOpacity(opacity);
    }

    if (zIndex !== prevProps.zIndex) {
      this.leafletElement.setZIndex(zIndex);
    }
  }
}

export default GoogleLayer;
