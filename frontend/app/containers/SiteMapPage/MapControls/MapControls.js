import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { SortableContainer, SortableHandle, SortableElement, arrayMove } from 'react-sortable-hoc';
import { push as Menu } from 'react-burger-menu';

import PlayIcon from '../../../images/icons/play_small.svg';
import PavementIcon from '../../../images/icons/section_title_pavement.png';

import { makeSelectIsSideBarMapOpen } from '../../../appSelector/UI';

import { RoofingControls, HvacControls, LandscapeControls } from './Controls';

import {
  Wrapper,
  DraggableItemWrapper,
  StyledDragHandle,

  Header,
  HeaderItem,
  HeaderItemIndicator,
  Body,
  Section,
  SectionLoader,
  SectionList,
  SectionIcon,
  SectionTitle,
  Item,
  ItemHeader,
  Actions,
  ItemLabel,
  NewItemButton,
  ImportButton,
  SyncButton,
} from './elements';

import Changes from './Changes';
import MeasurementLayer from './MeasurementLayer';
import ConditionLayer from './ConditionLayer';
import { MEASUREMENT_LAYER_PAVEMENT, LANDSCAPING_NAME, ROOFING_NAME, PAVEMENT_NAME, HVAC_NAME } from '../constants';
import AttachedPolygons from './AttachedPolygons';

const DragHandle = SortableHandle(() => <StyledDragHandle><span /></StyledDragHandle>);

const SortableItem = SortableElement(({ value, readOnly }) => (
  <DraggableItemWrapper>
    {!readOnly && <DragHandle />}
    {value}
  </DraggableItemWrapper>
));

const SortableList = SortableContainer(({ items, polygons, readOnly }) => (
  <SectionList>
    {items.map((value, index) => value && (
      <SortableItem
        key={`item-${index}`} // eslint-disable-line
        index={index}
        value={value}
        readOnly={readOnly}
      />
    ))}
    {polygons}
  </SectionList>
));

class MapControlsComponent extends React.Component {
  state = {
    isPropertyMapCollapsed: true,
    isSourceImagesCollapsed: true,
    isMeasurementLayersCollapsed: true,
    isConditionLayersCollapsed: true,

    isHvacInventoryItemsCollapsed: false,

    isLandscapeInventoryItemsCollapsed: false,
    isLandscapeMeasurementLayersCollapsed: false,

    isRoofingMeasurementLayersCollapsed: false,
  };

  componentWillMount() {
    const controlsStateRestored = window.localStorage.getItem('mapControlsState');
    const controlsStateParsed = JSON.parse(controlsStateRestored);

    const restored = window.localStorage.getItem('mapControlsCollapseState');
    const parsed = JSON.parse(restored);

    if (!isEmpty(parsed) && !isEmpty(controlsStateParsed)) {
      this.setState({
        showPavement: controlsStateParsed.showPavement,
        showHVAC: controlsStateParsed.showHVAC,
        showLandscape: controlsStateParsed.showLandscape,
        showRoofing: controlsStateParsed.showRoofing,
        isPropertyMapCollapsed: parsed.isPropertyMapCollapsed,
        isSourceImagesCollapsed: parsed.isSourceImagesCollapsed,
        isMeasurementLayersCollapsed: parsed.isMeasurementLayersCollapsed,
        isConditionLayersCollapsed: parsed.isConditionLayersCollapsed,
      });
    }
  }

  componentWillUnmount() {
    window.localStorage.setItem('mapControlsCollapseState', JSON.stringify(this.state));
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    const layers = this.props.layers.data;
    const reordered = arrayMove(layers, oldIndex, newIndex);
    const reorderedLayers = reordered.map((layer, index) => ({
      ...layer,
      index,
    }));

    this.props.reorderLayers({ reordered: reorderedLayers });
  };

  toggleSection = (sectionName) => () => {
    const newState = {};
    newState[sectionName] = !this.state[sectionName];
    this.setState(newState);
  };

  toggleItem = (sectionItemName, checked, type) => () => {
    const { onChangeSectionItem } = this.props;
    onChangeSectionItem({ id: sectionItemName, type }, checked);
  }

  toggleRenderItem = (area, checked) => () => {
    const { onChangeSectionItem } = this.props;
    onChangeSectionItem({ id: area.id, type: 'Area' }, checked);
  };

  openVideo = (area) => () => {
    this.props.onChangeSectionItem({ id: area.id, type: 'VideoArea', areaName: area.areaName });
  };

  renderPhotoAreaItem = (area) => {
    const { selectedAreas } = this.props;
    const { title, id } = area;
    const isChecked = selectedAreas[id] || false;

    return (
      <Item key={id}>
        <ItemHeader>
          <SectionIcon
            show={isChecked}
            level={3}
            onClick={this.toggleRenderItem(area, !isChecked)}
          />
          <ItemLabel onClick={this.toggleRenderItem(area, !isChecked)}>{title}</ItemLabel>
        </ItemHeader>
      </Item>
    );
  };

  renderAreaList = () => {
    const { areas: { isLoading, data } } = this.props;

    if (isLoading) {
      return <SectionLoader>Fetching media…</SectionLoader>;
    }

    return (
      <SectionList>
        {data.photoAreas && data.photoAreas.map(this.renderPhotoAreaItem)}
        {data.videoAreas && data.videoAreas.map(this.renderVideoAreaItem)}
      </SectionList>
    );
  };

  renderVideoAreaItem = (area) => {
    const { areaName } = area;

    return (
      <Item key={areaName} >
        <ItemHeader onClick={this.openVideo(area)}>
          <PlayIcon width="12px" height="12px" style={{ marginRight: '2.9rem' }} />
          <ItemLabel htmlFor={areaName}>{areaName}</ItemLabel>
        </ItemHeader>
      </Item>
    );
  };

  renderLayer = (layer, index) => (
    <MeasurementLayer
      {...this.props}
      show={this.props.showPavement}
      reorderFeatures={this.props.reorderFeatures}
      features={this.props.features}
      layer={layer}
      index={index}
      key={index}
      type={MEASUREMENT_LAYER_PAVEMENT}
    />
  );

  renderConditionLayer = (layer, features) => (
    <ConditionLayer
      {...this.props}
      show={this.props.showPavement}
      layer={layer}
      togglePciRange={this.props.togglePciRange}
      features={features}
    />
  )

  renderConditionLayers = () => {
    const {
      layers: { isLoading },
      groupedPCIFeatures,
      readOnly,
      conditionLayerPCIMap,
    } = this.props;

    if (isLoading) {
      return <SectionLoader>Fetching layers…</SectionLoader>;
    }

    const items = [this.renderConditionLayer({ isActive: conditionLayerPCIMap.isActive, title: 'PCI Map' }, groupedPCIFeatures)];

    return (
      <SortableList
        items={items}
        onSortEnd={this.onSortEnd}
        useDragHandle={!readOnly}
        shouldCancelStart={() => readOnly}
        readOnly={readOnly}
      />
    );
  }

  renderLayers = () => {
    const {
      layers: { data = [], isLoading },
      features,
      readOnly,
      reorderFeatures,
      onLayerItemClick,
      onLayerItemMouseOver,
      onLayerItemMouseLeave,
    } = this.props;

    if (isLoading) {
      return <SectionLoader>Fetching layers…</SectionLoader>;
    }

    if (!isLoading && data.length === 0) {
      return <SectionLoader>No layers found.</SectionLoader>;
    }

    const items = data.map((layer, index) => this.renderLayer(layer, index));
    const layerless = features.data.filter((f) => {
      const isZoneDuplicate =
        f.title && f.title.includes('Zone') && f.title.includes('(duplicated)');
      return !f.layerId || isZoneDuplicate;
    });

    const polygons = layerless.length > 0 ? (
      <AttachedPolygons
        layerId={null}
        features={layerless}
        reorderFeatures={reorderFeatures}
        onLayerItemClick={onLayerItemClick}
        onLayerItemMouseOver={onLayerItemMouseOver}
        onLayerItemMouseLeave={onLayerItemMouseLeave}
        readOnly={readOnly}
      />
    ) : null;

    return (
      <SortableList
        items={items}
        polygons={polygons}
        onSortEnd={this.onSortEnd}
        useDragHandle={!readOnly}
        shouldCancelStart={() => readOnly}
        readOnly={readOnly}
      />
    );
  };

  renderLayersCount = () => {
    const { layers: { isLoading, data = [] } } = this.props;
    const count = (
      <span style={{ marginLeft: '0.4rem' }}>
        ({data.length})
      </span>
    );
    return isLoading ? null : count;
  }

  renderChanges() {
    const {
      changes,
      activeTab,
      loadMoreChanges,
      onLayerItemMouseOver,
    } = this.props;

    return (
      <Changes
        changes={changes}
        isActive={activeTab === 'changes'}
        loadMoreChanges={loadMoreChanges}
        onLayerItemMouseOver={onLayerItemMouseOver}
      />
    );
  }

  renderList() {
    const {
      isPropertyMapCollapsed,
      isSourceImagesCollapsed,
      isMeasurementLayersCollapsed,
      isConditionLayersCollapsed,

      isHvacInventoryItemsCollapsed,

      isLandscapeInventoryItemsCollapsed,
      isLandscapeMeasurementLayersCollapsed,

      isRoofingMeasurementLayersCollapsed,
    } = this.state;

    const {
      activeTab,
      showOrtho,
      readOnly,
      createLayer,
      handleShapesImport,

      showPavement,
      showHVAC,
      showLandscape,
      showRoofing,

      roofingMeasurementLayers,
      roofingMeasurementFeatures,
      hvacs,
      landscapeInventoryItems,
      landscapeMeasurementLayers,
      landscapeMeasurementFeatures,

      subNavigationItemSelected,
    } = this.props;

    return (
      <Body className={`layers ${activeTab === 'layers' && 'active'}`}>
        {!readOnly && (
          <Actions>
            <NewItemButton onClick={createLayer}>Add Layer</NewItemButton>
            <ImportButton>
              Import Shapes
              <input type="file" onChange={handleShapesImport} accept=".zip" />
            </ImportButton>
            <SyncButton onClick={this.props.resync}>
              Sync
            </SyncButton>
          </Actions>
        )}
        <Section>
          <SectionTitle
            onClick={this.toggleSection('isPropertyMapCollapsed')}
          >
            <SectionIcon
              isCollapsed={isPropertyMapCollapsed}
              level={2}
            />
            Property Map
          </SectionTitle>
          {
            isPropertyMapCollapsed && (
            <SectionList>
              <Item>
                <ItemHeader>
                  <SectionIcon
                    show={showOrtho}
                    level={3}
                    onClick={this.toggleItem('Orthomosaic', !showOrtho, 'Ortho')}
                  />
                  <ItemLabel onClick={this.toggleItem('Orthomosaic', !showOrtho, 'Ortho')}>
                    Orthomosaic
                  </ItemLabel>
                </ItemHeader>
              </Item>
            </SectionList>
            )
          }
        </Section>
        {(subNavigationItemSelected === PAVEMENT_NAME || subNavigationItemSelected === 'ALL') && (
          <Section>
            <SectionTitle
              onClick={this.toggleItem('Pavement', !showPavement, 'Pavement')}
              level={1}
            >
              <SectionIcon
                show={showPavement}
                isCollapsed={showPavement}
                level={1}
                icon={PavementIcon}
                onClick={this.toggleItem('Pavement', !showPavement, 'Pavement')}
              />
              PAVEMENT
            </SectionTitle>
            {showPavement && (
              <div>
                <Section>
                  <SectionTitle
                    onClick={this.toggleSection('isSourceImagesCollapsed')}
                  >
                    <SectionIcon
                      isCollapsed={isSourceImagesCollapsed}
                      level={2}
                    />
                    Media
                  </SectionTitle>
                  {isSourceImagesCollapsed && this.renderAreaList()}
                </Section>
                <Section>
                  <SectionTitle
                    onClick={this.toggleSection('isMeasurementLayersCollapsed')}
                  >
                    <SectionIcon
                      isCollapsed={isMeasurementLayersCollapsed}
                      level={2}
                    />
                    Measurement Layers
                    {this.renderLayersCount()}
                  </SectionTitle>
                  {isMeasurementLayersCollapsed && this.renderLayers()}
                </Section>
                {!readOnly && (
                  <Section>
                    <SectionTitle
                      onClick={this.toggleSection('isConditionLayersCollapsed')}
                    >
                      <SectionIcon
                        isCollapsed={isConditionLayersCollapsed}
                        level={2}
                      />
                      Condition Layers
                    </SectionTitle>
                    {isConditionLayersCollapsed && this.renderConditionLayers()}
                  </Section>
                )}
              </div>
            )}
          </Section>
        )}
        {(subNavigationItemSelected === HVAC_NAME || subNavigationItemSelected === 'ALL') && (
          <HvacControls
            showHVAC={showHVAC}
            toggleSection={this.toggleSection}
            toggleItem={this.toggleItem}
            readOnly={readOnly}
            hvacs={hvacs}
            isHvacInventoryItemsCollapsed={isHvacInventoryItemsCollapsed}
            isHvacCollapsed={showHVAC}
            renderAreaList={this.renderAreaList}
          />
        )}

        {(subNavigationItemSelected === ROOFING_NAME || subNavigationItemSelected === 'ALL') && (
          <RoofingControls
            {...this.props}
            layers={roofingMeasurementLayers}
            features={roofingMeasurementFeatures}
            showRoofing={showRoofing}
            isRoofingMeasurementLayersCollapsed={isRoofingMeasurementLayersCollapsed}
            toggleSection={this.toggleSection}
            toggleItem={this.toggleItem}
            isSourceImagesCollapsed={isSourceImagesCollapsed}
            readOnly={readOnly}
            SortableList={SortableList}
            renderAreaList={this.renderAreaList}
          />
        )}
        {(subNavigationItemSelected === LANDSCAPING_NAME || subNavigationItemSelected === 'ALL') && (
          <LandscapeControls
            {...this.props}
            layers={landscapeMeasurementLayers}
            features={landscapeMeasurementFeatures}
            showLandscape={showLandscape}
            toggleSection={this.toggleSection}
            toggleItem={this.toggleItem}
            readOnly={readOnly}
            isSourceImagesCollapsed={isSourceImagesCollapsed}
            landscapeInventoryItems={landscapeInventoryItems}
            isLandscapeInventoryItemsCollapsed={isLandscapeInventoryItemsCollapsed}
            isLandscapeMeasurementLayersCollapsed={isLandscapeMeasurementLayersCollapsed}
            isLandscapeCollapsed={showLandscape}
            SortableList={SortableList}
            renderAreaList={this.renderAreaList}
          />
        )}
      </Body>
    );
  }

  render() {
    const { activeTab, isSideBarOpen, readOnly } = this.props;

    return (
      <Menu
        noOverlay
        disableCloseOnEsc
        customCrossIcon={false}
        width={'250px'}
        isOpen={isSideBarOpen}
        pageWrapId="page-wrap"
        outerContainerId="outer-container"
        customBurgerIcon={false}
      >
        <Wrapper className="map-controls">
          <Header>
            {!readOnly && <HeaderItemIndicator className={activeTab === 'changes' && 'changes'} />}
            <HeaderItem
              onClick={this.props.switchTab('layers')}
              className={activeTab === 'layers' && 'active'}
            >
              Layers
            </HeaderItem>
            {!readOnly && (
              <HeaderItem
                onClick={this.props.switchTab('changes')}
                className={activeTab === 'changes' && 'active'}
              >
                Changes
              </HeaderItem>
            )}
          </Header>
          {this.renderList()}
          {!readOnly && this.renderChanges()}
        </Wrapper>
      </Menu>
    );
  }
}

MapControlsComponent.defaultProps = {
  readOnly: true,
};

MapControlsComponent.propTypes = {
  readOnly: PropTypes.bool,
  showOrtho: PropTypes.bool.isRequired,
  showPavement: PropTypes.bool.isRequired,
  showHVAC: PropTypes.bool.isRequired,
  showLandscape: PropTypes.bool.isRequired,
  showRoofing: PropTypes.bool.isRequired,

  changes: PropTypes.object.isRequired,
  layers: PropTypes.object.isRequired,
  features: PropTypes.object.isRequired,
  areas: PropTypes.object.isRequired,
  hvacs: PropTypes.object.isRequired,
  landscapeInventoryItems: PropTypes.object.isRequired,
  landscapeMeasurementLayers: PropTypes.object.isRequired,
  landscapeMeasurementFeatures: PropTypes.object.isRequired,
  roofingMeasurementLayers: PropTypes.object.isRequired,
  roofingMeasurementFeatures: PropTypes.object.isRequired,

  activeTab: PropTypes.string.isRequired,
  switchTab: PropTypes.func.isRequired,
  resync: PropTypes.func.isRequired,
  loadMoreChanges: PropTypes.func.isRequired,
  reorderLayers: PropTypes.func.isRequired,
  reorderFeatures: PropTypes.func.isRequired,
  onChangeSectionItem: PropTypes.func.isRequired,
  createLayer: PropTypes.func.isRequired,
  deleteLayer: PropTypes.func.isRequired, // eslint-disable-line
  handleShapesImport: PropTypes.func.isRequired,
  onLayerItemMouseOver: PropTypes.func.isRequired,
  onLayerItemClick: PropTypes.func.isRequired,
  onLayerItemMouseLeave: PropTypes.func.isRequired,

  selectedAreas: PropTypes.object.isRequired,

  isSideBarOpen: PropTypes.bool.isRequired,
  subNavigationItemSelected: PropTypes.string.isRequired,
  groupedPCIFeatures: PropTypes.object,
  conditionLayerPCIMap: PropTypes.object.isRequired,
  togglePciRange: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  isSideBarOpen: makeSelectIsSideBarMapOpen(),
});

export default connect(mapStateToProps)(MapControlsComponent);
