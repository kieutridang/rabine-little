import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const StyledDropzoneWrapper = styled.div`
  &:hover {
    cursor: pointer;
  }

  border: dashed 2px rgba(151, 151, 151, 0.3);
  border-radius: 15px;
  width: ${(props) => `${props.containerWidth}px`};
  height: ${(props) => `${props.containerHeight}px`};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  ${(props) => (props.isDraggingFile) && 'border: dashed 2px red;'}
  ${(props) => (props.isDragReject) && 'border: dashed 2px #cc6666;'}
  ${(props) => (props.disabled) && 'opacity: 0.5;'}
`;

const DropzoneWrapper = (props) => {
  const {
    children,
    onClick,
    isDraggingFile,
    isDragAccept,
    isDragReject,
    disabled,
    onDragStart,
    onDragEnter,
    onDragOver,
    onDragLeave,
    onDrop,
    containerWidth,
    containerHeight,
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
      isDraggingFile={isDraggingFile}
      isDragReject={isDragReject}
      containerWidth={containerWidth}
      containerHeight={containerHeight}
    >
      {children}
    </StyledDropzoneWrapper>
  );
};

DropzoneWrapper.propTypes = {
  children: PropTypes.any,
  onClick: PropTypes.func,
  isDraggingFile: PropTypes.bool,
  isDragAccept: PropTypes.bool,
  isDragReject: PropTypes.bool,
  disabled: PropTypes.bool,
  onDragStart: PropTypes.func,
  onDragEnter: PropTypes.func,
  onDragOver: PropTypes.func,
  onDragLeave: PropTypes.func,
  onDrop: PropTypes.func,
  containerHeight: PropTypes.number,
  containerWidth: PropTypes.number,
};

export default DropzoneWrapper;
