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

// app
import { resetAuthState } from 'containers/App/actions';
import { makeSelectAuthLoading } from 'containers/App/selectors';
import { actions } from '../../appReducer/user.reducer';
import { makeSelectError, makeIsUserOpen } from '../../appSelector/user';
import { Form, Input, InputWrap, Logo, Article, Button, Container, ErrorMessage } from './StyledComponents';
import { encryptPlainText } from '../../utils/security/encryption';

// hoc
import messages from './messages';

// file
import LogoImage from '../../images/RabineSiteLogo.jpg';

export class PasswordResetPage extends React.Component {
  state = {
    loginOrCreate: 'login',
  };

  componentWillUnmount() {
    if (this.props.resetAuthState) {
      this.props.resetAuthState();
    }
  }

  render() {
    const {
      serverError,
      isLoading,
      intl,
      values,
      touched,
      errors,
      handleSubmit,
      handleChange,
      handleBlur,
      isOpen,
    } = this.props;

    return (
      <Article>
        <Helmet>
          <title>Reset Password</title>
          <meta name="description" content="rabinesite" />
        </Helmet>
        <Container>
          <Form onSubmit={handleSubmit}>
            <Logo src={LogoImage} />
            <InputWrap marginTop>
              <label htmlFor="newPassword">
                <FormattedMessage {...messages.passwordLabel} />
                <Input
                  name="newPassword"
                  id="newPassword"
                  type="password"
                  placeholder={intl.formatMessage(messages.passwordPlaceHolder)}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.newPassword}
                />
                {touched.newPassword && errors.newPassword && <ErrorMessage>{errors.newPassword}</ErrorMessage>}
              </label>
            </InputWrap>
            <InputWrap>
              <label htmlFor="repeatNewPassword">
                <FormattedMessage {...messages.repeatPasswordLabel} />
                <Input
                  name="repeatNewPassword"
                  id="repeatNewPassword"
                  type="password"
                  placeholder={intl.formatMessage(messages.passwordPlaceHolder)}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.repeatNewPassword}
                />
                {touched.repeatNewPassword && errors.repeatNewPassword &&
                <ErrorMessage>{errors.repeatNewPassword}</ErrorMessage>}
              </label>
            </InputWrap>
            {
              serverError &&
              <ErrorMessage align="left">
                <FormattedMessage {...messages.changePassword_Fail} />
              </ErrorMessage>
            }
            {
              isOpen &&
              <ErrorMessage align="left">
                <FormattedMessage {...messages.changePassword_Success} />
              </ErrorMessage>
            }
            { isLoading && <LoadingIndicator /> }

            <Button><FormattedMessage {...messages.resetPasswordButton} /> </Button>
          </Form>
        </Container>
      </Article>
    );
  }
}

PasswordResetPage.propTypes = {
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
  isOpen: PropTypes.bool,
};

export function mapDispatchToProps(dispatch) {
  return {
    onSubmitForm: (password, resetToken) => {
      const data = { resetToken, password };
      dispatch(actions.changePasswordRequest(data));
    },
    resetAuthState: () => dispatch(resetAuthState()),
  };
}

const mapStateToProps = createStructuredSelector({
  serverError: makeSelectError(),
  isLoading: makeSelectAuthLoading(),
  isOpen: makeIsUserOpen(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);
const loginFormik = withFormik({
  mapPropsToValues: (props) => {
    const initialState = {
      // vendor
      intl: props.intl,
      // form
      newPassword: props.newPassword || '',
      repeatNewPassword: props.repeatNewPassword || '',
      resetToken: props.route.match.params.token,
      submitForm: props.onSubmitForm,
    };
    return initialState;
  },

  validate: (values) => {
    const errors = {};
    if (!values.newPassword) {
      errors.newPassword = values.intl.formatMessage(messages.validationMessage_Password_Required);
    }
    if (values.repeatNewPassword !== values.newPassword) {
      errors.repeatNewPassword = values.intl.formatMessage(messages.validationMessage_RepeatPassword_Validate);
    }
    if (!values.repeatNewPassword) {
      errors.repeatNewPassword = values.intl.formatMessage(messages.validationMessage_RepeatPassword_Required);
    }
    return errors;
  },

  handleSubmit: (values) => {
    values.submitForm(encryptPlainText(values.newPassword), values.resetToken);
  },
});

export default compose(
  withConnect,
  injectIntl,
  loginFormik
)(PasswordResetPage);
