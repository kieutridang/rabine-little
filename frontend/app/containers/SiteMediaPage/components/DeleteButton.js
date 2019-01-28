import React from 'react';
import PropTypes from 'prop-types';

import DeleteIcon from '../../../images/delete.svg';

const DeleteButton = (props) => (
  <button className={`${props.className} btn-deleted`} type="button" onClick={props.onClick}>
    <DeleteIcon />
  </button>
);

DeleteButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string.isRequired,
};

export default DeleteButton;
