import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';

const VideoNavigator = styled.div`
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  justify-content: flex-end;
  display: flex;
  .counter {
    min-width: 199px;
    display: flex;
    height: 45px;
    border-radius: 3px;
    background-color: rgb(33, 33, 33, 0.7);
    border: solid 1px rgb(255, 255, 255);
    justify-content: center;
    align-items: center;
    position: relative;
    margin: auto;
    margin-bottom: 0;
    .arrow {
      color: white;
      position: absolute;
      left: 14px;
      opacity: 0.8;
      &:last-child {
        right: 14px;
        left: auto;
      }
      i {
        font-size: 30px;
      }
    }
    span {
      font-family: Source Sans Pro;
      font-weight: 600;
      font-size: 20px;
      color: white;
    }
  }
  .photoActions {
    background: white;
    border-radius: 2px;
    flex-direction: column;
    display: flex;
    height: 70px;
    width: 35px;
    margin-right: 18px;
    button {
      flex: 1;
      cursor: pointer;
      &:disabled,
      &[disable] {
        opacity: 0.5;
      }
    }
  }
`;

class VideoNaviagorContainer extends React.Component {
  componentWillMount() {
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown.bind(this));
  }

  handleKeyDown(e) {
    const { prevVideoUrl, nextVideoUrl, onNext, onPrev } = this.props;
    if (e.keyCode === 39 && nextVideoUrl !== null) onNext(nextVideoUrl);
    if (e.keyCode === 37 && prevVideoUrl !== null) onPrev(prevVideoUrl);
  }

  render() {
    const { currentVideoIndex, videoCount = -1, prevVideoUrl, nextVideoUrl } = this.props;

    return (
      <VideoNavigator>
        <div className="counter">
          <span
            className="arrow"
            role="presentation"
            disabled={prevVideoUrl == null}
            onClick={this.props.onPrev}
          >
            <i className="fa fa-angle-left" />
          </span>
          <span>
            {currentVideoIndex >= 0 ? `${currentVideoIndex + 1} of ${videoCount}` : '-'}
          </span>
          <span
            role="presentation"
            className="arrow"
            disabled={nextVideoUrl == null}
            onClick={this.props.onNext}
          >
            <i className="fa fa-angle-right" />
          </span>
        </div>
      </VideoNavigator>
    );
  }
}

VideoNaviagorContainer.propTypes = {
  onNext: PropTypes.func,
  onPrev: PropTypes.func,
  prevVideoUrl: PropTypes.string,
  nextVideoUrl: PropTypes.string,
  currentVideoIndex: PropTypes.int,
  videoCount: PropTypes.int,
};

export default withRouter(VideoNaviagorContainer);
