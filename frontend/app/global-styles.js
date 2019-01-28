import { injectGlobal } from 'styled-components';

/* eslint no-unused-expressions: 0 */
injectGlobal`
  html,
  body {
    height: 100%;
    width: 100%;
  }

  body {
    font-family: 'Source Sans Pro', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  body.fontLoaded {
    font-family: 'Source Sans Pro', 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  #app {
    background-color: #f4f6f7;
    min-height: 100%;
    min-width: 100%;
  }

  p,
  label {
    font-family: 'Source Sans Pro', Georgia, Times, 'Times New Roman', serif;
    line-height: 1.5em;
  }

  .fa:after {
    font-size: 1.1em;
    font-weight: 800;
    vertical-align: middle;
  }

  .fa.fa-sort:after {
    content: '⇅';
  }

  .fa.fa-sort-asc:after {
    content: '⇩';
  }

  .fa.fa-sort-desc:after {
    content: '⇧';
  }

  .ag-theme-material {
    font-family: 'Source Sans Pro', Georgia, Times, 'Times New Roman', serif !important;
    font-size: 14px !important;
    color: #323232 !important;
    letter-spacing: 0.7px !important;
    font-weight: normal !important;
  }

  .ag-theme-material .ag-header-cell-label {
    color: #323232;
    letter-spacing: 0.8px;
    opacity: 0.4;
    font-weight: 600;
  }

  .ag-cell:focus {
    outline-width: 0;
  }

  .ag-theme-material .ag-cell-focus {
    border: 1px solid #ed2324;
  }

  .ag-theme-material .ag-tab-body {
    padding: 0;
  }

  .ag-menu {
    overflow-y: unset;
  }

  .ag-theme-material .ag-icon-checkbox-checked:empty {
    background-image: url('data:image/svg+xml;utf8,<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><path d="M16 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM7 14L2 9l1.41-1.41L7 11.17l7.59-7.59L16 5l-9 9z" fill="#ed2324"/></svg>');
  }

  .SingleDatePickerInput__withBorder button:hover {
    background-color: transparent;
  }

  /** Slider **/
  .leaflet-control-zoominfo-wrap {
    padding-top: 5px;
    padding-bottom: 5px;
    background-color: #fff;
    border-bottom: 1px solid #ccc;
  }
  .leaflet-control-zoominfo-body {
    border: solid #fff;
    margin: 0 auto;
  }

  .leaflet-control-zoominfo-body:hover {
    cursor: pointer;
  }

  .leaflet-dragging .leaflet-control-zoominfo,
  .leaflet-dragging .leaflet-control-zoominfo-wrap,
  .leaflet-dragging .leaflet-control-zoominfo-body,
  .leaflet-dragging .leaflet-control-zoominfo a,
  .leaflet-dragging .leaflet-control-zoominfo a.leaflet-control-zoominfo-disabled {
    cursor: move;
    cursor: -webkit-grabbing;
    cursor:    -moz-grabbing;
  }

  /** Leaflet Zoom Styles **/
  .leaflet-container .leaflet-control-zoominfo {
    margin-left: 10px;
    margin-top: 10px;
  }
  .leaflet-control-zoominfo a {
    width: 26px;
    height: 26px;
    text-align: center;
    text-decoration: none;
    color: black;
    display: block;
  }
  .leaflet-control-zoominfo a:hover {
    background-color: #f4f4f4;
  }
  .leaflet-control-zoominfo-in {
    font: bold 18px 'Lucida Console', Monaco, monospace;
  }
  .leaflet-control-zoominfo-in:after{
    content:"+"
  }
  .leaflet-control-zoominfo-out {
    font: bold 22px 'Lucida Console', Monaco, monospace;
  }
  .leaflet-control-zoominfo-out:after{
    content:"−"
  }
  .leaflet-control-zoominfo a.leaflet-control-zoominfo-disabled {
    cursor: default;
    color: #bbb;
  }

  /* Touch */
  .leaflet-touch .leaflet-control-zoominfo-body {
    background-position: 10px 0px;
  }
  .leaflet-touch .leaflet-control-zoominfo a {
    width: 30px;
    line-height: 30px;
  }
  .leaflet-touch .leaflet-control-zoominfo a:hover {
    width: 30px;
    line-height: 30px;
  }
  .leaflet-touch .leaflet-control-zoominfo-in {
    font-size: 24px;
    line-height: 29px;
  }
  .leaflet-touch .leaflet-control-zoominfo-out {
    font-size: 28px;
    line-height: 30px;
  }
  .leaflet-touch .leaflet-control-zoominfo {
    box-shadow: none;
    border: 4px solid rgba(0,0,0,0.3);
  }

  .leaflet-control-zoominfo-info {
    background-color: #fff;
    border: none;
    display: block;
    text-align: center;
    text-decoration: none;
    color: black;
    padding: 4px 4px 0px 3px;
    cursor: default;
  }

  .leaflet-control-zoominfoinfo h4 {
    margin: 0 0 0px 0px;
    color: #000;
  }

  /* Old IE */

  .leaflet-oldie .leaflet-control-zoominfo-wrap {
    width: 26px;
  }

  .leaflet-oldie .leaflet-control-zoominfo {
    border: 1px solid #999;
  }

  .leaflet-oldie .leaflet-control-zoominfo-in {
    *zoom: expression( this.runtimeStyle['zoom'] = '1', this.innerHTML = '+');
  }
  .leaflet-oldie .leaflet-control-zoominfo-out {
    *zoom: expression( this.runtimeStyle['zoom'] = '1', this.innerHTML = '-');
  }
`;
