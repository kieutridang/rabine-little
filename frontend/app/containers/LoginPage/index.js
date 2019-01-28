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
import { loginToAuthenticate, resetAuthState } from 'containers/App/actions';
import { makeSelectError, makeSelectAuthLoading } from 'containers/App/selectors';
import { Form, Input, InputWrap, Logo, Article, Button, Container, ErrorMessage, ForgotPasswordLink } from './StyledComponents';
import { encryptPlainText } from '../../utils/security/encryption';

// hoc
import messages from './messages';

// file
import LogoImage from '../../images/RabineSiteLogo.jpg';

export class LoginPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  state = {
    loginOrCreate: 'login',
  }

  componentWillUnmount() {
    if (this.props.resetAuthState) {
      this.props.resetAuthState();
    }
  }

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
            <ForgotPasswordLink><Link to="/reset-email"><FormattedMessage {...messages.forgotPasswordLink} /></Link></ForgotPasswordLink>
            {serverError && <ErrorMessage align="left">{serverError}</ErrorMessage>}
            {isLoading && <LoadingIndicator />}
            <Button><FormattedMessage {...messages.loginButton} /> </Button>
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
  resetAuthState: PropTypes.func,
};

export function mapDispatchToProps(dispatch, ownProps) {
  return {
    onSubmitForm: (username, password) => {
      const { from } = ownProps.location;
      dispatch(loginToAuthenticate(username, password, from));
    },
    resetAuthState: () => dispatch(resetAuthState()),
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
      email: props.email || '',
      password: props.password || '',
      // appRedux, appRedux-saga
      submitForm: props.onSubmitForm,
    };
    return initialState;
  },

  validate: (values) => {
    const errors = {};
    if (!values.email) {
      errors.email = values.intl.formatMessage(messages.validationMessage_Email_Required);
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
      errors.email = values.intl.formatMessage(messages.validationMessage_Email_InvalidFormat);
    }
    if (!values.password) {
      errors.password = values.intl.formatMessage(messages.validationMessage_Password_Required);
    }
    return errors;
  },

  handleSubmit: (values) => {
    values.submitForm(values.email, encryptPlainText(values.password));
  },
});

export default compose(
  withConnect,
  injectIntl,
  loginFormik,
)(LoginPage);
