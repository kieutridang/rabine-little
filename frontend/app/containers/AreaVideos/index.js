/* eslint-disable jsx-a11y/media-has-caption */

import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import LoadingIndicator from 'components/LoadingIndicator';

import './style.css';
import VideoNavigator from './VideoNavigator';
import { actions } from '../../appReducer/video.reducer';
import { makeSelectAreaVideos, makeIsLoadingAreaVideos } from '../../appSelector/video.selector';

class AreaVideosModal extends React.Component {
  state = { isModalOpen: false, videoArea: '', videoId: null };

  componentWillReceiveProps(nextProps) {
    if (this.props.videoArea !== nextProps.videoArea) {
      const { siteId, getAreaVideos, token } = this.props;
      getAreaVideos(siteId, nextProps.videoArea, token);
    }

    if (this.props.videoId !== nextProps.videoId) {
      this.setState({ videoId: nextProps.videoId });
    }
  }

  onNextVideo = () => {
    const { areaVideos } = this.props;

    if (areaVideos && areaVideos.length > 0) {
      const currentVideoId = this.state.videoId;
      const index = this.props.areaVideos.findIndex((i) => i.id === currentVideoId);

      if (index < areaVideos.length - 1) {
        const currentVideo = this.props.areaVideos[index + 1];
        this.setState({ videoId: currentVideo.id });
      }
    }
  };

  onPrevVideo = () => {
    const { areaVideos } = this.props;

    if (areaVideos && areaVideos.length > 0) {
      const currentVideoId = this.state.videoId;
      const index = this.props.areaVideos.findIndex((i) => i.id === currentVideoId);

      if (index > 0) {
        const currentVideo = this.props.areaVideos[index - 1];
        this.setState({ videoId: currentVideo.id });
      }
    }
  };

  getCurrentVideo = () => {
    const { areaVideos } = this.props;
    const { videoId } = this.state;

    if (areaVideos && areaVideos.length > 0) {
      let currentVideo = null;

      if (videoId) {
        currentVideo = areaVideos.find((i) => i.id === videoId);
      } else {
        currentVideo = areaVideos[0];
      }

      return currentVideo;
    }

    return null;
  };

  renderModal = () => {
    const { isLoading, areaVideos = [], isModalOpen, closeModal, videoArea } = this.props;
    const currentVideo = this.getCurrentVideo();
    const currentUrl = currentVideo ? currentVideo.fullUrl : null;
    const currentIndex = (currentVideo && areaVideos) ? areaVideos.indexOf(currentVideo) : -1;
    const videosCount = areaVideos ? areaVideos.length : 0;

    const prevVideoUrl = '';
    const nextVideoUrl = '';


    return isModalOpen && (
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel={videoArea}
        shouldCloseOnOverlayClick
        className="map-photo-marker-modal"
        overlayClassName="map-photo-marker-overlay"
      >
        <button className="close-button" onClick={closeModal}>&times;</button>
        <div className="videoContainer">
          {isLoading && <LoadingIndicator />}
          {currentVideo && <div className="titleContainer"><p>{currentVideo.title}</p></div>}
          {!isLoading && <video controls autoPlay src={currentUrl} />}
        </div>
        <VideoNavigator
          prevVideoUrl={prevVideoUrl}
          nextVideoUrl={nextVideoUrl}
          currentVideoIndex={currentIndex}
          videoCount={videosCount}
          onNext={this.onNextVideo}
          onPrev={this.onPrevVideo}
        />
      </Modal>
    );
  };

  render() {
    return this.renderModal();
  }
}

AreaVideosModal.propTypes = {
  videoArea: PropTypes.string,
  videoId: PropTypes.string,
  siteId: PropTypes.string,
  token: PropTypes.string,
  getAreaVideos: PropTypes.func,
  areaVideos: PropTypes.array,
  isLoading: PropTypes.bool,
  closeModal: PropTypes.func,
  isModalOpen: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  areaVideos: makeSelectAreaVideos(),
  isLoading: makeIsLoadingAreaVideos(),
});

const mapDispatchToProps = (dispatch) => ({
  getAreaVideos: (siteId, areaName, token) => dispatch(actions.fetchAreaVideos({ siteId, areaName, token })),
});
export default connect(mapStateToProps, mapDispatchToProps)(AreaVideosModal);
