import React from 'react';
import PropTypes from 'prop-types';
import { Marker } from 'react-leaflet';
import Modal from 'react-modal';
import L from 'leaflet';

import SitePhotoDetail from '../../SitePhotoDetail/Shared';

import './style.css';

import {
  greyIcon,
  blueIcon,
  greenIcon,
  orangeIcon,
  purpleIcon,
  redIcon,
  yellowIcon,
} from '../../../../app/common/marker';
class PhotoMarkerComponent extends React.Component {
  state = {
    isModalOpen: false,
    photoId: '',
  };

  getMarkerIcon = () => {
    const { url = '', defected = false, repair } = this.props;
    const lowerUrl = url.toLowerCase();

    if (repair) {
      return redIcon;
    } else if (defected) {
      return yellowIcon;
    } else if (lowerUrl.indexOf('/ortho') >= 0 || lowerUrl.indexOf('/map') >= 0) {
      return greenIcon;
    } else if (lowerUrl.indexOf('/low') >= 0) {
      return blueIcon;
    } else if (lowerUrl.indexOf('/trailer') >= 0) {
      return orangeIcon;
    } else if (lowerUrl.indexOf('/thermal') >= 0) {
      return purpleIcon;
    }

    return greyIcon;
  };

  openModal = () => {
    this.setState({ isModalOpen: true });
  };

  closeModal = () => {
    this.setState({ isModalOpen: false, photoId: '' });
  };

  updatePhotoId = (photoId) => photoId && this.state.isModalOpen && this.setState({ photoId });

  renderModal = () => {
    const {
      title,
      route,
      areaId,
      photoId,
      toggleAreaPhotoDefected,
      setAreaPhotoDefectedType,
      setAreaPhotoDefectedSeverity,
      toggleAreaPhotoRepair,
      setAreaPhotoRepairName,
      repairs,
      isOrthoLoading,
      siteOrtho,

      addAreaPhotoRepair,
      deleteAreaPhotoRepair,
      getAreaPhotoRepairs,
      areaPhotoRepairs,
    } = this.props;
    const {
      isModalOpen,
      photoId: currentPhotoId,
    } = this.state;
    return isModalOpen && (
      <Modal
        isOpen={isModalOpen}
        onAfterOpen={this.afterOpenModal}
        onRequestClose={this.closeModal}
        contentLabel={title}
        shouldCloseOnOverlayClick
        className="map-photo-marker-modal"
        overlayClassName="map-photo-marker-overlay"
      >
        <button className="close-button" onClick={this.closeModal}>&times;</button>
        <SitePhotoDetail
          route={route}
          areaId={areaId}
          photoId={currentPhotoId || photoId}
          updatePhotoId={isModalOpen ? this.updatePhotoId : undefined}
          closeModal={this.closeModal}

          toggleAreaPhotoDefected={toggleAreaPhotoDefected}
          setAreaPhotoDefectedType={setAreaPhotoDefectedType}
          setAreaPhotoDefectedSeverity={setAreaPhotoDefectedSeverity}
          toggleAreaPhotoRepair={toggleAreaPhotoRepair}
          setAreaPhotoRepairName={setAreaPhotoRepairName}

          addAreaPhotoRepair={addAreaPhotoRepair}
          deleteAreaPhotoRepair={deleteAreaPhotoRepair}
          getAreaPhotoRepairs={getAreaPhotoRepairs}
          areaPhotoRepairs={areaPhotoRepairs}

          repairs={repairs}
          isStatic
          isOrthoLoading={isOrthoLoading}
          siteOrtho={siteOrtho}
        />
      </Modal>
    );
  }

  renderIcon = () => {
    const iconUrl = this.getMarkerIcon();

    return L.icon({
      iconUrl,
      fillColor: '#A3C990',
      shadowUrl: false,
      iconSize: [20, 30],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
    });
  };

  render() {
    const { position, photoId } = this.props;

    if (position && position[0] && position[1]) {
      return (
        <React.Fragment>
          <Marker key={photoId} position={position} icon={this.renderIcon()} onClick={this.openModal} />
          { this.renderModal() }
        </React.Fragment>
      );
    }

    return null;
  }
}

PhotoMarkerComponent.propTypes = {
  url: PropTypes.string,
  repair: PropTypes.bool,
  areaId: PropTypes.string.isRequired,
  photoId: PropTypes.string.isRequired,
  position: PropTypes.array.isRequired,
  title: PropTypes.string,
  route: PropTypes.any,
  defected: PropTypes.bool.isRequired,
  toggleAreaPhotoDefected: PropTypes.func.isRequired,
  setAreaPhotoDefectedType: PropTypes.func.isRequired,
  toggleAreaPhotoRepair: PropTypes.func.isRequired,
  setAreaPhotoRepairName: PropTypes.func.isRequired,
  setAreaPhotoDefectedSeverity: PropTypes.func.isRequired,
  repairs: PropTypes.array,
  isOrthoLoading: PropTypes.bool,
  siteOrtho: PropTypes.object,

  addAreaPhotoRepair: PropTypes.func,
  deleteAreaPhotoRepair: PropTypes.func,
  getAreaPhotoRepairs: PropTypes.func,
  areaPhotoRepairs: PropTypes.array,
};

export default PhotoMarkerComponent;
