// vendor
import React from 'react';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// app
import ClientAdd from './clientAdd.container';
import ClientHeader from './clientHeader';
import ClientFilters from './clientFilters';
import ClientContent from './clientContent';
import ContentWrapper from '../../components/Content/ContentWrapper';
import { actions } from '../../appReducer/client.reducer';

class ClientPage extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props, context) {
    super(props, context);

    this.state = {
      isShowFilters: false,
    };
  }

  componentDidMount() {
    Modal.setAppElement('#app');
  }

  onNewClientHandler = () => this.props.showAddClient();

  handleShowHideFilters = () => this.setState((prevState) => ({ isShowFilters: !prevState.isShowFilters }));

  render() {
    const {
      isShowFilters,
    } = this.state;

    return (
      <ContentWrapper tag="article">
        { /* Header */ }
        <ClientHeader
          isShowFilters={isShowFilters}
          showHideFilters={this.handleShowHideFilters}
          openAddNewClientPane={this.onNewClientHandler}
        />

        { /* Filter */ }
        <ClientFilters isShowFilters={isShowFilters} />

        { /* Data */ }
        <ClientContent />

        <ClientAdd />

      </ContentWrapper>
    );
  }
}

ClientPage.propTypes = {
  showAddClient: PropTypes.func,
};

const mapDispatchToProps = (dispatch) => ({
  showAddClient: () => dispatch(actions.showAddClient()),
});


export default connect(null, mapDispatchToProps)(ClientPage);
