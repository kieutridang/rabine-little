// vendor
import React from 'react';
import PropTypes from 'prop-types';

// app
import NavBarContainer from './NavBarContainer';
import LayoutContainer from './LayoutContainer';

const DashboardLayout = (props) => {
  const {
      component: Component,
      route,
  } = props;

  return (
    <LayoutContainer direction="row">
      <NavBarContainer />
      <Component route={route} />
    </LayoutContainer>
  );
};

DashboardLayout.propTypes = {
  component: PropTypes.any,
  route: PropTypes.object,
};

export default DashboardLayout;
