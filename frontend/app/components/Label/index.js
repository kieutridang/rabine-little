// vendor
import React from 'react';
import PropTypes from 'prop-types';

// app
import StyledLabel from './StyledLabel';

const Label = ({ labelPosition, children }) => (
  <StyledLabel
    labelPosition={labelPosition}
  >
    { children }
  </StyledLabel>
);

Label.propTypes = {
  labelPosition: PropTypes.oneOf(['row', 'column']),
  children: PropTypes.node,
};

Label.defaultProps = {
  labelPosition: 'column',
};

export default Label;
