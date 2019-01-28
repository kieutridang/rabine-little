import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledTimelineContainer = styled.section`
  position: relative;
  fontSize: 80%;
  fontWeight: 300;
  padding: 10px 0;
  width: 95%;
  margin: 0 auto;
  box-shadow: none;
  border: none;
`;

const StyledLine = styled.div`
  content: '';
  position: absolute;
  top: 20px;
  height: 0px;
  width: 1px;
  background: #dadbe0;

  ${(props) => props.orientation === 'left' ? 'left: 16px;' : 'right: 14px;'}
  ${(props) => props.lineHeight && `height: ${props.lineHeight}px;`}
`;

const StyledBottom = styled.div`
  content: '';
  display: table;
  clear: both;
`;

class Timeline extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.items = [];
  }

  componentDidMount() {
    this.items = [];
  }

  getChildrenHeight = (ref, height) => {
    this.items.push(height);
    const lineHeight = this.calculateHeight();
    this.changeHeight(lineHeight);
  }

  calculateHeight = () => {
    let lineHeight = 0;
    if (this.items.length === this.props.children.length) {
      if (this.items.length > 0) {
        const arr = this.items.slice(0, this.items.length - 1);
        lineHeight = arr
          .filter((item) => this.items.indexOf(item) < this.items.length - 1)
          .reduce(((accumulator, currentValue) => accumulator + currentValue), 0)
          + (this.items.length * 10);
      }
    }

    return lineHeight;
  }

  changeHeight = (lineHeight) => {
    const {
      componentId,
    } = this.props;

    const line = document.getElementById(`timeline_side_${componentId}`);
    line.style.height = `${lineHeight}px`;
    line.style.minHeight = `${lineHeight}px`;
  }

  render() {
    const {
      componentId,
      orientation = 'left',
      children,
      ...otherProps
    } = this.props;

    const childrenWithProps = children
      ? React.Children.map(children,
      (child, index) => React.cloneElement(child, {
        ...child.props,
        id: `timeline_${index}`,
        orientation,
        last: index === children.length - 1,
        getChildrenHeight: this.getChildrenHeight,
      }))
      : children;

    return (
      <div>
        <StyledTimelineContainer {...otherProps}>
          <StyledLine
            id={`timeline_side_${componentId}`}
            orientation={orientation}
          />
          {childrenWithProps}
          <StyledBottom />
        </StyledTimelineContainer>
      </div>
    );
  }
}

Timeline.propTypes = {
  children: PropTypes.node,
  orientation: PropTypes.string,
  style: PropTypes.object,
  componentId: PropTypes.string,
};

export default Timeline;
