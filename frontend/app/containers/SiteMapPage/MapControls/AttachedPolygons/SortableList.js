import React from 'react';
import PropTypes from 'prop-types';

import {
  SortableContainer,
} from 'react-sortable-hoc';

import {
  List,
} from './elements';

import {
  StyledSortableItem,
} from './SortableItem';

const SortableList = SortableContainer((props) => {
  const { items, readOnly } = props;
  return (
    <List>
      {items.map((value, index) => (
        <StyledSortableItem
          key={`item-${index}`} // eslint-disable-line
          index={index}
          value={value}
          readOnly={readOnly}
        />
      ))}
    </List>
  );
});

SortableList.propTypes = {
  items: PropTypes.array.isRequired,
  readOnly: PropTypes.bool.isRequired,
};

export default SortableList;
