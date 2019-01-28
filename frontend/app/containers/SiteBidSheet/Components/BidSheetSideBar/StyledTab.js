import React from 'react';
import PropTypes from 'prop-types';
import { Tabs } from 'react-tabs';
import styled from 'styled-components';

class TabsContainer extends React.Component {
  state = {
    tabIndex: this.props.defaultIndex || 0,
  }

  handleSelect = (tabIndex) => {
    this.setState(() => ({ tabIndex }));

    const { onSelect } = this.props;
    if (onSelect) {
      onSelect(tabIndex);
    }
  }

  render() {
    const { className, children } = this.props;
    const { tabIndex } = this.state;

    return (
      <div className={className}>
        <Tabs
          selectedIndex={tabIndex}
          onSelect={this.handleSelect}
        >
          { children }
        </Tabs>
      </div>
    );
  }
}

TabsContainer.propTypes = {
  className: PropTypes.string,
  children: PropTypes.any,
  onSelect: PropTypes.func,
  defaultIndex: PropTypes.number,
};

const TabsWrapper = styled(TabsContainer)`
  .react-tabs {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .react-tabs .react-tabs__tab {
    opacity: 0.5;
    margin-left: 20px;
    font-weight: 600;
    line-height: normal;
    letter-spacing: normal;
    font-size: 1.2rem;
  }
  .react-tabs .react-tabs__tab--selected {
    opacity: 1;
    font-weight: 600;
    line-height: normal;
    letter-spacing: normal;
    font-size: 1.2rem;
  }
  .react-tabs .react-tabs__tab-list {
    list-style-type: none;
    margin: 0;
    padding: 0;
    display: flex;
    border-bottom: solid 1px #d4d4db;
    font-size: 12px;
  }
  .react-tabs .react-tabs__tab-list li {
    opacity: 0.5;
    position: relative;
    top: 2px;
    padding: 10px;
  }
  .react-tabs .react-tabs__tab-list li.react-tabs__tab--selected {
    opacity: 1;
    font-weight: bold;
    border-bottom: solid 2.5px #ed2324;
  }
  .react-tabs .react-tabs__tab-panel {
    overflow: auto;
    height: 75vh;
    display: none;
  }
  .react-tabs .react-tabs__tab-panel.react-tabs__tab-panel--selected {
    display: inherit;
    background-color: ${(props) => props.hasNoBackground ? 'transparent' : '#ffffff'};
    border: ${(props) => props.hasNoBorder ? 'none' : 'solid 1px #efeff1 !important'};
    flex: 1;
  }
`;

export default TabsWrapper;
