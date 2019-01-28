// vendor
import React from 'react';
import PropTypes from 'prop-types';
import { Tab, TabList, TabPanel } from 'react-tabs';

// app
import Tabs from './Tabs';

import SitePavementRepairPanel from './sitePavementRepair.repairPanel';
import SitePavementZonePanel from './sitePavementRepair.zonePanel';

import SiteRoofingRepairPanel from './siteRoofingRepair.repairPanel';
import SiteRoofingZonePanel from './siteRoofingRepair.zonePanel';

import LoadingIndicator from '../../components/LoadingIndicator';

const SiteRepairListContainer = ({ repairs, zones, onSelect, siteId, onFilter, featureType }) => (
  <Tabs hasNoBackground hasNoBorder onSelect={onSelect}>
    <TabList>
      <Tab>REPAIRS ({repairs ? repairs.length : 0})</Tab>
      <Tab>ZONES ({zones ? zones.length : 0})</Tab>
    </TabList>

    <TabPanel>
      { repairs === null && <LoadingIndicator /> }
      {
        featureType === 'ROOFING' ?
          <SiteRoofingRepairPanel siteId={siteId} repairs={repairs} onFilter={onFilter} /> :
          <SitePavementRepairPanel siteId={siteId} repairs={repairs} onFilter={onFilter} />
      }
    </TabPanel>

    <TabPanel>
      { zones === null && <LoadingIndicator /> }
      {
        featureType === 'ROOFING' ?
          <SiteRoofingZonePanel zones={zones} onFilter={onFilter} featureType={featureType} /> :
          <SitePavementZonePanel zones={zones} onFilter={onFilter} featureType={featureType} />
      }
    </TabPanel>
  </Tabs>
);

SiteRepairListContainer.propTypes = {
  repairs: PropTypes.array,
  zones: PropTypes.array,
  onSelect: PropTypes.func,
  siteId: PropTypes.string,
  onFilter: PropTypes.func,
  featureType: PropTypes.string,
};

SiteRepairListContainer.defaultProps = {
  repairs: [],
  zones: [],
};

export default SiteRepairListContainer;
