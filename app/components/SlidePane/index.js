/* eslint-disable jsx-a11y/no-static-element-interactions */
// vendor
import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';

// app
import './slidingpane.css';

const CLOSE_TIMEOUT = 500;

const SlidingPane = (props) => {
  const {
    isOpen,
    title,
    onRequestClose,
    onAfterOpen,
    children,
    className,
    overlayClassName,
    from = 'right',
    width,
  } = props;

  const directionClass = `slide-pane_from_${from}`;

  return (
    <Modal
      className={`slide-pane ${directionClass} ${className || ''}`}
      style={{
        content: { maxWidth: width || '442px' },
      }}
      overlayClassName={`slide-pane__overlay ${overlayClassName || ''}`}
      closeTimeoutMS={CLOSE_TIMEOUT}
      isOpen={isOpen}
      onAfterOpen={onAfterOpen}
      onRequestClose={onRequestClose}
      contentLabel={`Modal "${title || ''}"`}
    >
      <div className="slide-pane__header">
        <div className="slide-pane__title-wrapper">
          <h2 className="slide-pane__title">{ title }</h2>
          { /* <div className="slide-pane__subtitle">{ subtitle }</div> */ }
        </div>
        <div className="slide-pane__close" onClick={onRequestClose}>
          +
        </div>
      </div>
      <div className="slide-pane__content">
        { children }
      </div>
    </Modal>
  );
};

SlidingPane.propTypes = {
  isOpen: PropTypes.bool,
  title: PropTypes.string,
  onRequestClose: PropTypes.func,
  onAfterOpen: PropTypes.func,
  children: PropTypes.any,
  className: PropTypes.string,
  overlayClassName: PropTypes.string,
  from: PropTypes.string,
  width: PropTypes.string,
};

export default SlidingPane;
