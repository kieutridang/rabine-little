import React from 'react';
import PropTypes from 'prop-types';
import { Tab, TabList, TabPanel } from 'react-tabs';

import { BidSheetSideBarWrapper } from './styled';
import Tabs from './StyledTab';

import ScreenshotsTab from './ScreenshotsTab';
import RepairPhotosTab from './RepairPhotosTab';

const BidSheetSideBar = ({
    repairs,
    screenshotRepairs,
    zoneMapScreenshot,
    propertyScreenshot,
    siteId,
}) => (
  <BidSheetSideBarWrapper>
    <Tabs
      hasNoBackground
      hasNoBorder
      defaultIndex={0}
    >
      <TabList>
        <Tab>Screenshots</Tab>
        <Tab>Repair Photos</Tab>
      </TabList>
      <TabPanel>
        <ScreenshotsTab
          repairs={repairs}
          screenshotRepairs={screenshotRepairs}
          zoneMapScreenshot={zoneMapScreenshot}
          propertyScreenshot={propertyScreenshot}
          siteId={siteId}
        />
      </TabPanel>
      <TabPanel>
        <RepairPhotosTab
          repairs={repairs}
        />
      </TabPanel>
    </Tabs>
  </BidSheetSideBarWrapper>
);

BidSheetSideBar.propTypes = {
  repairs: PropTypes.object.isRequired,
  screenshotRepairs: PropTypes.object,
  zoneMapScreenshot: PropTypes.object,
  propertyScreenshot: PropTypes.object,
  siteId: PropTypes.string.isRequired,
};

export default BidSheetSideBar;
