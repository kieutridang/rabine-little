// vendor
import React from 'react';

// app
import SiteLogo from '../../../images/icons/site_logo.svg';
import NavLink from './NavLink';
import Box from '../../../components/Box';

const NavLogo = () => (
  <NavLink to="/dashboard">
    <Box
      fill="horizontal"
      alignItems="center"
      justifyContent="center"
      padding={{
        top: '24px',
        bottom: '44px',
      }}
    >
      <SiteLogo />
    </Box>
  </NavLink>
);

export default NavLogo;
