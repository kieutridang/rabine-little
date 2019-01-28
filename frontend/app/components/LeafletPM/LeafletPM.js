import L, { Map } from 'leaflet';
import PropTypes from 'prop-types';

import 'leaflet-draw';
import 'leaflet-draw-drag';

import 'leaflet-path-transform';

import 'leaflet.pm';
import 'leaflet.pm/dist/leaflet.pm.css';
import _extend from 'lodash/extend';

import { LayersControl } from 'react-leaflet';
import { whenEdited, whenShared } from './options';

L.Util.merge = L.Util.extend;

class PMControl extends LayersControl {
  componentWillReceiveProps(nextProps) {
    const { map } = this.context;
    const { isPmToolbarActive, position, isShared, editOptions } = nextProps;

    const options = {
      ...isShared ? whenShared : _extend(whenEdited, editOptions),
      position,
    };

    if (!isPmToolbarActive) {
      map.pm.addControls(whenShared);
    } else {
      map.pm.addControls(options);
    }
  }

  componentDidMount() {
    const { onMounted } = this.props;
    if (onMounted) onMounted();

    this.toggleEvents(this.context.map, true);
  }

  componentWillUnmount() {
    this.toggleEvents(this.context.map);
  }

  toggleEvents = (map, enable) => {
    const {
      onDrawStart,
      onDrawEnd,
      onCreate,
      onRemove,
      onCut,
      onGlobalEditToggle,
    } = this.props;

    const toggle = enable ? 'on' : 'off';

    if (onCreate) map[toggle]('pm:create', onCreate);
    if (onCut) map[toggle]('pm:cut', onCut);

    if (onDrawStart) map[toggle]('pm:drawstart', onDrawStart);
    if (onDrawEnd) map[toggle]('pm:drawend', onDrawEnd);
    if (onRemove) map[toggle]('pm:remove', onRemove);

    if (onGlobalEditToggle) map[toggle]('pm:globaleditmodetoggled', onGlobalEditToggle);
  };
}

PMControl.contextTypes = {
  map: PropTypes.instanceOf(Map),
  layerContainer: PropTypes.shape({
    addLayer: PropTypes.func.isRequired,
    removeLayer: PropTypes.func.isRequired,
  }),
};

PMControl.propTypes = {
  position: PropTypes.oneOf([
    'topright',
    'topleft',
    'bottomright',
    'bottomleft',
  ]),

  isShared: PropTypes.bool,

  onDrawStart: PropTypes.func,
  onDrawEnd: PropTypes.func,
  onCreate: PropTypes.func,
  onRemove: PropTypes.func,
  onCut: PropTypes.func,
  onMounted: PropTypes.func,
  editOptions: PropTypes.object,
};

PMControl.defaultProps = {
  position: 'topright',
  isShared: false,
};

export default PMControl;
