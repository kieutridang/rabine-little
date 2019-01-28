/* eslint-disable no-param-reassign */
import React from 'react';
import PropTypes from 'prop-types';
import Transition from 'react-transition-group/Transition';
import styled, { css } from 'styled-components';

import { duration, getAutoHeightDuration, getTransitionProps } from '../../utils/styles/transitions';

const StyledCollapse = (Component) => styled(Component)`
  height: 0;
  overflow: hidden;
  transition: height 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;

  ${(props) => props.state === 'entered' && css`height: auto;`}
  ${(props) => props.collapseHeight && css`min-height: ${props.collapseHeight};`}
`;

const StyledCollapseWrapper = styled.div`
  display: flex;
`;

const StyledCollapseInnerWrapper = styled.div`
  width: 100%;
`;

class Collapse extends React.Component {
  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  wrapper = null;
  autoTransitionDuration = undefined;
  timer = null;

  handleEnter = (node) => {
    node.style.height = this.props.collapsedHeight;

    if (this.props.onEnter) {
      this.props.onEnter(node);
    }
  };

  handleEntering = (node) => {
    const { timeout } = this.props;
    const wrapperHeight = this.wrapper ? this.wrapper.clientHeight : 0;

    const { duration: transitionDuration } = getTransitionProps(this.props, {
      mode: 'enter',
    });

    if (timeout === 'auto') {
      const duration2 = getAutoHeightDuration(wrapperHeight);
      node.style.transitionDuration = `${duration2}ms`;
      this.autoTransitionDuration = duration2;
    } else {
      node.style.transitionDuration =
        typeof transitionDuration === 'string' ? transitionDuration : `${transitionDuration}ms`;
    }

    node.style.height = `${wrapperHeight}px`;

    if (this.props.onEntering) {
      this.props.onEntering(node);
    }
  };

  handleEntered = (node) => {
    node.style.height = 'auto';

    if (this.props.onEntered) {
      this.props.onEntered(node);
    }
  };

  handleExit = (node) => {
    const wrapperHeight = this.wrapper ? this.wrapper.clientHeight : 0;
    node.style.height = `${wrapperHeight}px`;

    if (this.props.onExit) {
      this.props.onExit(node);
    }
  };

  handleExiting = (node) => {
    const { timeout } = this.props;
    const wrapperHeight = this.wrapper ? this.wrapper.clientHeight : 0;

    const { duration: transitionDuration } = getTransitionProps(this.props, {
      mode: 'exit',
    });

    if (timeout === 'auto') {
      const duration2 = getAutoHeightDuration(wrapperHeight);
      node.style.transitionDuration = `${duration2}ms`;
      this.autoTransitionDuration = duration2;
    } else {
      node.style.transitionDuration =
        typeof transitionDuration === 'string' ? transitionDuration : `${transitionDuration}ms`;
    }

    node.style.height = this.props.collapsedHeight;

    if (this.props.onExiting) {
      this.props.onExiting(node);
    }
  };

  addEndListener = (_, next) => {
    if (this.props.timeout === 'auto') {
      this.timer = setTimeout(next, this.autoTransitionDuration || 0);
    }
  };

  render() {
    const {
      children,
      collapsedHeight,
      component: Component,
      onEnter,
      onEntered,
      onEntering,
      onExit,
      onExiting,
      timeout,
      ...other
    } = this.props;

    return (
      <Transition
        onEntering={this.handleEntering}
        onEnter={this.handleEnter}
        onEntered={this.handleEntered}
        onExiting={this.handleExiting}
        onExit={this.handleExit}
        addEndListener={this.addEndListener}
        timeout={timeout === 'auto' ? null : timeout}
        {...other}
      >
        {(state, childProps) => {
          const StyledComponent = StyledCollapse(Component);
          return (
            <StyledComponent
              state={state}
              collapsedHeight={collapsedHeight}
              {...childProps}
            >
              <StyledCollapseWrapper
                ref={(node) => {
                  this.wrapper = node;
                }}
              >
                <StyledCollapseInnerWrapper>{children}</StyledCollapseInnerWrapper>
              </StyledCollapseWrapper>
            </StyledComponent>
          );
        }}
      </Transition>
    );
  }
}

Collapse.propTypes = {
  /**
   * The content node to be collapsed.
   */
  children: PropTypes.node,
  /**
   * The height of the container when collapsed.
   */
  collapsedHeight: PropTypes.string,
  /**
   * The component used for the root node.
   * Either a string to use a DOM element or a component.
   */
  component: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  /**
   * If `true`, the component will transition in.
   */
  in: PropTypes.bool,
  /**
   * @ignore
   */
  onEnter: PropTypes.func,
  /**
   * @ignore
   */
  onEntered: PropTypes.func,
  /**
   * @ignore
   */
  onEntering: PropTypes.func,
  /**
   * @ignore
   */
  onExit: PropTypes.func,
  /**
   * @ignore
   */
  onExiting: PropTypes.func,
  /**
   * @ignore
   */
  style: PropTypes.object,
  /**
   * The duration for the transition, in milliseconds.
   * You may specify a single timeout for all transitions, or individually with an object.
   *
   * Set to 'auto' to automatically calculate transition time based on height.
   */
  timeout: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.shape({ enter: PropTypes.number, exit: PropTypes.number }),
    PropTypes.oneOf(['auto']),
  ]),
};

Collapse.defaultProps = {
  collapsedHeight: '0px',
  component: 'div',
  timeout: duration.standard,
};

export default Collapse;
