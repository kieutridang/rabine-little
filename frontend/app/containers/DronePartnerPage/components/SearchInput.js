import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Img from 'components/Img';
import SearchIcon from '../../../images/search.png';

const SearchWrapper = styled.div`
  position: relative;
  cursor: text;
  img {
    position: absolute;
    top: 10px;
    left: 10px;
  }

  input {
    border-radius: 3px;
    border: solid 1px #dedee1;
    padding: 8px;
    padding-left: 30px;
    font-size: 14px;
    width: ${(props) => props.width || '220px'}
  }
`;

class SearchInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };
  }

  onKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (this.props.onEnter) {
        this.props.onEnter(this.state.value, e);
      }
    }
  }

  onChange = (e) => {
    this.setState({ value: e.target.value }, () => {
      if (this.props.onChange) {
        this.props.onChange(this.state.value);
      }
    });
  }

  render() {
    const { width, placeholder } = this.props;
    const { value } = this.state;
    return (
      <SearchWrapper width={width} onClick={() => this.input.focus()}>
        {(value === null || value === '') && <Img src={SearchIcon} alt="search-icon" />}
        <input
          ref={(input) => { this.input = input; }}
          value={value}
          placeholder={placeholder}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          type="search"
        />
      </SearchWrapper>
    );
  }
}

SearchInput.propTypes = {
  placeholder: PropTypes.string,
  width: PropTypes.string,
  onChange: PropTypes.func,
  onEnter: PropTypes.func,
};

export default SearchInput;
