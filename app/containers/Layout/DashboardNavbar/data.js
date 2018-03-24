import React from 'react';

import DashboardIcon from '../../../images/icons/dashboard.svg';
import ClientsIcon from '../../../images/icons/client.svg';
import SitesIcon from '../../../images/icons/sites.svg';
import OrdersIcon from '../../../images/icons/orders.svg';
import DronePartnersIcon from '../../../images/icons/dronepartner.svg';

export const dashboardLinks = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    image: <DashboardIcon />,
    path: '/dashboard',
  },
  {
    key: 'clients',
    label: 'Clients',
    image: <ClientsIcon />,
    path: '/clients',
  },
  {
    key: 'sites',
    label: 'Sites',
    image: <SitesIcon />,
    path: '/sites',
  },
  {
    key: 'orders',
    label: 'Orders',
    image: <OrdersIcon />,
    path: '/orders',
  },
  {
    key: 'partners',
    label: 'Drone Partners',
    image: <DronePartnersIcon />,
    path: '/partners',
  },
];

