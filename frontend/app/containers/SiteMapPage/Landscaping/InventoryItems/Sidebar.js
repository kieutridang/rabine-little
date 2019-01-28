import React from 'react';
import { push as SideBarMenu } from 'react-burger-menu';
import PropTypes from 'prop-types';
import { Tab, TabList, TabPanel } from 'react-tabs';

import SideBarStyles from '../../SidebarStyledComponents/SideBarStyles';
import Tabs from '../../SidebarStyledComponents/StyledTabWrapper';
import Form from './Form';

const LandscapeInventoryItemsSidebar = ({
  isOpen,
  pageWrapId,
  outerContainerId,
  handleSidebarToggle,
  createdLayer,
  handleSaveInventoryLandscape,
  landscapeInventoryItemSelected,
  handleDeleteInventoryLandscape,
  landscapeMeasurementLayers,
  landscapeMeasurementFeatures,
}) => (
  <SideBarMenu
    right
    isOpen={isOpen}
    customBurgerIcon={false}
    width={300}
    outerContainerId={outerContainerId}
    pageWrapId={pageWrapId}
    styles={SideBarStyles}
    disableCloseOnEsc
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
        <Form
          handleSaveInventoryLandscape={handleSaveInventoryLandscape}
          createdLayer={createdLayer || (landscapeInventoryItemSelected && landscapeInventoryItemSelected.layer)}
          inventoryItemValues={landscapeInventoryItemSelected && landscapeInventoryItemSelected.values}
          handleDeleteInventoryLandscape={handleDeleteInventoryLandscape}
          features={landscapeMeasurementFeatures}
          layers={landscapeMeasurementLayers}
        />
      </TabPanel>
    </Tabs>
  </SideBarMenu>
);

LandscapeInventoryItemsSidebar.propTypes = {
  isOpen: PropTypes.bool,
  pageWrapId: PropTypes.string,
  outerContainerId: PropTypes.string,
  handleSidebarToggle: PropTypes.func,
  createdLayer: PropTypes.object,
  handleSaveInventoryLandscape: PropTypes.func,
  landscapeInventoryItemSelected: PropTypes.object,
  handleDeleteInventoryLandscape: PropTypes.func,
  landscapeMeasurementLayers: PropTypes.array.isRequired,
  landscapeMeasurementFeatures: PropTypes.array.isRequired,
};

export default LandscapeInventoryItemsSidebar;
