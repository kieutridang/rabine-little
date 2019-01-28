import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import PavementIcon from '../../../../images/icons/section_title_pavement.png';
import AttachedPolygons from '../AttachedPolygons';

import {
  Section,
  SectionIcon,
  SectionTitle,
  SectionLoader,
} from '../elements';

const HvacControls = ({
  toggleSection,
  toggleItem,
  readOnly,
  hvacs,
  showHVAC,
  isHvacCollapsed,
  isHvacInventoryItemsCollapsed,
  renderAreaList,
}) => {
  const renderHvacCount = () => {
    const { data = [], isLoading } = hvacs;
    const count = (
      <span style={{ marginLeft: '0.4rem' }}>
        ({data.length})
      </span>
    );
    return isLoading ? null : count;
  };

  const renderHvacInventoryItems = () => {
    const { isLoading, data = [] } = hvacs;

    if (isLoading) {
      return <SectionLoader>Fetching Inventory Items...</SectionLoader>;
    }

    if (!isLoading && (data.length === 0)) {
      return <SectionLoader>No Inventory Items found.</SectionLoader>;
    }

    return (
      <AttachedPolygons
        layerId={'HVAC'}
        features={data}
        readOnly={readOnly}
        onLayerItemClick={() => null}
        onLayerItemMouseOver={() => null}
        onLayerItemMouseLeave={() => null}
        reorderFeatures={() => null}
      />
    );
  };


  return (
    <Section>
      <SectionTitle
        level={1}
        onClick={toggleSection('isHvacCollapsed')}
      >
        <SectionIcon
          show={showHVAC}
          level={1}
          icon={PavementIcon}
          isCollapsed={isHvacCollapsed}
          onClick={toggleItem('HVAC', !showHVAC, 'HVAC')}
        />
            HVAC
        </SectionTitle>
      {isHvacCollapsed && (
        <Fragment>
          <Section>
            <SectionTitle onClick={toggleSection('isSourceImagesCollapsed')}>
              <SectionIcon isCollapsed={isHvacInventoryItemsCollapsed} level={2} />
                Media
            </SectionTitle>
            {isHvacInventoryItemsCollapsed && renderAreaList && renderAreaList()}
          </Section>
          <Section>
            <SectionTitle onClick={toggleSection('isHvacInventoryItemsCollapsed')}>
              <SectionIcon level={2} isCollapsed={isHvacInventoryItemsCollapsed} />
                Inventory Items {renderHvacCount()}
            </SectionTitle>
            {isHvacInventoryItemsCollapsed && renderHvacInventoryItems()}
          </Section>
        </Fragment>
        )}
    </Section>
  );
};

HvacControls.propTypes = {
  showHVAC: PropTypes.bool.isRequired,
  isHvacCollapsed: PropTypes.bool.isRequired,
  isHvacInventoryItemsCollapsed: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  toggleSection: PropTypes.func.isRequired,
  toggleItem: PropTypes.func.isRequired,
  hvacs: PropTypes.object,
  renderAreaList: PropTypes.func,
};

export default HvacControls;
