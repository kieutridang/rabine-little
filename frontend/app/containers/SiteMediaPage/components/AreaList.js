import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import AreaLink from './AreaLink';

class AreaList extends PureComponent {

  constructor(props) {
    super(props);
    this.selectArea = this.handleSelectArea.bind(this);
  }

  handleSelectArea(area, isDeleted) {
    this.props.selectArea(area.id, area.type, isDeleted);
  }


  render() {
    const { data, currentAreaId, isShared } = this.props;
    return (
      <div>
        {
          !isEmpty(data) && data.map((area) => {
            // currently, hidden area after deleted. Need apply undo to restore area
            if (area.deleted) {
              return null;
            }
            if (isShared) {
              return (
                area.id !== 'defected' && area.id !== 'repair' &&
                <AreaLink
                  key={`area-${area.id}`}
                  area={area}
                  selected={currentAreaId === area.id}
                  onAreaSelected={this.selectArea}
                />);
            }
            return (
              <AreaLink
                key={`area-${area.id}`}
                area={area}
                selected={currentAreaId === area.id}
                onAreaSelected={this.selectArea}
              />
            );
          })
        }
      </div>
    );
  }
}

AreaList.defaultProps = {
  data: [],
};

AreaList.propTypes = {
  data: PropTypes.array,
  currentAreaId: PropTypes.string,
  selectArea: PropTypes.func,
  isShared: PropTypes.bool,

};

export default AreaList;
