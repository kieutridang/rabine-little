import React from 'react';
import { push as SideBarMenu } from 'react-burger-menu';
import { Tab, TabList, TabPanel } from 'react-tabs';
import PropTypes from 'prop-types';

import HvacForm from './HvacForm';
import Tabs from '../SidebarStyledComponents/StyledTabWrapper';
import SideBarStyles from '../SidebarStyledComponents/SideBarStyles';

const HvacSideBar = ({
  isOpen,
  outerContainerId,
  pageWrapId,
  createdLayer,
  handleSaveHVAC,
  handleSidebarToggle,
  hvacSelected,
  handleDeleteHvac,
}) => (
  <SideBarMenu
    right
    isOpen={isOpen}
    customBurgerIcon={false}
    width={300}
    noOverlay
    outerContainerId={outerContainerId}
    pageWrapId={pageWrapId}
    styles={SideBarStyles}
    disableCloseOnEsc
    createdLayer={createdLayer}
    onStateChange={handleSidebarToggle}
  >
    <Tabs
      hasNoBackground
      hasNoBorder
    >
      <TabList>
        <Tab>INVENTORY</Tab>
      </TabList>
      <TabPanel>
        <HvacForm
          handleSaveHVAC={handleSaveHVAC}
          createdLayer={createdLayer || (hvacSelected && hvacSelected.layer)}
          hvacValues={hvacSelected && hvacSelected.values}
          handleDeleteHvac={handleDeleteHvac}
        />
      </TabPanel>
    </Tabs>
  </SideBarMenu>
);

HvacSideBar.propTypes = {
  isOpen: PropTypes.bool,
  outerContainerId: PropTypes.string,
  pageWrapId: PropTypes.string,
  createdLayer: PropTypes.object,
  handleSaveHVAC: PropTypes.func,
  handleDeleteHvac: PropTypes.func,
  handleSidebarToggle: PropTypes.func,
  hvacSelected: PropTypes.object,
};

export default HvacSideBar;
