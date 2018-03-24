import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';

import { makeSelectAuthLoading, makeSelectError } from '../App/selectors';
import { logout } from '../App/actions';
import Navbar from '../../components/Navbar';

const NavBarContainer = (props) => (<Navbar {...props} />);

const mapStateToProps = createStructuredSelector({
  serverError: makeSelectError(),
  isLoading: makeSelectAuthLoading(),
});

function mapDispatchToProps(dispatch) {
  return {
    logOut: () => {
      dispatch(logout());
    },
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withRouter,
  withConnect
)(NavBarContainer);
