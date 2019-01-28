// vendor
import React from 'react';
import PropTypes from 'prop-types';

// app
import NavLink from './NavLink';
import Box from '../../../components/Box';

const NavItem = ({ selected = false, image, label = '', path = '/', onClick = undefined }) => (
  <NavLink to={path}>
    <Box
      fill="horizontal"
      alignItems="center"
      justifyContent="center"
      padding={{
        top: '1.0rem',
        bottom: '1.0rem',
        left: '0.6rem',
        right: '0.6rem',
      }}
      background={{
        color: selected ? '#000000' : '#2e2e2e',
        hover: {
          color: '#000000',
        },
      }}
      onClick={onClick}
    >
      <Box
        width="24px"
        height="24px"
        alignItems="center"
        justifyContent="center"
        margin={{
          bottom: '0.6rem',
        }}
      >
        { image }
      </Box>
      {
        label &&
        (
          <Box >
            { label }
          </Box>
        )
      }
    </Box>
  </NavLink>
);

if (process.env.NODE_ENV !== 'production') {
  NavItem.propTypes = {
    selected: PropTypes.bool,
    image: PropTypes.any,
    label: PropTypes.string,
    path: PropTypes.string,
    onClick: PropTypes.func,
  };
}

export default NavItem;
