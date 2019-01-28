import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import includes from 'lodash/includes';
import DeleteButton from './DeleteButton';

class MediaTitle extends PureComponent {
  constructor(props) {
    super(props);
    this.undoPhoto = this.handleUndoPhoto.bind(this);
    this.deletePhoto = this.handleDeletePhoto.bind(this);
  }

  handleUndoPhoto() {
    const { id, siteId, areaId, setDeletedAreaPhoto } = this.props;
    return setDeletedAreaPhoto(siteId, areaId, id, false);
  }

  handleDeletePhoto() {
    const { id, siteId, areaId, setDeletedAreaPhoto } = this.props;
    return setDeletedAreaPhoto(siteId, areaId, id, true);
  }

  renderTitle() {
    const { title, defected, mediaKey, repairId, getRepairTitle } = this.props;
    return (
      <p className={'title-media'} key={mediaKey}>
        {title}
        {defected && (<Fragment><br /><small>({getRepairTitle(repairId)})</small></Fragment>)}
      </p>
    );
  }

  render() {
    const { areaId, requesting, deleted, isVideo, to } = this.props;
    const isDeletable = !includes(['defected', 'repair'], areaId) && !isVideo;
    if (requesting) {
      return (
        <div className={'media-item-title'}>
          <p className={'text-secondary'} >{deleted ? 'Restoring...' : 'Deleting...'}</p>
        </div>
      );
    } else if (deleted) {
      return (
        <div className={'media-item-title'}>
          <button type={'button'} className={'undelete-media btn btn-sm btn-secondary'} onClick={this.undoPhoto}>Undo</button>
        </div>
      );
    }
    return (
      <div className={'media-item-title'}>
        {isVideo ? this.renderTitle() : <Link to={to}>{this.renderTitle()}</Link>}
        {isDeletable && <DeleteButton className={'delete-media'} onClick={this.deletePhoto} />}
      </div>
    );
  }
}

MediaTitle.propTypes = {
  id: PropTypes.string,
  to: PropTypes.string,
  title: PropTypes.string,
  areaId: PropTypes.string,
  siteId: PropTypes.string,
  repairId: PropTypes.string,
  mediaKey: PropTypes.string,
  defected: PropTypes.bool,
  deleted: PropTypes.bool,
  requesting: PropTypes.bool,
  isVideo: PropTypes.bool,
  getRepairTitle: PropTypes.func,
  setDeletedAreaPhoto: PropTypes.func,
};

export default MediaTitle;
