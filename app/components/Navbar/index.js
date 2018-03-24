// vendor
import React from 'react';
import PropTypes from 'prop-types';

// app
import NavLogo from './NavLogo';
import Box from '../Box/index';
import NavItem from './NavItem';
import LogoutIcon from '../../images/icons/logout.svg';
import { dashboardLinks } from './data';

class Navbar extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      selectedPath: 'dashboard',
    };
  }

  onLogOutHandler = () => this.props.logOut();

  onNavItemChangedHandler = (routeKey) => () => this.setState({ selectedPath: routeKey });

  render() {
    const { location } = this.props;

    return (
      <Box
        fill="vertical"
        width="80px"
        overflow="auto"
        background={{
          color: '#2e2e2e',
        }}
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
                  onClick={this.onNavItemChangedHandler(route.key)}
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
