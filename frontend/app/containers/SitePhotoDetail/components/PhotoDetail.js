import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Select from 'react-select';
import { values, rangeRight } from 'lodash';
import Immutable from 'immutable';
import { TileLayer } from 'react-leaflet';
import { Link } from 'react-router-dom';

import { updateUrlParameter } from '../../../utils/common';
import { PHOTO_ZOOM_LEVEL } from '../../../constants';
import Carousel from './Carousel';
import MainImage from './MainImage';
import MiniMap from './MiniMap';
import SeveritySelect from './SeveritySelect';
import {
  BackButton,
  MetadataInfo,
  MapContainer,

  Controls,
  Toggles,

  DefectControls,
  DefectControlsHead,
  DefectControlsBody,

  RepairControls,
  RepairControlsSelect,

  RepairControlsList,
  RepairControlsListEmpty,
  RepairControlsItem,
  RepairControlsItemTitle,
  RepairControlsItemMeta,
  RepairControlsItemZone,
  RepairControlsItemYear,
  RepairControlsItemRemoveButton,

  PhotoBar,
  PhotoBarTitle,
  PhotoBarLabel,

  PhotoBarRow,
  PhotoBarBlock,
  PhotoBarDate,
  PhotoBarZone,
  PhotoBarDrone,
  TogglesActions,

  PhotoContainer,
  PhotosContainer,
  PhotoView,

  StyledSelect,
} from './StyledComponents';
import './styles.css';
import RepairNameSelect from './RepairNameSelect';

const initialState = {
  zoomLevel: 1,
  mouse: {},
  miniMapZoomLevel: 20,
};

class PhotoDetail extends React.Component {
  constructor(props) {
    super(props);

    this.state = initialState;
  }

  componentDidMount() {
    const { siteId, areaId, token } = this.getParams();
    const query = token ? `token=${token}` : '';
    const {
      getTemplate,
      changeAreaId,
      getSiteAreas,
      repairs,
      getRepairs,
      siteRepairs,
      getSiteRepairs,
    } = this.props;

    getTemplate(siteId, query);

    getSiteAreas(siteId);
    changeAreaId({ siteId, areaId, token });

    if (!repairs) {
      getRepairs();
    }

    if (!siteRepairs) {
      getSiteRepairs({ siteId });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.route.location !== this.props.route.location || nextProps.areaDetail.photos) {
      const { photoId } = nextProps.route.match.params;
      const photoDetail = nextProps.areaDetail.photos.find((item) => item.id === photoId);

      if (photoDetail && this.props.parentCallback) {
        this.props.parentCallback({ navTitle: photoDetail.title });
      }
    }
  }

  componentWillUnmount() {
    this.setState(initialState);
  }

  onPhotoZoom = (type) => () => {
    if (this.state.zoomLevel <= PHOTO_ZOOM_LEVEL.MAX && this.state.zoomLevel >= PHOTO_ZOOM_LEVEL.MIN) {
      this.setState({ zoomLevel: type === 'in' ? this.state.zoomLevel + 2 : this.state.zoomLevel - 2 });
    }
  };

  onDefected = (defected) => {
    const { photoId, siteId, areaId } = this.getParams();

    const params = {
      photoId,
      siteId,
      areaId,
      defected,
    };

    const payload = this.props.areaDetail;

    this.props.toggleAreaPhotoDefected({ params, payload });
  };

  onDefectedTypeSelect = (data) => {
    const { photoId, siteId, areaId } = this.getParams();
    const { areaDetail: payload } = this.props;

    const { id: repairId } = data || { id: null };
    const params = {
      photoId,
      siteId,
      areaId,
      repairId,
    };

    this.props.setAreaPhotoDefectedType({ params, payload });
  };

  onDefectChange = () => {
    const { photoId } = this.getParams();
    const { photos = [] } = this.props.areaDetail;
    const currentPhotoIndex = photos.map((item) => item.id).indexOf(photoId);
    const photoDetail = photos && photos[currentPhotoIndex];

    this.onDefected(!photoDetail.defected);
  };

  onSetSeverity = (level) => {
    const { photoId, siteId, areaId } = this.getParams();

    const params = {
      photoId,
      siteId,
      areaId,
      severity: level,
    };

    const payload = this.props.areaDetail;

    this.props.setAreaPhotoDefectedSeverity({ params, payload });
  };

  onCheckRepair = (repair) => {
    const { photoId, siteId, areaId } = this.getParams();

    const params = {
      photoId,
      siteId,
      areaId,
      repair,
    };

    const payload = this.props.areaDetail;
    this.props.toggleAreaPhotoRepair({ params, payload });
  };

  onMiniMapZoom = (miniMapZoomLevel) => {
    this.setState({
      miniMapZoomLevel,
    });
  };

  getParams = () => {
    const { photoId, siteId, token, areaId } = this.props.route.match.params;
    return {
      token,
      siteId,
      photoId: photoId || this.props.photoId,
      areaId: areaId || this.props.areaId,
    };
  };

  getPhotoByZoomLevel = (url, quality) => updateUrlParameter(url, 'q', quality);

  getPlaceholderPhoto = (photoDetail, zoomLevel) => {
    const placeholderQuality = zoomLevel * 10;
    return this.getPhotoByZoomLevel(photoDetail.url, placeholderQuality);
  };

  setRepairName = (repairName) => {
    const { photoId, siteId, areaId } = this.getParams();
    const repair = this.props.siteRepairs.find((i) => i.id === repairName);
    const params = {
      photoId,
      siteId,
      areaId,
      repairName,
      repairId: repairName,
    };

    const payload = this.props.areaDetail;
    this.props.setAreaPhotoRepairName({ params, payload });

    if (repair && repair.title) {
      this.props.addAreaPhotoRepair({
        ...params,
        repairName: repair.title,
      });
    }
  };

  getRepairById = (repairId) => {
    const { siteRepairs = [] } = this.props;
    const repair = siteRepairs.find((i) => i.id === repairId);
    return repair;
  }

  deleteRepair = (repairId) => () => {
    const { photoId } = this.getParams();
    this.props.deleteAreaPhotoRepair(photoId, repairId);
  };

  panTo = () => {
    const { closeModal } = this.props;
    if (closeModal && typeof closeModal === 'function') {
      closeModal();
    }
  }

  createSiteRepairOptions = () => {
    const { siteRepairs } = this.props;
    if (siteRepairs) {
      return siteRepairs.sort((first, secondOption) =>
          parseInt(first.year || '0', 10) - parseInt(secondOption.year || '0', 10)
        )
        .map(({ id, title, year, zone }) => ({
          value: id,
          label: title,
          display: { id, title, year, zone },
        })
      );
    }

    return [];
  };

  reloadData = () => {
    const { token = '', areaId, siteId } = this.getParams();
    const { areas: { photoAreas }, changeAreaId } = this.props;

    let type = '';

    if (photoAreas && photoAreas.length > 0) {
      const typeMedia = photoAreas.find((photoArea) => photoArea.id === areaId);
      if (typeMedia) {
        type = typeMedia.type;
      }
    }

    changeAreaId({ siteId, areaId, type, token });
  };

  renderDefectedTypeSelect = (photoDetail) => {
    const { repairs } = this.props;

    return (
      <StyledSelect>
        {!repairs && 'Loading..'}
        {repairs && (
          <Select
            id="photoRepairId"
            name="photoRepairId"
            placeholder="Select Repair"
            value={photoDetail.repairId || ''}
            options={repairs}
            labelKey="title"
            valueKey="id"
            onChange={this.onDefectedTypeSelect}
          />
        )}
      </StyledSelect>
    );
  };

  renderSeveritySelection = (photoDetail) => (
    <MetadataInfo>
      <SeveritySelect
        severity={photoDetail.severity}
        onSetSeverity={this.onSetSeverity}
      />
    </MetadataInfo>
  );

  renderRepairItem = (areaPhotoRepair) => {
    const { repairId } = areaPhotoRepair;
    const repair = this.getRepairById(repairId);

    if (!repair) return null;

    const { zone, year, title } = repair;

    return (
      <RepairControlsItem key={repairId} className="grayscale active">
        <RepairControlsItemTitle>
          {title}
        </RepairControlsItemTitle>
        <RepairControlsItemMeta>
          <RepairControlsItemZone>Zone: {zone}</RepairControlsItemZone>
          <RepairControlsItemYear>Year: {year}</RepairControlsItemYear>
        </RepairControlsItemMeta>
        <RepairControlsItemRemoveButton onClick={this.deleteRepair(repairId)}>
          &times;
        </RepairControlsItemRemoveButton>
      </RepairControlsItem>
    );
  };

  renderRepairControls = (photoDetail) => {
    const siteRepairOptions = this.createSiteRepairOptions();
    const { areaPhotoRepairs = [] } = this.props;

    const hasRepairs = areaPhotoRepairs.length > 0;

    const repairList = areaPhotoRepairs.map((areaPhotoRepair) =>
      this.renderRepairItem(areaPhotoRepair)
    );

    return (
      <RepairControls>
        <RepairControlsSelect className={`${hasRepairs ? 'active' : ''}`}>
          <RepairNameSelect
            options={siteRepairOptions}
            value={photoDetail.repairName}
            setRepairName={this.setRepairName}
            setCheckRepair={this.onCheckRepair}
          />
        </RepairControlsSelect>
        <RepairControlsList>
          {!hasRepairs && (
            <RepairControlsListEmpty>
              No repairs selected
            </RepairControlsListEmpty>
          )}
          {hasRepairs && repairList}
        </RepairControlsList>
      </RepairControls>
    );
  };

  renderDefectControls = (photoDetail) => (
    <DefectControls>
      <DefectControlsHead onClick={this.onDefectChange} className={`${photoDetail.defected ? 'active' : ''}`}>
        <span>Defect</span>
        <span className={`checkbox ${photoDetail.defected ? 'active' : ''}`}>
          {!photoDetail.defected && <span>OFF</span>}
          {photoDetail.defected && <span>ON</span>}
        </span>
      </DefectControlsHead>
      {photoDetail.defected && (
        <DefectControlsBody>
          { this.renderDefectedTypeSelect(photoDetail) }
          { this.renderSeveritySelection(photoDetail) }
        </DefectControlsBody>
      )}
    </DefectControls>
  )

  renderOrthomosaic = () => {
    const { isOrthoLoading, siteOrtho } = this.props;

    if (isOrthoLoading || !siteOrtho) return '';

    const { template } = siteOrtho;
    return template && (
      <TileLayer
        url={template}
        maxZoom={26}
        maxNativeZoom={23}
        tileSize={256}
        detectRetina
      />
    );
  };

  renderMap = (photoDetail) => {
    const { miniMapZoomLevel } = this.state;
    const { photoId, siteId, areaId } = this.getParams();
    const centerMap =
      photoDetail && photoDetail.location && photoDetail.location.lat && photoDetail.location.lng
        ? values(photoDetail.location)
        : [];

    const siteMapUrl = `/sites/${siteId}/map?pin=1&lat=${photoDetail.location.lat}&lng=${photoDetail.location.lng}&areaId=${areaId}`;

    return (
      <Toggles>
        <MapContainer>
          {
            centerMap &&
            centerMap.length > 0 &&
            <MiniMap
              center={centerMap}
              marker={{ position: centerMap, id: photoId }}
              zoom={miniMapZoomLevel}
              onMiniMapZoom={this.onMiniMapZoom}
            >
              { this.renderOrthomosaic() }
            </MiniMap>
          }
        </MapContainer>
        <TogglesActions>
          <a href={photoDetail.originalUrl} download onClick={() => false}>
            Download
          </a>
          <Link to={siteMapUrl} onClick={this.panTo}>
            Pan to
          </Link>
        </TogglesActions>
      </Toggles>
    );
  };

  renderPhotoBar() {
    const { areaDetail, isStatic } = this.props;
    const { siteId, token, photoId } = this.getParams();
    const { photos = [] } = areaDetail;
    const currentPhotoIndex = photos.map((item) => item.id).indexOf(photoId);
    const photoDetail = photos && photos[currentPhotoIndex];

    const sharedAreasUrl = `/shared/${siteId}/media/${token}`;
    const authAreasUrl = `/sites/${siteId}/media`;

    return (
      <PhotoBar>
        <PhotoBarRow>
          <PhotoBarBlock>
            {!token && !isStatic && (
              <BackButton to={token ? sharedAreasUrl : authAreasUrl} onClick={this.reloadData}>
                <i className="fa fa-angle-left" />Areas
              </BackButton>
            )}
            <PhotoBarTitle>
              {photoDetail.title}
            </PhotoBarTitle>
            <PhotoBarDate>
              <PhotoBarLabel>
                Captured
              </PhotoBarLabel>
              {moment(photoDetail.taken).format('MMMM D, YYYY h:mm A')}
            </PhotoBarDate>
            <PhotoBarZone>
              <PhotoBarLabel>
                Zone
              </PhotoBarLabel>
              {photoDetail.zone}
            </PhotoBarZone>
            <PhotoBarDrone>
              <PhotoBarLabel>
                Drone
              </PhotoBarLabel>
              {photoDetail.droneMake} {photoDetail.droneModel}
            </PhotoBarDrone>
          </PhotoBarBlock>
        </PhotoBarRow>
      </PhotoBar>
    );
  }

  renderControls = (photoDetail) => {
    const { token } = this.getParams();

    if (token) return null;

    return (
      <Controls>
        {this.renderDefectControls(photoDetail)}
        {this.renderRepairControls(photoDetail)}
      </Controls>
    );
  };

  render() {
    const { zoomLevel, mouse } = this.state;
    const {
      isLoading,
      isStatic,
      areaDetail,
      getAnnotations,
      createAnnotation,
      annotations,
      updateAnnotation,
      deleteAnnotation,
      isAnnotationLoading,
     } = this.props;
    const { photoId, siteId, areaId, token } = this.getParams();
    const { photos = [] } = areaDetail;
    const currentPhotoIndex = photos.map((item) => item.id).indexOf(photoId);
    const photoDetail = photos && photos[currentPhotoIndex];
    const nextPhotoId =
      currentPhotoIndex < photos.length - 1
        ? photos[currentPhotoIndex + 1].id
        : (photos.length && photos[0].id) || null;
    const prevPhotoId =
      currentPhotoIndex > 0
        ? photos[currentPhotoIndex - 1].id
        : (photos.length && photos[photos.length - 1].id) || null;

    const imagesUrl = photoDetail
      ? rangeRight(0, zoomLevel + 2, 2).map(
        (level) => (level === 0 ? photoDetail.thumbnailUrl : this.getPlaceholderPhoto(photoDetail, level))
      )
      : [];

    const backgroundImageUrls = imagesUrl.map((imageUrl) => `url(${imageUrl})`);

    return !isLoading && photoDetail ? (
      <PhotosContainer className={isStatic && 'is-static'}>
        {this.renderPhotoBar()}
        {this.renderControls(photoDetail)}
        {this.renderMap(photoDetail)}
        <PhotoContainer>
          <PhotoView id="PhotoView">
            <MainImage
              isStatic={isStatic}
              siteId={siteId}
              areaId={areaId}
              repairId={photoDetail.repairId}
              repairName={photoDetail.repairName}
              photoId={photoDetail.id}
              placeholderImageSrc={photoDetail.thumbnailUrl}
              originalSrc={photoDetail.originalUrl}
              imageSrc={photoDetail.url}
              imagesSrc={backgroundImageUrls}
              alt={photoDetail.title}
              className="mainPhoto"
              zoom={zoomLevel}
              id="mainImage"
              key={photoDetail.url}
              mouse={mouse}
              getAnnotations={getAnnotations}
              createAnnotation={createAnnotation}
              updateAnnotation={updateAnnotation}
              deleteAnnotation={deleteAnnotation}
              annotations={annotations}
              isAnnotationLoading={isAnnotationLoading}
            />
            <Carousel
              getAreaPhotoRepairs={this.props.getAreaPhotoRepairs}
              updatePhotoId={this.props.updatePhotoId}
              isStatic={isStatic}
              photos={photos}
              siteId={siteId}
              areaId={areaId}
              areaDetail={areaDetail}
              photoId={photoDetail.id}
              token={token}
              isShared={!!token}
              currentPhotoIndex={currentPhotoIndex}
              prevPhotoId={prevPhotoId}
              nextPhotoId={nextPhotoId}
              zoomLevel={zoomLevel}
              onPhotoZoom={this.onPhotoZoom}
            />
          </PhotoView>
        </PhotoContainer>
      </PhotosContainer>
    ) : null;
  }
}

PhotoDetail.propTypes = {
  isStatic: PropTypes.bool,
  isLoading: PropTypes.bool,
  toggleAreaPhotoDefected: PropTypes.func,
  setAreaPhotoDefectedType: PropTypes.func,
  setAreaPhotoDefectedSeverity: PropTypes.func,
  toggleAreaPhotoRepair: PropTypes.func,
  setAreaPhotoRepairName: PropTypes.func,
  updatePhotoId: PropTypes.func,
  closeModal: PropTypes.func,

  photoId: PropTypes.string,
  areaId: PropTypes.string,
  repairs: PropTypes.array,
  areaDetail: PropTypes.object,
  route: PropTypes.any,
  parentCallback: PropTypes.func,
  changeAreaId: PropTypes.func,
  getRepairs: PropTypes.func,
  siteRepairs: PropTypes.array,
  getSiteRepairs: PropTypes.func,
  getSiteAreas: PropTypes.func,
  areas: PropTypes.oneOfType([PropTypes.instanceOf(Array), PropTypes.instanceOf(Immutable.Iterable), PropTypes.object]),
  getAnnotations: PropTypes.func,
  createAnnotation: PropTypes.func,
  annotations: PropTypes.PropTypes.oneOfType([PropTypes.instanceOf(Array), PropTypes.instanceOf(Immutable.Iterable), PropTypes.object]),
  updateAnnotation: PropTypes.func,
  deleteAnnotation: PropTypes.func,
  isAnnotationLoading: PropTypes.bool,
  getTemplate: PropTypes.func,
  isOrthoLoading: PropTypes.bool,
  siteOrtho: PropTypes.object,

  addAreaPhotoRepair: PropTypes.func,
  deleteAreaPhotoRepair: PropTypes.func,
  getAreaPhotoRepairs: PropTypes.func,
  areaPhotoRepairs: PropTypes.array,
};

PhotoDetail.defaultProps = {
  isStatic: false,
  isLoading: true,
  areaDetail: {},
  siteOrtho: {},
};

export default PhotoDetail;
