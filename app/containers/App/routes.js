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
import DashboardLayout from '../Layout/DashboardLayout';
import SiteDesignPage from '../SiteDetailPage/SiteDesignPage';
import SiteDetailLayout from '../Layout/SiteDetailLayout';
import SiteMapPage from '../SiteMapPage';
import SitePhotosPage from '../SiteDetailPage/SitePhotosPage';

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
    render: (route) => <SiteDetail component={SiteDesignPage} route={route} root="/sites" />,
  },
  {
    key: 'siteMap',
    exact: true,
    path: '/sites/:siteId/map',
    render: (route) => <SiteDetail component={SiteMapPage} route={route} root="/sites" />,
  },
  {
    key: 'sitePhotos',
    exact: true,
    path: '/sites/:siteId/photos',
    render: (route) => <SiteDetail component={SitePhotosPage} route={route} root="/sites" />,
  },
];

// TODO: need to write HOC to check if siteId exists and user has right to edit?
// not exists or no right --> go back to previous link
const SiteDetail = ({ route, component, ...rest }) => {
  if (route == null || route === undefined) {
    return (<Redirect to="/sites" />);
  }

  return <SiteDetailLayout component={component} route={route} {...rest} />;
};

SiteDetail.propTypes = {
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
