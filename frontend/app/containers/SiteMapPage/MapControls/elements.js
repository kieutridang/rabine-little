import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import ShowLayerIcon from '../../../images/icons/show_layer.svg';
import HideLayerIcon from '../../../images/icons/hide_layer.svg';
import SectionTitleIcon from '../../../images/icons/section_title.svg';

const buttonStyle = `
  display: flex;
  align-items: center;
  justify-content: center;
  width: auto;

  margin: 0;
  padding: 4px 0.5rem 3px;

  font-size: 12px;

  background-color: #333333;
  border: 0.5px solid #464646;
  border-radius: 2px;
  color: hsla(0, 0%, 96%, 1.0);
  cursor: pointer;

  transition: color 150ms ease;

  &:hover {
    opacity: 0.8;
    color: hsla(0, 0%, 100%, 1.0);
  }

  &:active {
    opacity: 0.9;
    color: hsla(0, 0%, 50%, 1.0);
  }

  & + button,
  & + label,
  & + a {
    margin-left: 0.5rem;
  }
`;

export const Wrapper = styled.aside`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 1300;
  width: 250px;
  background: hsla(0, 0%, 8%, 0.98);
  -webkit-backdrop-filter: saturate(150%) blur(12px);
  user-select: none;
  overflow-x: hidden;
`;

export const Header = styled.div`
  position: relative;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 54px;
  padding: 1.2rem 0.4rem;
  border-bottom: 1px solid hsla(0, 0%, 50%, 0.15);
`;

export const HeaderItemIndicator = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 1;
  width: 50%;
  height: 2px;
  background: hsla(3, 70%, 53%, 1.0);
  transform: translateX(0);
  transition: all 240ms ease;
  &.changes {
    transform: translateX(100%);
  }
`;

export const HeaderItem = styled.button`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;

  height: 54px;
  margin: 0;
  padding-top: 0.2rem;
  font-size: 1.0rem;
  font-weight: bold;
  text-align: center;
  text-transform: uppercase;
  text-decoration: none;
  color: hsla(0, 0%, 80%, 1.0);
  transition: all 120ms ease;

  appearance: none;
  outline: none;
  border: 0;
  box-shadow: none;
  cursor: pointer;

  &:focus {
    outline: none;
    box-shadow: none;
  }

  &.active {
    color: hsla(0, 0%, 100%, 1.0);
  }
`;

export const Body = styled.div`
  position: absolute;
  top: 54px;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;

  margin: 0;
  padding: 0 0 2.0rem;

  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  transition: all 240ms ease;

  opacity: 0;
  visibility: hidden;

  &.layers {
    transform: translateX(-33%);
  }

  &.changes {
    transform: translateX(33%);
  }

  &.active {
    opacity: 1;
    visibility: visible;
    transform: translateX(0%);
  }
`;

export const Section = styled.div`
  margin: 0;
  padding: 0;
`;

export const SectionLoader = styled.div`
  padding: 0.8rem 1.0rem;
  font-size: 0.875rem;
  text-align: center;
  color: hsla(0, 0%, 80%, 1.0);
`;

export const SectionList = styled.div`
`;

export const SectionTitle = styled.strong`
  display: flex;
  padding: 0.5rem 0;
  background-color: ${(props) => props.level === 1 ? '#000000' : '#151515'};
  font-size: 0.875rem;
  color: hsla(0, 0%, 100%, 1.0);
`;

export const CollapseArrow = styled.i`
  visibility: ${(props) => props.level === 3 ? 'hidden' : 'visible'};
  display: inline-block;
  border: solid white;
  border-width: 0 2px 2px 0;
  padding: 2px;
  transform: rotate(-45deg);
  -webkit-transform: rotate(-45deg);
  transition: all 190ms ease;

  &.is-collapsed {
    transform: rotate(45deg);
    -webkit-transform: rotate(45deg);
  }
`;

export const DraggableItemWrapper = styled.div`
  position: relative;
  margin: 0;
`;

export const StyledDragHandle = styled.div`
  position: absolute;
  top: 1.0rem;
  left: 1.0rem;
  width: 0.7rem;
  height: 0.7rem;
  z-index: 3;
  margin-top: -2px;
  margin-left: 1.4rem;
  cursor: pointer;

  span {
    display: block;
    height: 100%;
  }

  &:hover:after,
  &:hover span:before,
  &:hover span:after {
    background: hsla(0, 0%, 100%, 0.7);
  }

  &:after,
  span:before,
  span:after {
    width: 100%;
    background: hsla(0, 0%, 100%, 0.4);
  }

  &:after,
  span:before,
  span:after {
    height: 1px;
    position: absolute;
    content: '';
  }

  &:after {
    margin-top: -0.4rem;
  }

  span:before {
    margin-top: -0.1rem;
  }

  span:after {
    margin-top: 0.1rem;
  }
`;

export const Item = styled.div`
  position: relative;
  margin: 0.1rem 0rem;

  &:last-of-type {
    margin-bottom: 0;
  }

  transition: all 240ms ease;

  &.grayscale {
    opacity: 0.8;
    filter: grayscale(100%);
    &.active {
      opacity: 1.0;
      filter: grayscale(0%);
    }
  }
`;

export const StyledChanges = styled.div`
  padding-bottom: 2.0rem;
  color: white;
`;

export const StyledChangesItem = styled.div`
  position: relative;
  padding: 1.0rem 1.2rem 1.0rem;

  color: white;
  border-bottom: 1px solid hsla(0, 0%, 50%, 0.15);

  &:last-of-type {
    border-bottom: 0;
  }
`;

export const StyledChangesItemInsight = styled.ul`
  margin: 0.7rem 0 0.7rem -0.5rem;
  padding: 0.15rem 0.7rem 0.15rem;
  background: hsla(0, 0%, 50%, 0.31);
  border: 2px solid hsla(0, 0%, 50%, 0.05);
  border-radius: 3px;

  &.hoverable {
    cursor: pointer;
    &:hover {
      border-color: ${(p) => p.featureColor};
    }
  }

  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    font-size: 0.9325rem;

    border-bottom: 1px solid hsla(0, 0%, 50%, 0.1);
    color: hsla(0, 0%, 100%, 1.0);
    &:last-of-type {
      border-bottom: 0;
    }
  }

  strong {
    display: block;
    margin: 0.1rem 0;
    font-weight: 400;
    color: hsla(0, 0%, 80%, 1.0);
  }
`;

export const StyledChangesItemInsightRow = styled.div`
  display: flex;
  padding: 3px 0;
  flex-direction: ${(p) => p.edited ? 'column' : 'row'};
  align-items: ${(p) => p.edited ? 'flex-start' : 'center'};
  justify-content: space-between;
  width: 100%;
`;

export const StyledChangesItemFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.2rem;
`;

export const StyledChangesItemDate = styled.p`
  margin: 0 0 0.3rem;
  font-size: 0.875rem;
  font-weight: 400;
`;

export const StyledChangesItemTitle = styled.h4`
  margin: 0.3rem 0 0.1rem;
  font-size: 0.875rem;
  text-transform: uppercase;
  color: hsla(0, 0%, 80%, 1.0);
`;

export const StyledChangesItemUser = styled.p`
  margin: 0.2rem 0;
  font-size: 1.0rem;
`;

export const StyledChangesItemAddButton = styled.button`
  ${buttonStyle}
`;

export const Actions = styled.form`
  position: relative;
  display: flex;
  justify-content: center;
  padding: 0.6rem 0.6rem 0.6rem;
  border-bottom: 1px solid hsla(0, 0%, 50%, 0.15);
`;

export const ItemHeader = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const ItemBody = styled.div`
  position: relative;
  padding: 0 0.8rem 0 1.4rem;
  color: hsla(0, 0%, 100%, 1.0);
`;

export const InputCheckbox = styled.label`
  display: block;
  margin-top: 0.4rem;
  margin-right: 0.5rem;

  input {
    display: none;
    &:checked {
      & ~ span {
        background: hsla(360, 82%, 52%, 1.0);
        border-color: hsla(360, 82%, 52%, 1.0);
      }
      & ~ span:after {
        transform: translateX(0.7rem);
      }
    }
  }

  span {
    display: block;
    transition: all 250ms ease;
    width: 1.6rem;
    height: 0.9rem;
    background: hsla(0, 0%, 20%, 1.0);
    border: 1px solid hsla(240, 1%, 43%, 1.0);
    border-radius: 32px;

    &:after {
      content: '';
      display: block;
      width: 0.8rem;
      height: 0.8rem;
      background: hsla(0, 0%, 100%, 0.95);
      border-radius: 50%;
      transform: translateX(0);
      transition: all 250ms ease;
    }
  }
`;

export const ItemLabel = styled.label`
  display: block;
  margin: 0;
  padding: 0.3rem 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: hsla(0, 0%, 66%, 1.0);

  transition: color 150ms ease;

  &:hover {
    color: hsla(0, 0%, 96%, 1.0);
  }
`;

export const ItemNameInput = styled.input`
  display: block;
  margin: 0;
  padding: 0.3rem 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: hsla(0, 0%, 66%, 1.0);

  transition: color 150ms ease;
  background: none;
  border: 0;

  &:hover {
    color: hsla(360, 62%, 45%, 1.0);
  }

  &:focus {
    color: hsla(360, 82%, 45%, 1.0);
    outline: none;
  }
`;

export const ItemDeleteButton = styled.button`
  position: absolute;
  right: 1.5rem;

  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.1rem;
  font-size: 0.9375rem;
  line-height: 0.9375;
  cursor: pointer;
  color: hsla(0, 0%, 66%, 0.75);

  transition: all 180ms ease;
  text-transform: uppercase;

  &:hover {
    color: hsla(360, 82%, 52%, 1.0);
    border-color: currentColor;
  }
`;

export const ItemPolygonsCount = styled.span`
  position: absolute;
  right: 0.7rem;
  font-size: 0.875rem;
  color: hsla(0, 0%, 80%, 1.0);
`;

export const NewItemButton = styled.button`
  ${buttonStyle}
`;

export const SyncButton = styled.button`
  ${buttonStyle}
`;

export const ImportButton = styled.label`
  ${buttonStyle}
  input {
    display: none;
  }
`;

export const CustomCheckbox = (props) => (
  <InputCheckbox htmlFor={props.id}>
    <input
      {...props}
      type="checkbox"
    />
    <span />
  </InputCheckbox>
);

const SectionIconWrapper = styled.div`
  display: flex;
  width: 60px;
  padding-left: 0.5rem;
  align-items: center;
  justify-content: space-evenly;
`;

export const ShowHideLayerIcon = ({ show, level, onClick, style }) => {
  const options = {
    width: '12px',
    height: '9px',
    visibility: level === 2 ? 'hidden' : 'visible',
    onClick,
  };
  return (
    show ?
      <HideLayerIcon {...options} style={style} /> :
      <ShowLayerIcon {...options} style={style} />
  );
};

export const SectionIcon = ({ show, isCollapsed, level, icon, onClick }) => (
  <SectionIconWrapper>
    <ShowHideLayerIcon
      show={show}
      level={level}
      onClick={onClick}
      style={{ marginTop: '2px' }}
    />
    <CollapseArrow
      className={isCollapsed && 'is-collapsed'}
      level={level}
    />
    {icon ?
      <Icon
        icon={icon}
      /> :
      <SectionTitleIcon
        width="15px"
        height="15px"
        visibility={level === 3 ? 'hidden' : 'visible'}
      />
    }
  </SectionIconWrapper>
);

const Icon = styled.div`
  display: inline-block;
  width: 15px;
  height: 15px;
  ${(props) => props.icon && `background: url(${props.icon}) no-repeat center center;`}
  background-size: 14px 15px;
`;

CustomCheckbox.propTypes = {
  id: PropTypes.string.isRequired,
};


ShowHideLayerIcon.propTypes = {
  style: PropTypes.object,
  show: PropTypes.bool,
  level: PropTypes.number.isRequired,
  onClick: PropTypes.func,
};

SectionIcon.propTypes = {
  show: PropTypes.bool,
  isCollapsed: PropTypes.bool,
  level: PropTypes.number.isRequired,
  icon: PropTypes.string,
  onClick: PropTypes.func,
};

