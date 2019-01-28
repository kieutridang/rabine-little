import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { AreaName, AreaImagesCount } from './StyledComponent';
import DeleteIcon from './../../../images/delete.svg';

const getText = (total, type) => {
  let text = '';

  if (type === 'Video') {
    text = total > 0 ? 'videos' : 'video';
  } else {
    text = total > 0 ? 'images' : 'image';
  }

  return `${total} ${text}`;
};

class AreaLink extends Component {

  constructor(props) {
    super(props);
    this.deleteArea = this.handleDeleteArea.bind(this);
    this.selectArea = this.handleSelectArea.bind(this);
  }

  handleDeleteArea() {
    const {
      area,
      onAreaSelected,
    } = this.props;
    onAreaSelected(area, !area.deleted);
  }

  handleSelectArea() {
    const {
      area,
      onAreaSelected,
    } = this.props;
    onAreaSelected(area);
  }

  render() {
    const {
      selected,
      area: { id, title, total, type, requesting },
    } = this.props;
    const isDeletable = id !== 'defected' && id !== 'repair';
    const RemoveIcon = isDeletable ?
      (
        <div className={'deleted-area-container delete-area'}>
          <DeleteIcon className={'delete-area'} onClick={this.deleteArea} />
        </div>
      ) : null;
    const LoadingIcon = (
      <div className={'deleted-area-container delete-area'}>
        <p className="deleting">Deleting...</p>
      </div>
    );
    return (
      <button
        disabled={selected}
        className={classnames('areaButton', { selected })}
        onClick={this.selectArea}
      >
        <AreaName>{title}</AreaName>
        <AreaImagesCount>{getText(total, type)}</AreaImagesCount>

        {!requesting && RemoveIcon}
        {requesting && LoadingIcon}
      </button>
    );
  }
}

AreaLink.propTypes = {
  area: PropTypes.shape({
    title: PropTypes.string,
    total: PropTypes.number,
    id: PropTypes.string,
  }),
  onAreaSelected: PropTypes.func,
  selected: PropTypes.bool,
};

export default AreaLink;
