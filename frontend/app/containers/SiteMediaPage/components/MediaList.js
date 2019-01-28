import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { MediaGrid, MediaItem } from './StyledComponent';
import PlayIcon from '../../../images/icons/play_large.svg';
import MediaTitle from './MediaTitle';

const MediaControl =
  ({
     id,
     className,
     thumbnailUrl,
     isVideo,
     openAreaVideos = null,
   }) => (
     <MediaItem key={id} onClick={openAreaVideos} backgroundImage={thumbnailUrl}>
       <div className={className}>
         {isVideo && <PlayIcon width="54px" height="54px" />}
       </div>
     </MediaItem>
  );

const renderMediaItem = ({ siteId, areaId, isShared, token, getRepairTitle, type, openAreaVideos, setDeletedAreaPhoto }) => (mediaItem) => {
  const { title, thumbnailUrl, defected, repairId, id, deleted, requesting } = mediaItem;
  const baseUrl = `${siteId}/areas/${areaId}/media/${id}`;
  const authUrl = `/sites/${baseUrl}`;
  const sharedUrl = `/shared/${baseUrl}/${token}`;
  const to = isShared ? sharedUrl : authUrl;
  const key = `media-${id}`;
  const isVideo = type === 'Video';
  const className = isVideo ? 'thumbnailVideo' : 'thumbnail';
  const mediaKey = `media-${title}`;
  const MediaControlItem = (<MediaControl
    key={id}
    id={id}
    title={title}
    className={className}
    mediaKey={mediaKey}
    isVideo={isVideo}
    thumbnailUrl={thumbnailUrl}
    defected={defected}
    getRepairTitle={getRepairTitle}
    repairId={repairId}
    openAreaVideos={isVideo ? () => openAreaVideos(areaId, id) : null}
  />);


  const PhotoControlItem = (<Link to={to} key={key}>
    { MediaControlItem }
  </Link>);

  const VideoControlItem = ({ MediaControlItem });

  return (
    <div key={key} className={`media-item-container ${deleted ? 'deleted' : ''}`}>
      {isVideo ? VideoControlItem : PhotoControlItem}
      <MediaTitle
        id={id}
        to={to}
        title={title}
        siteId={siteId}
        areaId={areaId}
        repairId={repairId}
        mediaKey={mediaKey}
        isVideo={isVideo}
        defected={defected}
        requesting={requesting}
        deleted={deleted}
        getRepairTitle={getRepairTitle}
        setDeletedAreaPhoto={setDeletedAreaPhoto}
      />
    </div>
  );
};

MediaControl.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  thumbnailUrl: PropTypes.string,
  isVideo: PropTypes.bool,
  openAreaVideos: PropTypes.func,
};

const MediaList = (props) => (
  <MediaGrid>
    { props.mediaItems.map(renderMediaItem(props)) }
  </MediaGrid>
);

MediaList.propTypes = {
  mediaItems: PropTypes.array,
};

export default MediaList;
