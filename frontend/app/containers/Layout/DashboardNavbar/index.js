// vendor
import React from 'react';
import PropTypes from 'prop-types';

// app
import NavLogo from './NavLogo';
import NavItem from './NavItem';
import LogoutIcon from '../../../images/icons/logout.svg';
import { dashboardLinks } from './data';
import Box from '../../../components/Box';

class Navbar extends React.Component {
  onLogOutHandler = () => this.props.logOut();

  onNavItemChangedHandler = (routeKey) => () => this.setState({ selectedPath: routeKey });

  render() {
    const { location } = this.props;

    return (
      <Box
        width="80px"
        overflowY="auto"
        background={{
          color: '#2e2e2e',
        }}
        minHeight="100vh"
        color="white"
      >
        { /* logo & menu */ }
        <Box
          fill="horizontal"
          flex="grow"
        >
          { /* nav logo */ }
          <NavLogo />

          { /* nav menu */ }
          {
            dashboardLinks.map((route) => {
              const selected = location.pathname === `/${route.key}`;
              return (
                <NavItem
                  key={route.key}
                  image={route.image}
                  label={route.label}
                  selected={selected}
                  path={route.path}
                />
              );
            })
          }
        </Box>

        { /* nav logout button */ }
        <NavItem
          key="logout"
          image={<LogoutIcon />}
          label=""
          onClick={this.onLogOutHandler}
        />
      </Box>
    );
  }
}

Navbar.propTypes = {
  location: PropTypes.object,
  logOut: PropTypes.func,
};

export default Navbar;
