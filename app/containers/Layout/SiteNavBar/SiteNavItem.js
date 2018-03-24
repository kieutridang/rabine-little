// vendor
import React from 'react';
import PropTypes from 'prop-types';

// app
import SiteNavLink from './SiteNavLink';
import Box from '../../../components/Box';

const SiteNavItem = ({ selected = false, label = '', path, onClick = undefined }) => (
  <SiteNavLink to={path}>
    <Box
      fill="horizontal"
      height="54px"
      width="80px"
      alignItems="center"
      justifyContent="center"
      onClick={onClick}
      opacity={selected ? '1' : '0.5'}
    >
      <Box
        fill
        alignItems="center"
        padding={{
          top: '16px',
        }}
      >
        { label }
      </Box>
      <Box
        fill
        height="2.5px"
        background={selected && {
          color: '#ed2324',
        }}
      />
    </Box>
  </SiteNavLink>
);

SiteNavItem.propTypes = {
  selected: PropTypes.bool,
  label: PropTypes.string,
  path: PropTypes.string,
  onClick: PropTypes.func,
};

export default SiteNavItem;
