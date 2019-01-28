// vendor
import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import './bootstrap.min.css';
import './app.css';

// app
import Box from '../../components/Box';
import { dashboardRoutes, siteSubRoutes, clientSubRoutes, orderSubRoutes } from './routes';

const AppContainer = () => (
  <Box
    fill="all"
    direction="row"
    background={{ color: '#f4f6f7' }}
  >
    <Switch>
      {
        [
          ...dashboardRoutes,
          ...clientSubRoutes,
          ...siteSubRoutes,
          ...orderSubRoutes,
        ].map((route) =>
        (<Route
          key={route.key}
          exact={route.exact}
          path={route.path}
          render={route.render}
        />))
      }
      <Route path="/login" render={() => <Redirect to="/dashboard" />} />
      <Route path="/reset-email" render={() => <Redirect to="/dashboard" />} />
      <Route path="/reset-password" render={() => <Redirect to="/dashboard" />} />
    </Switch>
  </Box>
);

export default AppContainer;
