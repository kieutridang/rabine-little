// vendor
import React from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

// app
import DashboardPage from '../DashboardPage';
import ClientPage from '../ClientPage';
import SitePage from '../SitePage';
import OrderPage from '../OrderPage';
import DronePartnerPage from '../DronePartnerPage';
import UserPage from '../UserPage';
import DashboardLayout from '../Layout/DashboardLayout';
import SiteDetailContainer from '../SiteDetail/Loadable';
import SiteBidSheet from '../SiteBidSheet/Loadable';

import ClientDetailContainer from '../ClientDetail/Loadable';
import ClientBidSheet from '../ClientBidSheet/Loadable';
// import SiteDesignPage from '../SiteDetailPage/SiteDesignPage';
import SiteDetailLayout from '../Layout/SiteDetailLayout';

import ClientDetailLayout from '../Layout/ClientDetailLayout';
import SiteMapPage from '../SiteMapPage';
import Site3DPage from '../Site3DPage';
import SitePhotoPage from '../SiteMediaPage';
import SitePhotoDetail from '../SitePhotoDetail';
import SiteRepairsPage from '../SiteRepairsPage';
import OrderDetailLayout from '../Layout/OrderDetailLayout';
import OrderDetailContainer from '../OrderDetail/Loadable';

// ==================================================
export const dashboardRoutes = [
  {
    key: 'default',
    exact: true,
    path: '/',
    render: (route) => <Redirect to="/dashboard" route={route} />,
  },
  {
    key: 'dashboard',
    exact: true,
    path: '/dashboard',
    render: (route) => <DashboardLayout component={DashboardPage} route={route} />,
  },
  {
    key: 'clients',
    exact: true,
    path: '/clients',
    render: (route) => <DashboardLayout component={ClientPage} route={route} />,
  },
  {
    key: 'sites',
    exact: true,
    path: '/sites',
    render: (route) => <DashboardLayout component={SitePage} route={route} />,
  },
  {
    key: 'orders',
    exact: true,
    path: '/orders',
    render: (route) => <DashboardLayout component={OrderPage} route={route} />,
  },
  {
    key: 'partners',
    exact: true,
    path: '/partners',
    render: (route) => <DashboardLayout component={DronePartnerPage} route={route} />,
  },
  {
    key: 'users',
    exact: true,
    path: '/users',
    render: (route) => <DashboardLayout component={UserPage} route={route} />,
  },
];
// ==================================================
export const clientSubRoutes = [
  {
    key: 'clientDetails',
    exact: true,
    path: '/clients/:clientId',
    render: (route) => <Redirect to={`/clients/${route.match.params.clientId}/design`} route={route} />,
  },
  {
    key: 'clientDesign',
    exact: true,
    path: '/clients/:clientId/design',
    render: (route) => <ClientDetail component={ClientDetailContainer} route={route} root="/clients" />,
  },
  {
    key: 'clientBidSheet',
    exact: true,
    path: '/clients/:clientId/bid_sheet',
    render: (route) => <ClientDetail component={ClientBidSheet} route={route} root="/clients" />,
  },
];

// ==================================================
export const orderSubRoutes = [
  {
    key: 'orderDetails',
    exact: true,
    path: '/sites/:siteId/orders/:orderId/detail',
    render: (route) => <OrderDetail component={OrderDetailContainer} route={route} root="/orders" />,
  },
];

// ==================================================
export const siteSubRoutes = [
  {
    key: 'siteDetails',
    exact: true,
    path: '/sites/:siteId',
    render: (route) => <Redirect to={`/sites/${route.match.params.siteId}/design`} route={route} />,
  },
  {
    key: 'siteDesign',
    exact: true,
    path: '/sites/:siteId/design',
    render: (route) => <SiteDetailRoute component={SiteDetailContainer} route={route} root="/sites" />,
  },
  {
    key: 'siteMap',
    exact: true,
    path: '/sites/:siteId/map',
    render: (route) => <SiteDetailRoute component={SiteMapPage} route={route} root="/sites" />,
  },
  {
    key: 'siteFeature',
    exact: true,
    path: '/sites/:siteId/map/feature/:featureId',
    render: (route) => <SiteDetailRoute component={SiteMapPage} route={route} root="/sites" />,
  },
  {
    key: 'site3D',
    exact: true,
    path: '/sites/:siteId/3D',
    render: (route) => <SiteDetailRoute component={Site3DPage} route={route} root="/sites" />,
  },
  {
    key: 'siteMedia',
    exact: true,
    path: '/sites/:siteId/media',
    render: (route) => <SiteDetailRoute component={SitePhotoPage} route={route} root="/sites" />,
  },
  {
    key: 'siteRepairs',
    exact: true,
    path: '/sites/:siteId/repairs',
    render: (route) => <SiteDetailRoute component={SiteRepairsPage} route={route} root="/sites" />,
  },
  {
    key: 'siteReport',
    exact: true,
    path: '/sites/:siteId/report',
    render: (route) => <SiteDetailRoute component={SiteRepairsPage} route={route} root="/sites" />,
  },
  {
    key: 'sitePhotoDetail',
    exact: true,
    path: '/sites/:siteId/areas/:areaId/media/:photoId',
    render: (route) => <SiteDetailRoute component={SitePhotoDetail} route={route} root="/sites" />,
  },
  {
    key: 'siteBidSheet',
    exact: true,
    path: '/sites/:siteId/bid_sheet',
    render: (route) => <SiteDetailRoute component={SiteBidSheet} route={route} root="/sites" />,
  },
];

// TODO: need to write HOC to check if siteId exists and user has right to edit?
// not exists or no right --> go back to previous link
const ClientDetail = ({ route, component, ...rest }) => {
  if (route == null || route === undefined) {
    return <Redirect to="/clients" />;
  }

  return <ClientDetailLayout component={component} route={route} {...rest} />;
};

ClientDetail.propTypes = {
  route: PropTypes.any,
  component: PropTypes.any,
};

// TODO: need to write HOC to check if siteId exists and user has right to edit?
// not exists or no right --> go back to previous link
const OrderDetail = ({ route, component, ...rest }) => {
  if (route == null || route === undefined) {
    return <Redirect to="/orders" />;
  }

  return <OrderDetailLayout component={component} route={route} {...rest} />;
};

OrderDetail.propTypes = {
  route: PropTypes.any,
  component: PropTypes.any,
};


// TODO: need to write HOC to check if siteId exists and user has right to edit?
// not exists or no right --> go back to previous link
const SiteDetailRoute = ({ route, component, ...rest }) => {
  if (route == null || route === undefined) {
    return <Redirect to="/sites" />;
  }

  return <SiteDetailLayout component={component} route={route} {...rest} />;
};

SiteDetailRoute.propTypes = {
  route: PropTypes.any,
  component: PropTypes.any,
};

// ==================================================
export const additionalRoutes = [
  {
    key: 'notFound',
    exact: true,
    path: '',
    render: () => <div>Not Found Page goes here</div>,
  },
];
