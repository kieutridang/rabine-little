import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const StyledDropzoneWrapper = styled.div`
  &:hover {
    cursor: pointer;
  }

  border: dashed 2px rgba(151, 151, 151, 0.3);
  border-radius: 15px;
  width: 100%;
  height: 388px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  ${(props) => (props.isDragActive) && 'border: dashed 2px red;'}
  ${(props) => (props.isDragReject) && 'border: dashed 2px #cc6666;'}
  ${(props) => (props.disabled) && 'opacity: 0.5;'}
`;

const DropzoneWrapper = (props) => {
  const {
    children,
    onClick,
    isDragActive,
    isDragAccept,
    isDragReject,
    disabled,
    onDragStart,
    onDragEnter,
    onDragOver,
    onDragLeave,
    onDrop,
  } = props;

  return (
    <StyledDropzoneWrapper
      onClick={onClick}
      onDragStart={onDragStart}
      onDragEnter={onDragEnter}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      aria-disabled={disabled}
      disabled={disabled}
      role="presentation"
      isDragAccept={isDragAccept}
      isDragActive={isDragActive}
      isDragReject={isDragReject}
    >
      {children}
    </StyledDropzoneWrapper>
  );
};

DropzoneWrapper.propTypes = {
  children: PropTypes.any,
  onClick: PropTypes.func,
  isDragActive: PropTypes.bool,
  isDragAccept: PropTypes.bool,
  isDragReject: PropTypes.bool,
  disabled: PropTypes.bool,
  onDragStart: PropTypes.func,
  onDragEnter: PropTypes.func,
  onDragOver: PropTypes.func,
  onDragLeave: PropTypes.func,
  onDrop: PropTypes.func,
};

export default DropzoneWrapper;
