import React from 'react';
import PropTypes from 'prop-types';
import {
    Form,
    InputWrap,
    Input,
 } from '../../OverviewStep/Inputs/styled';

const TextInputs = ({
     handleChangeText,
     inputValues,
 }) => (
   <Form>
     <InputWrap>
       <label htmlFor="text3">
         <span> Text 1 </span>
         <Input
           name="text3"
           id="text3"
           type="text"
           placeholder={'Zone Map'}
           onChange={handleChangeText}
           value={inputValues.text3}
         />
       </label>
     </InputWrap>
     <InputWrap>
       <label htmlFor="text4">
         <span> Text 2 </span>
         <Input
           name="text4"
           id="text4"
           type="text"
           placeholder={'Zone Information'}
           onChange={handleChangeText}
           value={inputValues.text4}
         />
       </label>
     </InputWrap>
   </Form>
     );

TextInputs.propTypes = {
  handleChangeText: PropTypes.func,
  inputValues: PropTypes.any,
};

export default TextInputs;

