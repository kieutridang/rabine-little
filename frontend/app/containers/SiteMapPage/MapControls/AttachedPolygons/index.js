import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import sortBy from 'lodash/sortBy';
import groupBy from 'lodash/groupBy';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';

import {
  arrayMove,
} from 'react-sortable-hoc';

import MissingFieldAlert from '../../../../images/icons/missing-field-alert.svg';
import {
  Item,
  LayerlessTitle,
  Title,
  ColorSymbol,
  InfoTag,

  None,

  GroupList,
} from './elements';

import SortableList from './SortableList';
import { PCIColors } from '../../constants';

import { convertGeometryToLayer, getLayerArea, getProperCoordinates } from '../../utils';

class AttachedPolygons extends React.Component {
  state = {
    activeGroups: {},
  }

  onSortEnd = (list = []) => ({ oldIndex, newIndex }) => {
    const reorderedIndexes = {};

    arrayMove(list, oldIndex, newIndex).forEach((feature, index) => {
      reorderedIndexes[feature._id] = index;
    });

    this.props.reorderFeatures({
      layerId: this.props.layerId,
      reordered: reorderedIndexes,
    });
  };

  getSortedItems = () => {
    const {
      layerId,
      features = [],
    } = this.props;
    const isLayerless = !layerId;

    let reduceFeatures = null;
    if (isLayerless) {
      reduceFeatures = features.filter((feature) => !feature.layerId);
    } else {
      reduceFeatures = features;
    }

    const mappedFeatures = reduceFeatures.map((feature, index) => ({
      ...feature,
      index: typeof feature.index === 'undefined' ? index : feature.index,
    }));
    const sorted = sortBy(mappedFeatures, 'index');
    return sorted;
  };

  toggleGroup = (title) => () => {
    this.setState({
      activeGroups: {
        ...this.state.activeGroups,
        [title]: !this.state.activeGroups[title],
      },
    });
  };

  calculateWeightedPCI = (zones) => {
    const totalZone = this.calculateTotalZoneArea(zones);
    let weightedPCI = 0;
    zones.forEach((zone) => {
      const geojson = cloneDeep(zone.geojson);
      const properCoordinates = getProperCoordinates(geojson.geometry.coordinates);
      geojson.geometry.coordinates = properCoordinates;

      const layer = convertGeometryToLayer(geojson);
      const area = getLayerArea(layer);

      if (!area.isLine && area.area && zone.pci) {
        weightedPCI += (area.area / totalZone) * zone.pci;
      }
    });
    return Math.round(weightedPCI);
  }

  calculateWeightedPCI = (zones) => {
    const totalZone = this.calculateTotalZoneArea(zones);
    let weightedPCI = 0;
    zones.forEach((zone) => {
      const geojson = cloneDeep(zone.geojson);
      const properCoordinates = getProperCoordinates(geojson.geometry.coordinates);
      geojson.geometry.coordinates = properCoordinates;

      const layer = convertGeometryToLayer(geojson);
      const area = getLayerArea(layer);

      if (!area.isLine && area.area && zone.pci) {
        weightedPCI += (area.area / totalZone) * zone.pci;
      }
    });
    return Math.round(weightedPCI);
  }

  calculateTotalZoneArea = (zones) => {
    let totalZone = 0;
    zones.forEach((zone) => {
      const geojson = cloneDeep(zone.geojson);
      const properCoordinates = getProperCoordinates(geojson.geometry.coordinates);
      geojson.geometry.coordinates = properCoordinates;

      const layer = convertGeometryToLayer(geojson);
      const area = getLayerArea(layer);
      if (!area.isLine && area.area) {
        totalZone += parseFloat(area.area);
      }
    });
    return totalZone;
  }

  checkMissingField = (feature) => {
    const {
      repairType,
      type,
      surfaceType,
      trafficType,
      zoneId,
    } = feature;
    // check missing field for zones
    if (type === 'zone' && (!surfaceType || !trafficType)) return true;
    // check missing field for repairs
    if (type === 'repair' && (!zoneId || !repairType)) return true;
    return false;
  };

  renderItem = (payload) => {
    const {
      _id,
      title,
      color,
      missingField,
      featureType,
      pci,
      isTitled,
      differentId,
    } = payload;

    return (
      <Item
        key={differentId || _id}
        onClick={this.props.onLayerItemClick(_id)}
        onFocus={this.props.onLayerItemMouseOver(_id)}
        onBlur={this.props.onLayerItemMouseLeave(_id)}
        onMouseOver={this.props.onLayerItemMouseOver(_id)}
        onMouseLeave={this.props.onLayerItemMouseLeave(_id)}
      >
        <ColorSymbol color={color} />
        { isTitled ? title : <Title>{title || 'Untitled'}</Title> }
        { featureType === 'zone' && <InfoTag> {pci || 'Not Set'}</InfoTag> }
        {
          missingField &&
          <MissingFieldAlert width="5px" height="18px" style={{ marginTop: '1px' }} />
        }
      </Item>
    );
  };

  renderQtyLandscapeItemsTitle = (title, qty) => (
    <Fragment key={title}>
      <Title>{title}: </Title> <InfoTag>{qty}</InfoTag>
    </Fragment>
  )

  renderList = (sorted = [], isNumbered = false, forcedColor) => {
    const list = sorted.map((feature, index) => {
      const isZone = feature.title && feature.title.includes('Zone');
      const titleSplitted = feature.title && feature.title.split(' ');
      let noPrefix = '';

      if (isNumbered) {
        if (feature.title.endsWith('(duplicated)')) {
          const duplicatedPrefix = titleSplitted[titleSplitted.length - 1];
          const zoneNumber = titleSplitted[titleSplitted.length - 2];
          noPrefix = [zoneNumber, duplicatedPrefix].join(' '); // get zone number and duplicated tag. e.g : 2 (duplicated)
        } else {
          noPrefix = titleSplitted[titleSplitted.length - 1];
        }
      }

      const enumeratedTitle = isZone ? `${noPrefix}.0${index + 1}` : `${index + 1}: ${feature.title}`;
      const title = isNumbered ? enumeratedTitle : feature.title;

      return {
        title: feature.unitNumber || (feature.inventoryType && feature.inventoryType.name) || title,
        _id: feature._id,
        index: feature.index,
        color: forcedColor || feature.color || (feature.unitType ? feature.unitType.color : '#FFF'),
        missingField: feature.missingField || this.checkMissingField(feature),
        featureType: feature.title && feature.title.includes('Zone') ? 'zone' : 'repair',
        pci: feature.pci,
      };
    });

    return list.map(this.renderItem);
  };

  renderGroupedQtyLandscapeList = (grouped = []) => {
    const list = grouped.map((item, index) => ({
      title: this.renderQtyLandscapeItemsTitle(item.title, item.value),
      _id: item.identifiers,
      color: item.color,
      index,
      featureType: 'LANDSCAPE_INVENTORY_ITEM',
      isTitled: true,
      differentId: index,
      missingField: item.missingField,
    }));

    return list.map(this.renderItem);
  }

  renderGroupList(sorted) {
    const zonesNs = [...sorted].filter((f) => f.title && f.title.includes('Zone'));
    const zones = sortBy(zonesNs, (z) => +z.title.split(' ')[1]); // quick fix, better change it soon

    const groupedZones = groupBy(zones, (f) => f.title.replace('(duplicated)', '').trim());

    const list = Object.keys(groupedZones)
      .map((key) => {
        const groupTitle = key;
        const grouped = groupedZones[groupTitle];
        const one = grouped[0];
        const weightedPCI = this.calculateWeightedPCI(grouped);
        const isActive = !!this.state.activeGroups[groupTitle];
        const content = this.renderList(grouped, true);
        const groupsKey = `${groupTitle}${new Date()}`;

        return (
          <GroupList
            key={groupsKey}
            toggleGroup={this.toggleGroup}
            isActive={isActive}
            groupTitle={groupTitle}
            color={one.color}
            title={one.title}
            length={grouped.length}
            content={content}
            weightedPCI={weightedPCI}
          />
        );
      });

    return (<Fragment>{list}</Fragment>);
  }

  renderSimpleList(sorted) {
    const { layerId, readOnly } = this.props;
    const isLayerless = !layerId;

    if (!isLayerless) {
      const repair = {};
      const groupPatches = groupBy(sorted, (f) => f.patchNumber ? f.patchNumber : 'noPatch');
      Object.keys(groupPatches)
        .forEach((key) => {
          if (key !== 'noPatch') {
            repair[key] = groupBy(groupPatches[key], (f) => f.title);
          }
        });
      const unGroupedList = this.renderList(groupPatches.noPatch, false, null, layerId);

      const groupedList = Object.keys(repair).map((key) => (
        Object.keys(repair[key])
          .map((repairKey) => {
            const groupTitle = repairKey;
            const groupPatch = `(Patch ${key})`;
            const groupTitlePatch = `${groupTitle} ${groupPatch}`;
            const grouped = repair[key][groupTitle];
            const one = grouped[0];
            const isActive = !!this.state.activeGroups[groupTitlePatch];
            const content = this.renderList(grouped, true);
            const groupsKey = `${groupTitlePatch}${new Date()}`;

            return (
              <GroupList
                key={groupsKey}
                toggleGroup={this.toggleGroup}
                isActive={isActive}
                groupTitle={groupTitlePatch}
                color={one.color}
                title={one.title}
                groupPatch={groupPatch}
                length={grouped.length}
                content={content}
              />
            );
          })
      ));

      return (
        <Fragment>
          {groupedList}
          {unGroupedList}
        </Fragment>
      );
    }
    const items = this.renderList(sorted);

    return (
      <Fragment>
        {isLayerless && <LayerlessTitle>Untagged Features</LayerlessTitle>}
        <SortableList
          key={Math.random()}
          items={items}
          onSortEnd={this.onSortEnd(sorted)}
          useDragHandle={!readOnly}
          shouldCancelStart={() => readOnly}
          readOnly={readOnly}
        />
      </Fragment>
    );
  }

  renderPCIMap(groupedZones) {
    const zones = cloneDeep(groupedZones);
    const list = Object.keys(groupedZones)
      .map((key) => {
        const groupTitle = key;
        const grouped = zones[groupTitle];
        const equalNamed = groupBy(grouped, (f) => f.title.replace('(duplicated)', '').trim());
        grouped.forEach((feat) => {
          if (equalNamed[feat.title] && equalNamed[feat.title].length >= 1) {
            grouped.filter((feature) => feature.title === feat.title)
              .forEach((filteredFeature, index) => {
                filteredFeature.title = filteredFeature.title + ` (.0${index + 1})`; // eslint-disable-line
              });
            equalNamed[feat.title] = [];
          }
        });
        const isActive = !!this.state.activeGroups[groupTitle];
        const content = this.renderList(grouped, false, PCIColors[key]);
        const groupsKey = `${groupTitle}${new Date()}`;

        return (
          <GroupList
            key={groupsKey}
            toggleGroup={this.toggleGroup}
            isActive={isActive}
            groupTitle={groupTitle}
            color={PCIColors[key]}
            title={groupTitle}
            length={grouped.length}
            content={content}
            isCondition
          />
        );
      });

    return (<Fragment>{list}</Fragment>);
  }

  renderInventoryItemsLandscapeList(items, zones) {
    const { readOnly } = this.props;
    const dataUngrouped = {};
    const zonedData = {};
    const polygonInventoryItemsUngrouped = [];
    const polygonInventoryItemsGrouped = {};
    const zonedItems = {};
    const itemsCopy = cloneDeep(items);
    const itemsUngrouped = [];

    const groupedZones = groupBy(zones, 'title');

    itemsCopy.forEach((item) => {
      let isItemZoned = false;
      let zoneSaved;
      Object.keys(groupedZones).forEach((zone) => {
        if (!isItemZoned) {
          isItemZoned = !!groupedZones[zone].find((zoneVal) => item.zoneId === zoneVal._id);
          if (isItemZoned) zoneSaved = zone;
        }
      });

      if (isItemZoned) {
        if (typeof zonedItems[zoneSaved] === 'undefined') {
          zonedItems[zoneSaved] = [];
        }
        zonedItems[zoneSaved].push(item);
      } else {
        itemsUngrouped.push(item);
      }
    });

    Object.keys(zonedItems).forEach((zonedItem) => {
      zonedData[zonedItem] = {};

      zonedItems[zonedItem].forEach((item) => {
        if (!isEmpty(item.qty)) {
          Object.keys(item.qty).forEach((key) => {
            if (typeof zonedData[zonedItem][key] === 'undefined') {
              zonedData[zonedItem][key] = {
                value: 0,
                identifiers: [],
                title: key,
                color: '#228B22',
              };
            }
            zonedData[zonedItem][key].value += +item.qty[key];
            zonedData[zonedItem][key].identifiers.push({ id: item._id, qty: +item.qty[key] });
          });
        } else {
          if (typeof polygonInventoryItemsGrouped[zonedItem] === 'undefined') {
            polygonInventoryItemsGrouped[zonedItem] = [];
          }
          polygonInventoryItemsGrouped[zonedItem].push(item);
        }
      });
    });

    itemsUngrouped.forEach((item) => {
      if (!isEmpty(item.qty)) {
        Object.keys(item.qty).forEach((key) => {
          if (typeof dataUngrouped[key] === 'undefined') {
            dataUngrouped[key] = {
              value: 0,
              identifiers: [],
              title: key,
              color: '#228B22',
              missingField: true,
            };
          }
          dataUngrouped[key].value += +item.qty[key];
          dataUngrouped[key].identifiers.push({ id: item._id, qty: +item.qty[key] });
        });
      } else {
        polygonInventoryItemsUngrouped.push({ ...item, missingField: true });
      }
    });

    Object.keys(zonedData).forEach((zone) => {
      zonedData[zone] = Object.keys(zonedData[zone]).map((i) => zonedData[zone][i]);
    });

    const groupedList = Object.keys(zonedData)
      .map((key, i) => {
        const groupTitle = key;
        const childs = zonedData[groupTitle];
        const one = childs[0];
        const polygonsList = this.renderList(polygonInventoryItemsGrouped[key] || []);
        const groupLength = childs.length + polygonsList.length;
        const content = this.renderGroupedQtyLandscapeList(childs);
        const groupsKey = `${groupTitle}${new Date()}${i}`;

        return (
          <GroupList
            key={groupsKey}
            isActive={!!this.state.activeGroups[groupTitle]}
            groupTitle={groupTitle}
            color={one && one.color}
            title={groupTitle}
            length={groupLength}
            content={[...content, ...polygonsList]}
            toggleGroup={this.toggleGroup}
          />
        );
      });

    const groupedArr = Object.keys(dataUngrouped).map((i) => dataUngrouped[i]);
    const markerList = this.renderGroupedQtyLandscapeList(groupedArr);
    const polygonList = this.renderList(polygonInventoryItemsUngrouped);
    const list = [...markerList, ...polygonList];

    return (
      <Fragment>
        {groupedList}
        <SortableList
          key={Math.random()}
          items={list}
          onSortEnd={() => null}
          useDragHandle={!readOnly}
          shouldCancelStart={() => readOnly}
          readOnly={readOnly}
        />
      </Fragment>
    );
  }


  render() {
    const { layer, features, isCondition, layerId, zones } = this.props;
    if (isCondition && layer.title === 'PCI Map') {
      return this.renderPCIMap(features);
    }

    const sorted = this.getSortedItems();
    if (sorted.length === 0) {
      return (<None>None</None>);
    }

    const isZoneMapLayer = layer && layer.name && layer.name.trim().includes('Zone');

    if (isZoneMapLayer) {
      return this.renderGroupList(sorted);
    }

    if (layerId === 'LANDSCAPE_INVENTORY_ITEM') {
      return this.renderInventoryItemsLandscapeList(sorted, zones);
    }

    return this.renderSimpleList(sorted);
  }
}

AttachedPolygons.propTypes = {
  onLayerItemClick: PropTypes.func.isRequired,
  onLayerItemMouseOver: PropTypes.func.isRequired,
  onLayerItemMouseLeave: PropTypes.func.isRequired,
  reorderFeatures: PropTypes.func.isRequired, // eslint-disable-line
  layer: PropTypes.object,
  layerId: PropTypes.string,
  features: PropTypes.array,
  readOnly: PropTypes.bool,
  isCondition: PropTypes.bool,
  zones: PropTypes.array,
  // togglePciRange: PropTypes.func,
};

export default AttachedPolygons;
