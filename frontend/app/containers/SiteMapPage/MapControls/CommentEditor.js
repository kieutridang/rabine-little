import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { compose } from 'redux';
import { withFormik } from 'formik';
import { isEmpty } from 'lodash';

import LoadingIndicator from '../../../components/LoadingIndicator';

class CommentEditor extends Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps
      && this.props.isSubmitting && nextProps.isSubmitting
      && isEmpty(nextProps.errors)) {
      this.props.resetForm();
    }
  }

  renderInput = (name, placeholder) => {
    const {
      values,
      touched,
      errors,
      handleChange,
      handleBlur,
    } = this.props;

    return (
      <InputWrap>
        <Input
          name={`${name}`}
          id={`${name}`}
          type="text"
          placeholder={placeholder}
          onChange={handleChange}
          onBlur={handleBlur}
          value={values[name]}
        />
        {touched[name] && errors[name] && <ErrorMessage>{errors[name]}</ErrorMessage>}
      </InputWrap>
    );
  };

  renderTextArea = (name, placeholder) => {
    const {
      values,
      touched,
      errors,
      handleChange,
      handleBlur,
    } = this.props;

    return (
      <InputWrap>
        <TextArea
          name={`${name}`}
          id={`${name}`}
          type="text"
          placeholder={placeholder}
          onChange={handleChange}
          onBlur={handleBlur}
          value={values[name]}
        />
        {touched[name] && errors[name] && <ErrorMessage>{errors[name]}</ErrorMessage>}
      </InputWrap>
    );
  };

  render() {
    const {
      isLoading,
      serverError,
      handleSubmit,
      readOnly,
    } = this.props;

    return (
      <Form onSubmit={handleSubmit}>
        { readOnly && this.renderInput('authorName', 'Your Name') }
        { this.renderTextArea('comment', 'Write a comment') }
        {
          serverError &&
          <ErrorMessage align="center">{serverError}</ErrorMessage>
        }
        { isLoading && <LoadingIndicator /> }
        <AddButton>ADD COMMENT</AddButton>
      </Form>
    );
  }
}

CommentEditor.propTypes = {
  values: PropTypes.object,
  touched: PropTypes.object,
  errors: PropTypes.object,
  handleChange: PropTypes.func,
  handleBlur: PropTypes.func,
  isLoading: PropTypes.bool,
  serverError: PropTypes.string,
  handleSubmit: PropTypes.func,
  readOnly: PropTypes.bool,
  isSubmitting: PropTypes.bool,
  resetForm: PropTypes.func,
};

const AddButton = styled.button`
  background: #EA272E;
  width: 100%;
  color: #FFFFFF;
  font-size: 16px;
  border-radius: 3px;
  padding: 10px 0;
  cursor: pointer;
  text-transform: uppercase;
`;

const Form = styled.form`
  border-radius: 5px;
  text-align: center;
  padding: 0px 0px;
  width: 100%;
`;

const Input = styled.input`
  height: 40px;
  border-radius: 3px;
  background-color: #3c3c3c;
  border: solid 1px #444444;
  
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.29;
  letter-spacing: 0.5px;
  text-align: left;
  color: white;
  opacity: 0.7;
  padding-left: 15px;
  padding-right: 15px;
`;

const InputWrap = styled.div`
  display: flex; 
  flex-direction: column;
  justify-content: flex-start;
  margin-top: 0px;
  margin-bottom: 13px;
  label {
    text-transform: uppercase;
    justify-content: flex-start;
  }
  span {
    font-size: 10px;
    font-weight: 600;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: 0.4px;
    text-align: left;
    color: #707277;
    display: flex;
  }
  
  select {
    height: 40px;
    color: #ACAEB0;
    border-radius: 3px;
    background-color: #fbfbfb;
    border: solid 1px #cbccce;
    
    font-size: 14px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.29;
    letter-spacing: 0.5px;
    text-align: left;
    color: #707277;
    padding-left: 15px;
    padding-right: 15px;
    
    ::placeholder {
      opacity: 0.7;
    }
  }
`;

const TextArea = styled.textarea`
  vertical-align: top;
  margin: 0;
  outline: 0;
  box-shadow: 0 0 0 0 transparent inset;
  transition: color .1s ease,border-color .1s ease;
  font-size: 14px;
  resize: vertical;
  width: 100%;
  overflow: auto;
  flex-direction: column;
  cursor: text;
  white-space: pre-wrap;
  word-wrap: break-word;

  text-rendering: auto;
  letter-spacing: normal;
  word-spacing: normal;
  text-transform: none;
  text-indent: 0px;
  text-shadow: none;
  display: inline-block;
  text-align: start;
  margin: 0em;
  font-weight: 400;

  line-height: 1.29;
  letter-spacing: 0.5px;
  text-align: left;
  color: white;
  opacity: 0.7;

  border-radius: 3px;
  background-color: #3c3c3c;
  border: solid 1px #444444;
  padding: 11px 15px;
`;

const ErrorMessage = styled.p`
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.29;
  letter-spacing: 0.5px;
  
  text-transform: none;
  color: #EA272E;
  text-align: ${(props) => props.align || 'right'};
  margin: 4px 0;
`;

const createSiteFormik = withFormik({
  mapPropsToValues: (props) => {
    const initialState = {
      // form
      authorName: props.authorName || '',
      comment: props.comment || '',
    };
    return initialState;
  },

  validate: () => {
    const errors = {};

    return errors;
  },

  handleSubmit: (
    values,
    {
      props: {
        id,
        readOnly,
        addComment,
        addSharedComment,
      },
    }
  ) => {
    const {
      authorName,
      comment,
    } = values;

    const commentRequest = {
      id,
      comment,
    };

    if (readOnly) {
      addSharedComment({ ...commentRequest, authorName });
    } else {
      addComment(commentRequest);
    }
  },
});

export default compose(
  createSiteFormik,
)(CommentEditor);
