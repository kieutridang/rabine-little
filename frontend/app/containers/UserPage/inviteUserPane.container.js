// vendor
import React from 'react';
import Modal from 'react-modal';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { FormattedMessage, injectIntl } from 'react-intl';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { makeSelectError, makeSelectUser, makeSelectClients, makeIsUserOpen } from '../../appSelector/user';
import messages from './messages';
import LoadingIndicator from '../../components/LoadingIndicator';
import SlidingPane from '../../components/SlidePane';
import { Form, Input, InputWrap, ErrorMessage, AddButton } from './StyledComponents';
import { actions } from '../../appReducer/user.reducer';
import { USER_ADMIN, ADMIN_TYPE, USER_CLIENT } from '../../constants';
import { makeSelectCurrentUser } from '../../appSelector/auth';

class InviteUserPaneContainer extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      headerQuery: '',
      filterQuery: '',
      optionsUserType: [],
      selectedOpt: '',
    };
  }

  componentDidMount() {
    Modal.setAppElement('#app');
    this.props.getClientsCollection();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.user !== nextProps.user && nextProps.user) {
      this.props.resetForm();
    }

    this.setState({ optionsUserType: [] });
    if (!this.props.serverError) {
      if (this.props.currentUser.role === USER_ADMIN) {
        this.setState({ optionsUserType: ADMIN_TYPE });
      }
    }
  }

  setValue = (e) => {
    if (e.label === e.value) {
      this.props.values.userType = e.label;
      this.setState({ selectedOpt: e.label });
    } else {
      this.props.values.company = e.label;
    }
  }

  getClientsOptions = () => {
    const { clients = [] } = this.props;
    return clients.map((client) => ({
      label: client.name,
      value: client.id,
    }));
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
      isOpen,
      showInviteUser,
    } = this.props;

    const clientOptions = this.getClientsOptions();

    return (
      <SlidingPane isOpen={isOpen} title="Add User" onRequestClose={() => showInviteUser(false)}>
        <Form onSubmit={handleSubmit}>
          <InputWrap>
            <label htmlFor="name">
              <FormattedMessage {...messages.userNameLabel} />
              <Input
                name="name"
                id="name"
                type="text"
                placeholder={intl.formatMessage(messages.userNamePlaceHolder)}
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
            <label htmlFor="userType">
              <FormattedMessage {...messages.userTypeLabel} />
              <Dropdown
                name="userType"
                id="userType"
                options={this.state.optionsUserType}
                onChange={this.setValue}
                value={values.userType}
                placeholder="Select an option"
              />
              {touched.userType && errors.userType && <ErrorMessage>{errors.userType}</ErrorMessage>}
            </label>
          </InputWrap>

          {values.userType === USER_CLIENT && (
            <InputWrap>
              <label htmlFor="coName">
                <FormattedMessage {...messages.coName} />
                <Dropdown
                  name="coName"
                  id="coName"
                  options={clientOptions}
                  onChange={this.setValue}
                  value={values.company}
                  placeholder="Select a company"
                />
                {touched.company && errors.company && <ErrorMessage>{errors.company}</ErrorMessage>}
              </label>
            </InputWrap>
          )}

          {values.userType === USER_CLIENT && (
            <InputWrap>
              <label htmlFor="clientTitle">
                <FormattedMessage {...messages.title} />
                <Input
                  name="clientTitle"
                  id="clientTitle"
                  type="text"
                  placeholder={intl.formatMessage(messages.titlePlaceHolder)}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.clientTitle}
                />
              </label>
            </InputWrap>
          )}

          {serverError && (
            <ErrorMessage align="center">
              <FormattedMessage {...messages.inviteUserError} />: {serverError}
            </ErrorMessage>
          )}
          {isLoading && <LoadingIndicator />}
          <AddButton>
            <FormattedMessage {...messages.addUserButton} />
          </AddButton>
        </Form>
      </SlidingPane>
    );
  }
}

InviteUserPaneContainer.propTypes = {
  isOpen: PropTypes.bool,
  user: PropTypes.object,
  currentUser: PropTypes.object,
  values: PropTypes.object,
  touched: PropTypes.object,
  errors: PropTypes.object,
  intl: PropTypes.object,
  clients: PropTypes.array,
  serverError: PropTypes.string,
  isLoading: PropTypes.bool,
  handleChange: PropTypes.func,
  handleBlur: PropTypes.func,
  handleSubmit: PropTypes.func,
  resetForm: PropTypes.func,
  showInviteUser: PropTypes.func,
  getClientsCollection: PropTypes.func,
};

const mapDispatchToProps = (dispatch) => ({
  inviteUserRequest: (user) => dispatch(actions.inviteUserRequest(user)),
  showInviteUser: (isOpen) => dispatch(actions.showInviteUser(isOpen)),
  getClientsCollection: () => dispatch(actions.getClientsCollection()),
});

const mapStateToProps = createStructuredSelector({
  serverError: makeSelectError(),
  user: makeSelectUser(),
  clients: makeSelectClients(),
  currentUser: makeSelectCurrentUser(),
  isOpen: makeIsUserOpen(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

const createUserFormik = withFormik({
  mapPropsToValues: (props) => {
    const initialState = {
      intl: props.intl,
      name: props.name || '',
      email: props.email || '',
      userType: props.userType || '',
      company: props.company || undefined,
      clientTitle: props.clientTitle || undefined,
      inviteUserRequest: props.inviteUserRequest,
    };
    return initialState;
  },

  validate: (values) => {
    const errors = {};
    if (!values.name || values.name.trim() === '') {
      errors.name = values.intl.formatMessage(messages.validationMessage_UserName_Required);
    }
    if (!values.email || values.email.trim() === '') {
      errors.email = values.intl.formatMessage(messages.validationMessage_Email_Required);
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      errors.email = values.intl.formatMessage(messages.validationMessage_Email_InvalidFormat);
    }

    if (!values.userType || values.userType.trim() === '') {
      errors.userType = values.intl.formatMessage(messages.validationMessage_UserType_Required);
    }

    if (values.userType === 'Client' && (!values.company || values.company.trim() === '')) {
      errors.company = values.intl.formatMessage(messages.validationMessage_CoName_Required);
    }
    return errors;
  },

  handleSubmit: (values) => {
    const {
      name: fullName,
      email: username,
      userType, company,
      clientTitle,
      inviteUserRequest,
    } = values;

    inviteUserRequest({
      fullName,
      username,
      userType,
      company,
      clientTitle,
    });
  },
});

export default compose(
  injectIntl,
  withConnect,
  createUserFormik
)(InviteUserPaneContainer);
