import { Tabs } from 'react-tabs';
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const TabsContainer = ({ className, children }) => (
  <div className={className}>
    <Tabs>
      { children }
    </Tabs>
  </div>
);

TabsContainer.propTypes = {
  className: PropTypes.string,
  children: PropTypes.any,
};

const TabsWrapper = styled(TabsContainer)`
  .react-tabs {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .react-tabs .react-tabs__tab-list {
    list-style-type: none;
    margin: 0;
    padding: 0;
    display: flex;
    border-bottom: solid 1px #d4d4db;
    color: #373737;
    font-size: 12px;
  }
  .react-tabs .react-tabs__tab-list li {
    opacity: 0.5;
    position: relative;
    top: 2px;
    padding: 10px 23px;
  }
  .react-tabs .react-tabs__tab-list li.react-tabs__tab--selected {
    opacity: 1;
    font-weight: bold;
    border-bottom: solid 2.5px #ed2324;
  }
  .react-tabs .react-tabs__tab-panel {
    margin-top: 10px;
    display: none;
  }
  .react-tabs .react-tabs__tab-panel.react-tabs__tab-panel--selected {
    display: block;
    background-color: ${(props) => props.hasNoBackground ? 'transparent' : '#ffffff'};
    border: ${(props) => props.hasNoBorder ? 'none' : 'solid 1px #efeff1 !important'};
    position: relative;
    flex: 1;
  }
`;

export default TabsWrapper;
