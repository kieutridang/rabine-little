import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MetadataInfo, CustomCheckboxInput } from './StyledComponents';

export default class RepairInfo extends Component {
  handleCheckRepair = () => {
    const { onCheckRepair, repair } = this.props;
    onCheckRepair(!repair);
  };

  render() {
    const { repair } = this.props;
    return (
      <MetadataInfo>
        <span>Repair</span>
        <span>
          <CustomCheckboxInput
            type="checkbox"
            value={repair}
            checked={repair}
            onChange={this.handleCheckRepair}
          />
        </span>
      </MetadataInfo>
    );
  }
}

RepairInfo.propTypes = {
  repair: PropTypes.bool,
  onCheckRepair: PropTypes.func,
};
