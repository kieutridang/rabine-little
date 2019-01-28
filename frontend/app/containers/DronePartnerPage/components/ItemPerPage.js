import styled from 'styled-components';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ItemPerPage extends Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    className: PropTypes.string,
    initalValue: PropTypes.any,
    onChange: PropTypes.func,
    options: PropTypes.array,
  }

  constructor(props) {
    super(props);
    this.state = {
      value: props.initalValue,
    };
  }

  handleChange = (event) => {
    const { onChange } = this.props;
    this.setState({ value: event.currentTarget.value }, () => {
      if (onChange) {
        this.props.onChange(this.state.value);
      }
    });
  }

  render() {
    const { className, options } = this.props;
    return (
      <select className={className} onChange={this.handleChange} value={this.state.value}>
        {
          options && options.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label} per page
            </option>)
          )
        }
      </select>
    );
  }
}

const ItemPerPageWrapper = styled(ItemPerPage)`
  height: 36px;
  font-size: 14px;
  margin: 8px 0;
  color: #818d98;
  outline: none;
`;

export default ItemPerPageWrapper;
