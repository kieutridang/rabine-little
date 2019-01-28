import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import SlidingPane from 'components/SlidePane';

import { actions } from '../orderDetail.reducer';
import { makeIsOrderEditOpen } from '../orderDetail.selector';

class OrderEditPane extends Component {
  componentDidMount() {
    Modal.setAppElement('#app');
  }

  requestCloseHandler = () => {
    const { openEdit } = this.props;
    if (openEdit) {
      openEdit();
    }
  }

  render() {
    const {
      isOpen,
    } = this.props;

    return (
      <SlidingPane
        isOpen={isOpen}
        title="Edit Site"
        onRequestClose={this.requestCloseHandler}
      >
        Edit Order
      </SlidingPane>
    );
  }
}

OrderEditPane.propTypes = {
  isOpen: PropTypes.bool,
  openEdit: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  isOpen: makeIsOrderEditOpen(),
});

const mapDispatchToProps = (dispatch) => ({
  openEdit: () => dispatch(actions.showEditOrder()),
});

const withRedux = connect(mapStateToProps, mapDispatchToProps);

export default withRedux(OrderEditPane);
