import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {
  SortableElement,
  SortableHandle,
} from 'react-sortable-hoc';

import {
  StyledDragHandle,
  Row,
} from './elements';

export const DragHandle = SortableHandle(() => <StyledDragHandle>::</StyledDragHandle>);

export const SortableItem = SortableElement((props) => {
  const { value, readOnly } = props;
  return (
    <Row>
      {!readOnly && <DragHandle />}
      {value}
    </Row>
  );
});

export const StyledSortableItem = styled(SortableItem)`
  z-index: 9999;
`;

SortableItem.propTypes = {
  value: PropTypes.object.isRequired,
  readOnly: PropTypes.bool.isRequired,
};

export default StyledSortableItem;
