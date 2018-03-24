// vendor
import React from 'react';
import { Route, Switch } from 'react-router-dom';

import './bootstrap.min.css';
import './app.css';

// app
import Box from '../../components/Box/index';
import { dashboardRoutes, siteSubRoutes } from './routes';


const AppContainer = () => (
  <Box
    fill
    direction="row"
    background={{
      color: '#f4f6f7',
    }}
  >
    <Switch>
      {
        dashboardRoutes.map((route) =>
          (<Route
            key={route.key}
            exact={route.exact}
            path={route.path}
            render={route.render}
          />))
      }

      {
        siteSubRoutes.map((route) =>
          (<Route
            key={route.key}
            exact={route.exact}
            path={route.path}
            render={route.render}
          />
        ))
      }
    </Switch>
  </Box>
);

export default AppContainer;
