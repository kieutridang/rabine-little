import styled from 'styled-components';
import React from 'react';
import PropTypes from 'prop-types';
import { CollapseArrow } from '../elements';

export const None = styled.div`
  padding: 0.4rem 1.0rem;
  font-size: 0.875rem;
  color: hsla(0, 0%, 60%, 1.0);
`;

export const List = styled.div`
  margin: 0 0.3rem 0 0.5rem;
  padding: 0.4rem 0 0.6rem 0.5rem;
  color: hsla(0, 0%, 88%, 1.0);
`;

export const Row = styled.div`
  display: flex;
`;

export const Item = styled.div`
  display: flex;
  padding: 0.2rem 0;
  font-size: 0.75rem;
  width: 100%;

  cursor: pointer;

  &:hover {
    color: hsla(0, 0%, 100%, 1.0);
  }
`;

export const LayerlessTitle = styled.strong`
  display: block;
  margin: 0.5rem 0.3rem 0.4rem 0.5rem;
  padding: 0.4rem 0.1rem 0.4rem 0.6rem;

  font-size: 0.75rem;

  border-bottom: 1px solid hsla(0, 0%, 50%, 0.1);
  color: hsla(0, 0%, 100%, 1.0);
`;

export const Title = styled.span`
  word-break: break-all;
  flex: 1;
  padding-right: 5px;
  color: hsla(0, 0%, 100%, 1.0);
`;

export const InfoTag = styled.span`
  word-break: keep-all;
  width: 2.5rem;
  height: 1.2rem;
  background-color: #333333;
  margin-left: ${(p) => p.hasMarginLeft ? '2rem' : 'auto'};
  margin-right: 2rem;
  text-align: center;
  color: white;
  font-size: 0.7rem;
`;

export const ColorSymbol = styled.div`
  width: 0.2rem;
  height: 0.75rem;
  margin: 5px 5px 0 0.8rem;
  background: ${(p) => p.color};
`;

export const StyledDragHandle = styled.span`
  font-weight: 600;
  color: hsla(0, 0%, 100%, 0.4);
  cursor: pointer;
`;

export const GroupListWrapper = styled.div`
  display: block;
  margin: 0.1rem 0.3rem 0.1rem 0.2rem;
  padding: 0.1rem 0.1rem 0.1rem 0.2rem;
  font-size: ${(p) => p.isCondition ? '0.95rem' : '0.8rem'};
`;

export const GroupListHead = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 2px 0;

  color: hsla(0, 0%, 100%, 1.0);
  border-bottom: 1px solid hsla(0, 0%, 50%, 0.15);
  cursor: pointer;
  opacity: 0.8;
  transition: all 100ms ease;

  &:hover,
  .active {
    opacity: 1.0;
    border-bottom: 1px solid hsla(0, 0%, 50%, 0.25);
  }

  .value {
    margin-left: 0;
  }
`;

export const GroupListHeadTitle = styled.div`
  flex: 1;
  display: flex;
  color: hsla(0, 0%, 100%, 1.0);

  .arrow {
    margin: 7px -0.4rem auto 0.4rem;
    width: 0.3rem;
    height: 0.3rem;
  }

  .color-symbol {
    margin-left: 1.0rem;
  }
`;

export const GroupListHeadCount = styled.div`
  position: absolute;
  right: 0.7rem;
  font-size: 0.75rem;
  color: hsla(0, 0%, 80%, 1.0);
`;

export const GroupListBody = styled.div`
  display: none;
  padding: 0.4rem 0.2rem 0.4rem 0.8rem;
  &.active {
    display: block;
  }
`;

export const GroupListPatch = styled.span`
  color: gray;
  margin-left: 3px;
  font-size: 0.7rem;
`;

export const GroupList = (props) => {
  const {
    toggleGroup,
    isActive,
    groupTitle,
    color,
    title,
    groupPatch,
    length,
    content,
    weightedPCI,
    isCondition,
  } = props;

  return (
    <GroupListWrapper isCondition>
      <GroupListHead onClick={toggleGroup(groupTitle, isCondition)} className={isActive ? 'active' : ''}>
        <GroupListHeadTitle>
          <CollapseArrow
            className={`arrow ${isActive && 'is-collapsed'}`}
          />
          <ColorSymbol className="color-symbol" color={color} />
          <span className="value">
            {title}
            {groupPatch && <GroupListPatch>{groupPatch}</GroupListPatch>}
          </span>
          {weightedPCI ? <InfoTag hasMarginLeft> { weightedPCI } </InfoTag> : null }
        </GroupListHeadTitle>
        <GroupListHeadCount>
          {length}
        </GroupListHeadCount>
      </GroupListHead>
      <GroupListBody className={isActive ? 'active' : ''}>
        {content}
      </GroupListBody>
    </GroupListWrapper>
  );
};

GroupList.propTypes = {
  toggleGroup: PropTypes.func.isRequired,
  isActive: PropTypes.bool.isRequired,
  groupTitle: PropTypes.string.isRequired,
  color: PropTypes.string,
  title: PropTypes.string,
  groupPatch: PropTypes.string,
  length: PropTypes.number.isRequired,
  content: PropTypes.array.isRequired,
  weightedPCI: PropTypes.number,
  isCondition: PropTypes.bool,
};
