import L from 'leaflet';
import 'leaflet-draw';
import './dist/leaflet.draw-src.css';
import CustomIcon from './CustomMarkerStyled';

L.Control.InventoryItems = L.Control.extend({
  isPolygonMarkerActive: false,
  polygonDrawer: null,
  isSinglePointActive: false,
  singlePointDrawer: null,
  options: {
    position: 'topright',
    title: 'Add Inventory Marker',
    onStart: () => null,
    onCreate: () => null,
    onStop: () => null,
    onClick: () => null,
  },

  onAdd() {
    const originalOnTouch = L.Draw.Polyline.prototype._onTouch;
    L.Draw.Polyline.prototype._onTouch = function (e) { // eslint-disable-line
      if (e.originalEvent.pointerType !== 'mouse' && e.originalEvent.pointerType !== 'touch') {
        return originalOnTouch.call(this, e);
      }
    };

    // add the polygonDrawer

    this.polygonDrawer = new L.Draw.Polygon(this._map, {});
    this.singlePointDrawer = new L.Draw.Marker(this._map, { icon: CustomIcon() });

    // associate InventoryItemsPlugins
    this._map.on(L.Draw.Event.CREATED, this._onDrawCreated.bind(this));
    this._map.on(L.Draw.Event.DRAWSTART, this._onStartDrawing.bind(this));
    this._map.on(L.Draw.Event.DRAWSTOP, this._onStopDrawing.bind(this));

    // create the plugin control
    this.container = L.DomUtil.create('div', 'leaflet-bar leaflet-control hidden');
    this.container.id = 'inventory-items-container-id';

    L.DomEvent.addListener(this.container, 'mouseover', this._toggleInventoryMarkers, this);
    L.DomEvent.addListener(this.container, 'mouseout', this._toggleInventoryMarkers, this);

    const btnClass = 'inventory-items-button';
    this.link = L.DomUtil.create('a', btnClass, this.container);
    this.link.id = 'inventoryItemsId';
    this.link.title = this.options.title;

    this.holder = L.DomUtil.create('ul', 'iventoryItemsHolder', this.container);

    const polygonDrawer = L.DomUtil.create('li', 'inventoryItemTool', this.holder);
    polygonDrawer.title = 'Polygon Inventory item Tool';
    L.DomUtil.create('a', 'polygon', polygonDrawer);
    L.DomEvent.addListener(polygonDrawer, 'click', this._togglePolygonMarker, this);

    const singlePointDrawer = L.DomUtil.create('li', 'inventoryItemTool', this.holder);
    singlePointDrawer.title = 'Single point Inventory item Tool';
    L.DomUtil.create('a', 'singlePoint', singlePointDrawer);
    L.DomEvent.addListener(singlePointDrawer, 'click', this._toggleSingleMarker, this);

    L.DomEvent.disableClickPropagation(this.container);

    return this.container;
  },

  _onStopDrawing(e) {
    const { onStop } = this.options;

    onStop(e);
  },

  _onStartDrawing(e) {
    const { onStart } = this.options;

    onStart(e, this.polygonDrawer);
  },

  _onDrawCreated(e) {
    const { onCreate, onClick } = this.options;
    const layer = e.layer;
    const layerType = e.layerType;
    layer.layerType = layerType;

    this._map.addLayer(layer);

    this.isPolygonMarkerActive = false;
    this.isSinglePointActive = false;

    onCreate(e, layer);

    layer.on('click', onClick);
  },

  _toggleSingleMarker() {
    if (this.isSinglePointActive) {
      this.singlePointDrawer.disable();
      this.isSinglePointActive = false;
    } else {
      this.singlePointDrawer.enable();
      this.polygonDrawer.disable();
      this.isPolygonMarkerActive = false;
      this.isSinglePointActive = true;
    }
  },

  _togglePolygonMarker() {
    if (this.isPolygonMarkerActive) {
      this.polygonDrawer.disable();
      this.isPolygonMarkerActive = false;
    } else {
      this.polygonDrawer.enable();
      this.singlePointDrawer.disable();
      this.isSinglePointActive = false;
      this.isPolygonMarkerActive = true;
    }
  },

  _toggleInventoryMarkers(e) {
    const holderStyle = this.holder.style;
    const linkStyle = this.link.style;
    if (e.type === 'mouseover') {
      holderStyle.display = 'block';
      linkStyle.borderTopRightRadius = '0';
      linkStyle.borderBottomRightRadius = '0';
    } else {
      holderStyle.display = 'none';
      linkStyle.borderTopRightRadius = '2px';
      linkStyle.borderBottomRightRadius = '2px';
    }
  },

});

L.inventoryItems = (options) => new L.Control.InventoryItems(options);
