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
import { resetAuthState } from 'containers/App/actions';
import { makeSelectAuthLoading } from 'containers/App/selectors';
import { actions } from '../../appReducer/user.reducer';
import { makeSelectError, makeGetToken } from '../../appSelector/user';
import { Form, Input, InputWrap, Logo, Article, HighlightLink, Button, Container, ErrorMessage, Title } from './StyledComponents';

// hoc
import messages from './messages';

// file
import LogoImage from '../../images/RabineSiteLogo.jpg';

export class PasswordEmailPage extends React.Component {
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
      values,
      intl,
      touched,
      errors,
      handleSubmit,
      handleChange,
      handleBlur,
      getToken,
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
            <Title ><FormattedMessage {...messages.title} /></Title>
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
            { serverError && <ErrorMessage align="left">{serverError}</ErrorMessage> }
            {
              getToken &&
              !serverError &&
              <ErrorMessage align="left"><FormattedMessage {...messages.send_Email} /> </ErrorMessage>
            }
            { isLoading && <LoadingIndicator /> }
            <Button><FormattedMessage {...messages.resetPasswordButton} /> </Button>
            <HighlightLink>
              <FormattedMessage {...messages.rememberYourPassword} />
              <Link to="/login"><FormattedMessage {...messages.signInLink} /></Link>
            </HighlightLink>
          </Form>
        </Container>
      </Article>
    );
  }
}

PasswordEmailPage.propTypes = {
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
  getToken: PropTypes.string,
};

export function mapDispatchToProps(dispatch, ownProps) {
  return {
    onSubmitForm: (email) => {
      const data = { email };
      const { from } = ownProps.location;
      dispatch(actions.resetPasswordRequest(data, from));
    },
    resetAuthState: () => dispatch(resetAuthState()),
  };
}

const mapStateToProps = createStructuredSelector({
  serverError: makeSelectError(),
  isLoading: makeSelectAuthLoading(),
  getToken: makeGetToken(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);
const loginFormik = withFormik({
  mapPropsToValues: (props) => {
    const initialState = {
      // vendor
      intl: props.intl,
      // form
      email: props.email || '',
      // appRedux, appRedux-saga
      submitForm: props.onSubmitForm,
    };
    return initialState;
  },

  validate: (values) => {
    const errors = {};
    if (!values.email) {
      errors.email = values.intl.formatMessage(messages.validationMessage_Email_Required);
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      errors.email = values.intl.formatMessage(messages.validationMessage_Email_InvalidFormat);
    }
    return errors;
  },

  handleSubmit: (values) => {
    values.submitForm(values.email);
  },
});

export default compose(
  withConnect,
  injectIntl,
  loginFormik,
)(PasswordEmailPage);
