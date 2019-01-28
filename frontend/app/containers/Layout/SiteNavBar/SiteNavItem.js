// vendor
import React from 'react';
import PropTypes from 'prop-types';

// app
import SiteNavLink from './SiteNavLink';
import Box from '../../../components/Box';

const SiteNavItem = ({ selected = false, label = '', path, onClick = undefined, color }) => (
  <SiteNavLink to={path} color={color}>
    <Box
      fill="horizontal"
      height="54px"
      width="82px"
      alignItems="center"
      justifyContent="center"
      onClick={onClick}
      opacity={selected ? '1' : '0.8'}
    >
      <Box
        fill="all"
        alignItems="center"
        padding={{
          top: '16px',
          bottom: '18px',
        }}
      >
        { label }
      </Box>
      <Box
        fill="all"
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
  color: PropTypes.string,
  path: PropTypes.string,
  onClick: PropTypes.func,
};

export default SiteNavItem;
