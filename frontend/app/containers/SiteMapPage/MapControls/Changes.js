import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import {
  StyledChanges,
  StyledChangesItem,
  StyledChangesItemInsight,
  StyledChangesItemInsightRow,
  StyledChangesItemUser,

  StyledChangesItemFooter,
  StyledChangesItemDate,
  StyledChangesItemAddButton,

  Body,
  SectionLoader,
} from './elements';

const ChangesItemInsight = ({ data = {} }) => {
  const changedFields = {
    old: data.changedFields && data.changedFields.old ? data.changedFields.old : {},
    new: data.changedFields && data.changedFields.new ? data.changedFields.new : {},
  };

  if (data.type.includes('LAYER')) {
    const isDeletion = data.type === 'DELETE_LAYER';
    const isRestore = data.type === 'RESTORE_LAYER';

    const staticField = isDeletion || isRestore;

    return (
      <StyledChangesItemInsight>
        {(changedFields.old.name || changedFields.new.name) && (
          <li>
            <StyledChangesItemInsightRow edited>
              <strong>Layer Name</strong>
              <div>
                {changedFields.old.name && <span>{changedFields.old.name} &nbsp; to &nbsp;</span>}
                <span style={{ color: 'red' }}>{changedFields.new.name}</span>
              </div>
            </StyledChangesItemInsightRow>
          </li>
        )}
        {(staticField && data.layer.name) && (
          <li>
            <StyledChangesItemInsightRow>
              <strong>Layer Name</strong>
              {data.layer.name}
            </StyledChangesItemInsightRow>
          </li>
        )}
      </StyledChangesItemInsight>
    );
  }

  if (data.type.includes('FEATURE')) {
    const isPolygon = data.renderedType === 'Polygon';
    const isDeletion = data.type === 'DELETE_FEATURE';
    const isRestore = data.type === 'RESTORE_FEATURE';

    const staticField = isPolygon || isDeletion || isRestore;
    const geojson = data.feature.geojson || {};
    const coordinates = geojson.geometry && geojson.geometry.coordinates
      ? geojson.geometry.coordinates
      : {};

    return (
      <StyledChangesItemInsight
        onClick={data.feature.onClick}
        onFocus={data.feature.onMouseOver}
        onMouseOver={data.feature.onMouseOver}
        onMouseLeave={data.feature.onMouseLeave}
        featureColor={data.feature.color}
        className={data.feature.isOnMap && 'hoverable'}
      >
        {(changedFields.old.title || changedFields.new.title) && (
          <li>
            <StyledChangesItemInsightRow edited>
              <strong>{data.renderedType === 'Zone' ? 'Zone' : 'Repair'} Name</strong>
              <div>
                {changedFields.old.title && <span>{changedFields.old.title} &nbsp; to &nbsp;</span>}
                <span style={{ color: 'red' }}>{changedFields.new.title}</span>
              </div>
            </StyledChangesItemInsightRow>
          </li>
        )}
        {(staticField && data.feature.title) && (
          <li>
            <StyledChangesItemInsightRow>
              <strong>{data.renderedType === 'Zone' ? 'Zone' : 'Repair'} Name</strong>
              {data.feature.title}
            </StyledChangesItemInsightRow>
          </li>
        )}

        {(changedFields.old.color || changedFields.new.color) && (
          <li>
            <StyledChangesItemInsightRow edited>
              <strong>Color</strong>
              <div>
                {changedFields.old.color && <span>{changedFields.old.color} &nbsp; to &nbsp;</span>}
                <span style={{ color: changedFields.new.color }}>{changedFields.new.color}</span>
              </div>
            </StyledChangesItemInsightRow>
          </li>
        )}
        {(staticField && data.feature.color) && (
          <li>
            <StyledChangesItemInsightRow>
              <strong>Color</strong>
              <span style={{ color: data.feature.color }}>{data.feature.color}</span>
            </StyledChangesItemInsightRow>
          </li>
        )}

        {(changedFields.old.surfaceType || changedFields.new.surfaceType) && (
          <li>
            <StyledChangesItemInsightRow edited>
              <strong>Surface Type</strong>
              <div>
                {changedFields.old.surfaceType && <span>{changedFields.old.surfaceType} &nbsp; to &nbsp;</span>}
                <span style={{ color: 'red' }}>{changedFields.new.surfaceType}</span>
              </div>
            </StyledChangesItemInsightRow>
          </li>
        )}
        {(staticField && data.feature.surfaceType) && (
          <li>
            <StyledChangesItemInsightRow>
              <strong>Surface Type</strong>
              {data.feature.surfaceType}
            </StyledChangesItemInsightRow>
          </li>
        )}

        {(changedFields.old.repairType || changedFields.new.repairType) && (
          <li>
            <StyledChangesItemInsightRow edited>
              <strong>Repair Type</strong>
              <div>
                {changedFields.old.repairType && <span>{changedFields.old.repairType} &nbsp; to &nbsp;</span>}
                <span style={{ color: 'red' }}>{changedFields.new.repairType}</span>
              </div>
            </StyledChangesItemInsightRow>
          </li>
        )}
        {(staticField && data.feature.repairType) && (
          <li>
            <StyledChangesItemInsightRow>
              <strong>Repair Type</strong>
              {data.feature.repairType}
            </StyledChangesItemInsightRow>
          </li>
        )}

        {(changedFields.old.inputArea || changedFields.new.inputArea) && (
          <li>
            <StyledChangesItemInsightRow>
              <strong>Restripe Affected Areas</strong>
              <div>
                {changedFields.old.inputArea && <span>{changedFields.old.inputArea} &nbsp; to &nbsp;</span>}
                <span style={{ color: 'red' }}>{changedFields.new.inputArea}</span>
              </div>
            </StyledChangesItemInsightRow>
          </li>
        )}
        {(staticField && data.feature.inputArea) && (
          <li>
            <StyledChangesItemInsightRow>
              <strong>Restripe Affected Areas</strong>
              {data.feature.inputArea}
            </StyledChangesItemInsightRow>
          </li>
        )}

        {(changedFields.old.inputAsphalt || changedFields.new.inputAsphalt) && (
          <li>
            <StyledChangesItemInsightRow>
              <strong>Fill Asphalt Crack</strong>
              <div>
                {changedFields.old.inputAsphalt && <span>{changedFields.old.inputAsphalt} &nbsp; to &nbsp;</span>}
                <span style={{ color: 'red' }}>{changedFields.new.inputAsphalt}</span>
              </div>
            </StyledChangesItemInsightRow>
          </li>
        )}
        {(staticField && data.feature.inputAsphalt) && (
          <li>
            <StyledChangesItemInsightRow>
              <strong>Fill Asphalt Crack</strong>
              {data.feature.inputAsphalt}
            </StyledChangesItemInsightRow>
          </li>
        )}

        {(changedFields.old.pci || changedFields.new.pci) && (
          <li>
            <StyledChangesItemInsightRow edited>
              <strong>PCI</strong>
              <div>
                {changedFields.old.pci && <span>{changedFields.old.pci} &nbsp; to &nbsp;</span>}
                <span style={{ color: 'red' }}>{changedFields.new.pci}</span>
              </div>
            </StyledChangesItemInsightRow>
          </li>
        )}
        {(staticField && data.feature.pci) && (
          <li>
            <StyledChangesItemInsightRow>
              <strong>PCI Type</strong>
              {data.feature.pci}
            </StyledChangesItemInsightRow>
          </li>
        )}

        {(changedFields.old.trafficType || changedFields.new.trafficType) && (
          <li>
            <StyledChangesItemInsightRow edited>
              <strong>Traffic Type</strong>
              <div>
                {changedFields.old.trafficType && <span>{changedFields.old.trafficType} &nbsp; to &nbsp;</span>}
                <span style={{ color: 'red' }}>{changedFields.new.trafficType}</span>
              </div>
            </StyledChangesItemInsightRow>
          </li>
        )}
        {(staticField && data.feature.trafficType) && (
          <li>
            <StyledChangesItemInsightRow>
              <strong>Traffic Type</strong>
              {data.feature.trafficType}
            </StyledChangesItemInsightRow>
          </li>
        )}

        {(changedFields.old.zoneTitle || changedFields.new.zoneTitle) && (
          <li>
            <StyledChangesItemInsightRow edited>
              <strong>Zone</strong>
              <div>
                {changedFields.old.zoneTitle && <span>{changedFields.old.zoneTitle} &nbsp; to &nbsp;</span>}
                <span style={{ color: 'red' }}>{changedFields.new.zoneTitle}</span>
              </div>
            </StyledChangesItemInsightRow>
          </li>
        )}
        {(staticField && data.feature.zoneTitle) && (
          <li>
            <StyledChangesItemInsightRow>
              <strong>Zone</strong>
              {data.feature.zoneTitle}
            </StyledChangesItemInsightRow>
          </li>
        )}

        {(changedFields.old.layerName || changedFields.new.layerName) && (
          <li>
            <StyledChangesItemInsightRow edited>
              <strong>Layer</strong>
              <div>
                {changedFields.old.layerName && <span>{changedFields.old.layerName} &nbsp; to &nbsp;</span>}
                <span style={{ color: 'red' }}>{changedFields.new.layerName}</span>
              </div>
            </StyledChangesItemInsightRow>
          </li>
        )}
        {(staticField && data.feature.layerName) && (
          <li>
            <StyledChangesItemInsightRow>
              <strong>Layer</strong>
              {data.feature.layerName}
            </StyledChangesItemInsightRow>
          </li>
        )}

        {coordinates && coordinates[0] && (
          <li>
            <strong>Corners</strong>
            {coordinates[0].length - 1}
          </li>
        )}

        {data.feature.isOnMap && (
          <li>
            <strong>Present on map</strong>
            Yes
          </li>
        )}
      </StyledChangesItemInsight>
    );
  }

  return null;
};

const renderTitleByType = (item) => {
  const { type, renderedType } = item;

  switch (type) {
    case 'UPDATE_FEATURE':
      return {
        title: `${item.isFirstEdit ? 'created' : 'edited'} ${renderedType}`,
      };
    case 'RESTORE_FEATURE':
      return {
        title: `restored ${renderedType}`,
      };
    case 'DELETE_FEATURE':
      return {
        title: `deleted ${renderedType}`,
      };
    case 'RESTORE_LAYER':
      return {
        title: 'restored layer',
      };
    case 'DELETE_LAYER':
      return {
        title: 'deleted layer',
      };
    case 'REORDER_LAYERS':
      return {
        title: 'reordered layers',
      };
    case 'REORDER_FEATURES':
      return {
        title: 'reordered features',
      };
    default:
      return '';
  }
};

const ChangesItem = ({ item = {} }) => {
  const showsInsight =
    !item.type.includes('REORDER')
    && (item.feature || item.layer);

  const isZone = item.feature.layerName && item.feature.layerName === 'Zone';
  const hasLayer = isZone || item.feature.layerId;
  const type = isZone ? 'Zone' : 'Repair';

  const updatedItem = {
    ...item,
    renderedType: !hasLayer ? 'Polygon' : type,
  };

  const action = renderTitleByType(updatedItem);
  const renderedName = updatedItem.user.fullName || updatedItem.user.username;

  return (
    <StyledChangesItem>
      <StyledChangesItemUser>
        {renderedName} {action.title}
      </StyledChangesItemUser>
      {showsInsight && (
        <ChangesItemInsight data={updatedItem} action={action} />
      )}
      <StyledChangesItemFooter>
        <StyledChangesItemDate>{moment(updatedItem.createdAt).fromNow()}</StyledChangesItemDate>
        {!updatedItem.feature.isOnMap && updatedItem.feature && updatedItem.feature.geojson && (
          <StyledChangesItemAddButton onClick={updatedItem.feature.addToMap}>
            Add to Map
          </StyledChangesItemAddButton>
        )}
        {updatedItem.type === 'DELETE_LAYER' && !updatedItem.layer.isPresent && updatedItem.layer && (
          <StyledChangesItemAddButton onClick={updatedItem.layer.restore}>
            Restore Layer
          </StyledChangesItemAddButton>
        )}
      </StyledChangesItemFooter>
    </StyledChangesItem>
  );
};

const ChangesComponent = (props) => {
  const {
    changes: { isLoading, isLoadingMore, data = [], total },
    isActive,
    loadMoreChanges,
  } = props;

  const list = data
    // .sort((a, b) => moment(a.createdAt) < moment(b.createdAt))
    .map((item) => <ChangesItem key={item._id} item={item} />);

  const hasMoreToLoad = total && list.length < total;

  const loadMore = (e) => {
    e.preventDefault();
    loadMoreChanges();
  };

  return (
    <Body className={`changes ${isActive && 'active'}`}>
      <StyledChanges>
        {isLoading && <SectionLoader>Fetching history...</SectionLoader>}
        {!isLoading && list.length === 0 && <SectionLoader>No changes logged.</SectionLoader>}
        {list}
        {!isLoadingMore && hasMoreToLoad ? (
          <SectionLoader>
            <button onClick={loadMore}>Fetch more ({list.length}/{total})</button>
          </SectionLoader>
        ) : null}
        {!isLoadingMore && !hasMoreToLoad && (
          <SectionLoader>
            That’s all there is to it.
          </SectionLoader>
        )}
        {isLoadingMore && <SectionLoader>Fetching more...</SectionLoader>}
      </StyledChanges>
    </Body>
  );
};

ChangesItem.propTypes = {
  item: PropTypes.object.isRequired,
};

ChangesItemInsight.propTypes = {
  data: PropTypes.object.isRequired,
};

ChangesComponent.propTypes = {
  changes: PropTypes.object.isRequired,
  isActive: PropTypes.bool.isRequired,
  loadMoreChanges: PropTypes.func.isRequired,
};

export default ChangesComponent;
