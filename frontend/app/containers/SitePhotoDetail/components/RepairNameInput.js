import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { MetadataInfo, Input } from './StyledComponents';
import Options from '../../../components/Options';

export default class RepairNameInput extends Component {
  state = {
    repairName: this.props.repairName || '',
  }

  componentWillReceiveProps = (nextProps) => {
    if (this.props && nextProps && this.props.repairName !== nextProps.repairName) {
      this.setState({
        repairName: nextProps.repairName,
      });
    }
  }

  handleRepairNameChange = (e) => {
    this.setState({
      repairName: e.target.value,
    });
  }

  submitRepairName = () => {
    const { setRepairName } = this.props;
    const { repairName } = this.state;

    setRepairName(repairName);
  }

  handleBlur = () => {
    const { toggleEditing } = this.props;

    this.submitRepairName();
    toggleEditing();
  }

  handleEnter = (e) => {
    if (e.keyCode === 13) {
      this.submitRepairName();
    }
  }

  render() {
    const { getRepairTitleOptions, setRepairName, toggleEditing } = this.props;
    const { repairName } = this.state;
    return (
      <MetadataInfo>
        <Input
          type="text"
          name="title"
          placeholder="Repair name"
          onChange={this.handleRepairNameChange}
          onFocus={toggleEditing}
          onBlur={this.handleBlur}
          onKeyDown={this.handleEnter}
          value={repairName}
        />
        <Options
          value={repairName}
          getOptions={getRepairTitleOptions}
          onSelectOption={setRepairName}
        />
      </MetadataInfo>
    );
  }
}

RepairNameInput.propTypes = {
  repairName: PropTypes.string,
  getRepairTitleOptions: PropTypes.func,
  setRepairName: PropTypes.func,
  toggleEditing: PropTypes.func,
};
