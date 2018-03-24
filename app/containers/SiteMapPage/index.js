import React from 'react';
import { connect } from 'react-redux';
import GoogleMapsLayer from './GoogleMapsLayer';

import './style.css';

const SiteMapPage = () => (<GoogleMapsLayer />);

export default connect(null, null)(SiteMapPage);
