import React from 'react';
import PropTypes from 'prop-types';
import 'rc-color-picker/assets/index.css';

import {
    Input,
    InputWrap,
    Form,
    ColorPickerContainer,
    StyledColorPicker,
} from './styled';

const inputs = ({
    handleChangeColor,
    handleChangeText,
    inputValues,
}) => (
  <Form>
    <InputWrap>
      <label htmlFor="text1">
        <span> Text 1 </span>
        <Input
          name="text1"
          id="text1"
          type="text"
          placeholder={'Pavement Assessment Report'}
          onChange={handleChangeText}
          value={inputValues.text1}
        />
      </label>
    </InputWrap>
    <InputWrap>
      <label htmlFor="text2">
        <span> Text 2 </span>
        <Input
          name="text2"
          id="text2"
          type="text"
          placeholder={'Location Overview'}
          onChange={handleChangeText}
          value={inputValues.text2}
        />
      </label>
    </InputWrap>
    <InputWrap>
      <label htmlFor="color">
        <span> Color </span>
        <ColorPickerContainer>
          <StyledColorPicker
            onChange={handleChangeColor}
            defaultColor="#00000"
          />
        </ColorPickerContainer>
      </label>
    </InputWrap>
  </Form>
    );

inputs.propTypes = {
  handleChangeColor: PropTypes.func,
  handleChangeText: PropTypes.func,
  inputValues: PropTypes.any,
};

export default inputs;
