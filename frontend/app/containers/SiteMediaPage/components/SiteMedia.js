import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { compact, concat, isBoolean, find, get } from 'lodash';

import Button from '../../../components/Button';
import HeaderTitle from '../../../components/Title/HeaderTitle';
import Pagination from '../../../components/Pagination';
import AreaList from './AreaList';
import {
  PhotosContainer,
  Areas,
  AreasHeader,
  Header,
  RepairsToggleButton,
  Photos,
} from './StyledComponent';
import LoadingIndicator from '../../../components/LoadingIndicator';
import MediaList from './MediaList';
import AreaVideosModal from '../../AreaVideos';
import { exportZipFile } from '../../../utils/files/fileUtils';
import { DELETE_AREA_CONFIRMATION_MESSAGE } from '../constants';
import './styles.css';

const getText = (total, type) => {
  let text = '';

  if (type === 'Video') {
    text = total > 0 ? 'videos' : 'video';
  } else {
    text = total > 0 ? 'images' : 'image';
  }

  return `${total} ${text}`;
};

class SiteMedia extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageSize: 20,
      page: 1,
      withRepairs: false,
      videoId: null,
      isModalOpen: false,
      areaId: null,
      type: null,
    };
  }

  setDeletedAreaPhoto = (siteId, areaId, photoId, isDeleted) => {
    this.props.setDeletedAreaPhoto({ siteId, areaId, photoId, isDeleted });
  };

  getRepairTitle = (repairId) => {
    const { repairs = [] } = this.props;
    const item = repairs.filter((i) => i.id === repairId)[0];
    return (item && item.title) || 'Marked for repair';
  };

  closeModal = () => {
    this.setState({ isModalOpen: false, videoArea: null });
  };

  pageChanged = (data) => {
    const { siteId = '', token = '' } = this.props.route.match.params;
    const selected = data.selected + 1;
    this.setState({ page: selected }, () => {
      const { page, pageSize, type } = this.state;
      const areaId = this.state.areaId ? this.state.areaId : this.props.areaDetail.id;
      this.props.changeAreaId({ siteId, areaId, type, token, page, pageSize });
    });
  };

  toggleWithRepairsView = () => {
    this.setState((prevState) => ({ withRepairs: !prevState.withRepairs }));
  };

  selectAreaHandler = (siteId) => (areaId, type, isDeleted) => {
    if (isBoolean(isDeleted)) {
      const isConfirmed = window.confirm(DELETE_AREA_CONFIRMATION_MESSAGE); // eslint-disable-line
      if (isConfirmed) {
        this.props.setDeletedAreaPhotos({ siteId, areaId, isDeleted });
      }
    } else {
      const { token = '' } = this.props.route.match.params;
      this.setState({ areaId, type, page: 1 }, () => {
        const { page, pageSize } = this.state;
        this.props.changeAreaId({ siteId, areaId, type, token, page, pageSize });
      });
    }
  }

  openAreaVideos = (videoArea, videoId = null) => {
    this.setState({ videoArea, isModalOpen: true, videoId });
  };

  isShow = (area) => {
    if (['repair', 'defected'].indexOf(area.title) >= 0 && area.imagesCount === 0) return false;
    return true;
  };

  renderAreasPanel = () => {
    const { siteId = '' } = this.props.route.match.params;
    const { areaDetail = {}, areas = { photoAreas: [], videoAreas: [] }, isShared } = this.props;
    const areasPhoto = areas.photoAreas ? areas.photoAreas.filter((area) => this.isShow(area)) : [];
    const allAreas = compact(concat(areasPhoto, areas.videoAreas));
    return (
      <Areas>
        <AreasHeader>Select Area</AreasHeader>
        <AreaList
          data={allAreas}
          currentAreaId={areaDetail.id}
          selectArea={this.selectAreaHandler(siteId)}
          isShared={isShared}
        />
      </Areas>
    );
  };

  renderAreaMedia = () => {
    const { siteId = '', token = '' } = this.props.route.match.params;
    const { areaDetail = {}, isShared, isAreaLoading, areas } = this.props;
    const { photos: mediaItems = [], id: areaId, imagesCount } = areaDetail;
    const { pageSize } = this.state;
    const filteredMediaItems = this.state.withRepairs ? mediaItems.filter((p) => !!p.defected) : mediaItems;
    const totalPages = filteredMediaItems ? Math.ceil(imagesCount / pageSize) : 0;
    const paginatedMediaItems = filteredMediaItems.slice(0, pageSize);
    const handleExport = () => {
      const downloadableItems = mediaItems.map((item) => ({ url: item.originalUrl, title: item.title }));
      exportZipFile(downloadableItems, areaDetail.title);
    };
    // clear layout when delete area success
    const photoAreas = get(areas, 'photoAreas', []) || [];
    const targetArea = find(photoAreas, (photoArea) => photoArea.id === areaId);
    const deleted = get(targetArea, 'deleted', false);
    const requesting = get(targetArea, 'requesting', false);
    const isShowContent = !deleted && !requesting;
    const isShowLoadingIcon = requesting || isAreaLoading;
    const isShowPaging = totalPages > 1;

    return isShowContent ? (
      <Photos>
        {
          filteredMediaItems && (
            <div>
              <Header>
                <HeaderTitle title={areaDetail.title} subtitle={getText(filteredMediaItems.length, areaDetail.type)} />
                {!isShared &&
                  (<RepairsToggleButton onClick={this.toggleWithRepairsView}>
                    {this.state.withRepairs ? 'Show All' : 'Show defected'}
                  </RepairsToggleButton>)
                }
                <Button color="secondary" label="Export as Zip" onClick={handleExport} />
              </Header>
              {
                isShowLoadingIcon ?
                  <LoadingIndicator /> :
                  <MediaList
                    type={areaDetail.type}
                    mediaItems={paginatedMediaItems}
                    siteId={siteId}
                    areaId={areaId}
                    isShared={isShared}
                    token={token}
                    getRepairTitle={this.getRepairTitle}
                    openAreaVideos={this.openAreaVideos}
                    setDeletedAreaPhoto={this.setDeletedAreaPhoto}
                  />
              }
              {
                isShowPaging && (
                  <div className="photoPaginate">
                    <Pagination
                      totalPages={totalPages}
                      pageChanged={this.pageChanged}
                      forcePage={this.state.page - 1}
                    />
                  </div>
                )}
            </div>
          )}
      </Photos>
    ) : null;
  };

  renderAreaVideoModal = () => {
    const { siteId = '', token = '' } = this.props.route.match.params;
    const { videoId, isModalOpen } = this.state;
    const { id: videoArea } = this.props.areaDetail;

    return (
      <AreaVideosModal
        isModalOpen={isModalOpen}
        siteId={siteId}
        videoArea={videoArea}
        videoId={videoId}
        closeModal={this.closeModal}
        token={token}
      />
    );
  };

  render() {
    const { isLoading, isShared } = this.props;
    const className = ` ${isShared && 'full'}`;

    return isLoading ? <LoadingIndicator /> : (
      <PhotosContainer className={className}>
        { this.renderAreasPanel() }
        { this.renderAreaMedia() }
        { this.renderAreaVideoModal() }
      </PhotosContainer>
    );
  }
}

SiteMedia.defaultProps = {
  isShared: false,
};

SiteMedia.propTypes = {
  route: PropTypes.any,
  repairs: PropTypes.array,
  areas: PropTypes.oneOfType([PropTypes.instanceOf(Array), PropTypes.instanceOf(Immutable.Iterable), PropTypes.object]),
  areaDetail: PropTypes.object,
  isLoading: PropTypes.bool,
  isAreaLoading: PropTypes.bool,
  isShared: PropTypes.bool,
  changeAreaId: PropTypes.func,
  setDeletedAreaPhoto: PropTypes.func,
  setDeletedAreaPhotos: PropTypes.func,
};

export default SiteMedia;
