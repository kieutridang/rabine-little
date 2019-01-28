import React from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import Avatar from 'react-avatar';

const StyledTimelineItemWrapper = styled.div`
  position: relative;
  margin: 10px 0;

  ${(props) => props.orientation === 'left'
    ? css`
      padding-left: 45px;
      text-align: left;
    `
    : css`
      padding-right: 45px;
      text-align: right;
    `}
`;

const StyledIconWrapper = styled.div`
  position: absolute;
  top: 0;
  border-radius: 50%;
  width: 14px;
  height: 14px;
  margin-left: 10px;
  background: #ffffff;
  border: 1px solid #dadbe0;
  display: flex;

  ${(props) => props.iconColor && css`
    color: ${props.iconColor};
    border-color: ${props.iconColor};
  `}

  ${(props) => props.orientation === 'left' ? 'left: 0;' : 'right: 0;'}
`;

const StyledIcon = styled.span`
  display: flex;
  width: 32px;
  height: 32px;
  position: relative;
  justify-content: center;
  align-self: center;
  align-items: center;
`;

const StyledContentWrapper = styled.div`
  position: relative;
  ${(props) => props.container === 'card' && !props.actionText && css`
    padding-top: 15px;
    box-shadow: #eeeeee 0px 1px 6px, #eeeeee 0px 1px 4px;
    background-color: #ffffff;
  `}
`;

const StyledTopContent = styled.div`
  top: 24px;
  left: 100%;
  border-color: transparent;
  border-left-color: #ffffff;
`;

const StyledBottom = styled.div`
  clear: both;
  content: '';
  display: table;
`;

const StyledCardTitle = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: start;
  margin-left: ${(props) => !props.actionText && '40px'};
  ${(props) => props.container === 'card' && css`
    background-color: #7BB1EA;
    padding: 10px;
    color: #fff;
    
  `}
`;

const StyledTime = styled.div`
  opacity: 0.5;
  font-size: 12px;
  text-align: left;
  color: #373737;
  margin-left: 10px;
`;

const StyledSubTitle = styled.div`
  margin-top: 2px;
  font-size: 85%;
  color: #777;
`;

const StyledButton = styled.div`
  margin-top: -20px;
  ${(props) => props.orientation === 'left'
  ? css`
    float: left;
    text-align: left;
  `
  : css`
    float: right;
    text-align: right;
  `}
`;

const StyledMessageContainer = styled.div`
  font-size: 12px;
  text-align: left;
  color: #373737;
  background-color: #ffffff;
  
  ${(props) => props.container === 'card'
    ? `
      margin-bottom: 1em;
      line-height: 1.6;
      padding: 10px;
      min-height: 40px;
      margin-left: 30px;
    `
    : `
      width: 98%;
      box-shadow: 0 1px 3px 0 #eeeeee;
      margin-top: 1em;
      margin-bottom: 1em;
      line-height: 1.6;
      padding: 0.5em 1em;
      margin-left: 0.5em;
    `}
`;

const StyledTitle = styled.div`
  font-size: ${(props) => props.actionText ? '12px' : '14px'};
  opacity: ${(props) => props.actionText ? '0.5' : '1'};
  font-weight: 600;
  text-align: left;
  color: #373737;
`;

const StyledActionText = styled.div`
  font-size: 14px;
  font-weight: 600;
  text-align: left;
  color: #373737;
`;

const StyledAvatar = styled(Avatar)`
  position: absolute;
  left: 15px;
`;

class TimelineItem extends React.Component {
  componentDidMount() {
    const dom = findDOMNode(this.element);
    this.props.getChildrenHeight(this.element, dom.clientHeight);
  }

  handleRef = (ele) => {
    this.element = ele;
  };

  render() {
    const {
      id,
      actionText,
      createdAt,
      title,
      subtitle,
      buttons,
      icon,
      iconColor,
      container,
      orientation,
      children,
      last,
      ...otherProps
    } = this.props;

    return (
      <StyledTimelineItemWrapper
        id={id}
        orientation={orientation}
        last={last}
        ref={this.handleRef}
        {...otherProps}
      >
        <StyledIconWrapper iconColor={iconColor} orientation={orientation}>
          <StyledIcon>
            {icon}
          </StyledIcon>
        </StyledIconWrapper>

        <StyledContentWrapper
          container={container}
          actionText={actionText}
        >
          <StyledTopContent />

          {
            actionText &&
            (
              <StyledActionText>
                { actionText }
              </StyledActionText>
            )
          }

          <StyledCardTitle
            containter={container}
            actionText={actionText}
          >
            <StyledAvatar round name={title} size={20} />
            <StyledTitle
              actionText={actionText}
            >
              {title}
            </StyledTitle>

            {
              createdAt &&
              <StyledTime>
                {createdAt}
              </StyledTime>
            }

            {
              subtitle &&
              <StyledSubTitle>
                {subtitle}
              </StyledSubTitle>
            }

            <StyledButton orientation={orientation}>
              {buttons}
            </StyledButton>
          </StyledCardTitle>

          {
            children &&
            (
              <StyledMessageContainer
                container={container}
              >
                {children}

                <StyledBottom />
              </StyledMessageContainer>
            )
          }
        </StyledContentWrapper>

        <StyledBottom />
      </StyledTimelineItemWrapper>
    );
  }
}

TimelineItem.propTypes = {
  id: PropTypes.any,
  title: PropTypes.node,
  subtitle: PropTypes.node,
  createdAt: PropTypes.node,
  children: PropTypes.node,
  buttons: PropTypes.node,
  container: PropTypes.string,
  icon: PropTypes.node,
  iconColor: PropTypes.string,
  orientation: PropTypes.string,
  actionText: PropTypes.string,
  last: PropTypes.bool,
  getChildrenHeight: PropTypes.func,
};

TimelineItem.defaultProps = {
  createdAt: undefined,
  orientation: 'left',
};

export default TimelineItem;
