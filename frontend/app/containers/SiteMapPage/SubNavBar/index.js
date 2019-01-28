import React from 'react';
import PropTypes from 'prop-types';

import { subNavBarItems } from '../opts';
import { DropdownContent } from './styled';

const SubNavBar = ({ handleSelectSubItem, subNavigationItemSelected }) => (
  <DropdownContent className="dropdownNavigation">
    <select
      name="dropdownSubnavigation"
      id="dropdownSubnavigation"
      value={subNavigationItemSelected}
      onChange={handleSelectSubItem}
    >
      { subNavBarItems.map((item) => <option key={item.key} value={item.label}> {item.label} </option>) }
    </select>
  </DropdownContent>
  );

SubNavBar.propTypes = {
  handleSelectSubItem: PropTypes.func,
  subNavigationItemSelected: PropTypes.string,
};

export default SubNavBar;
