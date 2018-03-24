/*
 * LoginPage
 *
 * https://marvelapp.com/5gc1jjb/screen/37690218
 */

// vendor
import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { FormattedMessage, injectIntl } from 'react-intl';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withFormik } from 'formik';
import LoadingIndicator from 'components/LoadingIndicator';
import { Link } from 'react-router-dom';

// app
import { signup } from 'containers/App/actions';
import { makeSelectError, makeSelectAuthLoading } from 'containers/App/selectors';
import { Form, Input, InputWrap, Logo, Article, HighlightLink, Button, Container, ErrorMessage } from 'containers/LoginPage/StyledComponents';

// hoc
import messages from './messages';

// file
import LogoImage from '../../images/RabineSiteLogo.jpg';

export class LoginPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { serverError, isLoading, values, intl,
            touched, errors,
            handleSubmit, handleChange, handleBlur,
          } = this.props;
    return (
      <Article>
        <Helmet>
          <title>Login</title>
          <meta name="description" content="rabinesite" />
        </Helmet>
        <Container>
          <Form onSubmit={handleSubmit}>
            <Logo src={LogoImage} />
            <InputWrap>
              <label htmlFor="name">
                <FormattedMessage {...messages.nameLabel} />
                <Input
                  name="name"
                  id="name"
                  type="text"
                  placeholder={intl.formatMessage(messages.namePlaceHolder)}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                />
                {touched.name && errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
              </label>
            </InputWrap>

            <InputWrap>
              <label htmlFor="email">
                <FormattedMessage {...messages.emailLabel} />
                <Input
                  name="email"
                  id="email"
                  type="text"
                  placeholder={intl.formatMessage(messages.emailPlaceHolder)}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                />
                {touched.email && errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
              </label>
            </InputWrap>

            <InputWrap>
              <label htmlFor="password">
                <FormattedMessage {...messages.passwordLabel} />
                <Input
                  name="password"
                  id="password"
                  type="password"
                  placeholder={intl.formatMessage(messages.passwordPlaceHolder)}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                />
                {touched.password && errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
              </label>
            </InputWrap>

            <InputWrap>
              <label htmlFor="repeatPassword">
                <FormattedMessage {...messages.repeatPasswordLabel} />
                <Input
                  name="repeatPassword"
                  id="repeatPassword"
                  type="password"
                  placeholder={intl.formatMessage(messages.repeatPasswordPlaceHolder)}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.repeatPassword}
                />
                {touched.repeatPassword && errors.repeatPassword && <ErrorMessage>{errors.repeatPassword}</ErrorMessage>}
              </label>
            </InputWrap>

            {serverError && <ErrorMessage align="center"><FormattedMessage {...messages.serverErrorPrefix} />: {serverError}</ErrorMessage>}
            {isLoading && <LoadingIndicator />}
            <Button><FormattedMessage {...messages.signupButton} /></Button>
            <HighlightLink><FormattedMessage {...messages.alreadyHaveAccount} /> <Link to="/"><FormattedMessage {...messages.signinLink} /></Link></HighlightLink>
          </Form>
        </Container>
      </Article>
    );
  }
}

LoginPage.propTypes = {
  values: PropTypes.object,
  touched: PropTypes.object,
  errors: PropTypes.object,
  intl: PropTypes.object,
  serverError: PropTypes.string,
  isLoading: PropTypes.bool,
  handleSubmit: PropTypes.func,
  handleChange: PropTypes.func,
  handleBlur: PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    onSubmitForm: (username, password, name) => {
      dispatch(signup(username, password, name));
    },
  };
}

const mapStateToProps = createStructuredSelector({
  serverError: makeSelectError(),
  isLoading: makeSelectAuthLoading(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);
const loginFormik = withFormik({
  mapPropsToValues: (props) => {
    const initialState = {
      // vendor
      intl: props.intl,
      // form
      name: props.name || '',
      email: props.email || '',
      password: props.password || '',
      repeatPassword: props.repeatPassword || '',

      // appRedux, appRedux-saga
      submitForm: props.onSubmitForm,
    };
    return initialState;
  },

  validate: (values) => {
    const errors = {};
    if (!values.name || values.name.trim() === '') {
      errors.name = values.intl.formatMessage(messages.validationMessage_Name_Required);
    }
    if (!values.email || values.email.trim() === '') {
      errors.email = values.intl.formatMessage(messages.validationMessage_Email_Required);
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
      errors.email = values.intl.formatMessage(messages.validationMessage_Email_InvalidFormat);
    }
    if (!values.password) {
      errors.password = values.intl.formatMessage(messages.validationMessage_Password_Required);
    } else if (values.password.length < 6) {
      errors.password = values.intl.formatMessage(messages.validationMessage_Password_LengthMinium);
    } else if (values.password !== values.repeatPassword) {
      errors.repeatPassword = values.intl.formatMessage(messages.validationMessage_RepeatPassword_NotMatch);
    }
    return errors;
  },

  handleSubmit: (values) => {
    values.submitForm(values.email, values.password, values.name);
  },
});

export default compose(
  withConnect,
  injectIntl,
  loginFormik,
)(LoginPage);
