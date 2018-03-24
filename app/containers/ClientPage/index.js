// vendor
import React from 'react';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// app
import ContentWrapper from '../../components/Content/ContentWrapper';
import ContentHeader from '../../components/Content/ContentHeader';
import ContentFilter from '../../components/Content/ContentFilter';
import ContentData from '../../components/Content/ContentData';
import Button from '../../components/Button';
import Box from '../../components/Box';
import HeaderTitle from '../../components/Title/HeaderTitle';
import FilterTitle from '../../components/Title/FilterTitle';
import ClientAdd from './clientAdd.container';
import ClientList from './clientList.container';
import { actions } from './client.reducer';

class ClientPage extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props, context) {
    super(props, context);

    this.state = {
      headerQuery: '',
      filterQuery: '',
    };
  }

  componentDidMount() {
    Modal.setAppElement('#app');
  }

  onNewClientHandler = () => this.props.showAddClient();

  render() {
    return (
      <ContentWrapper tag="article">
        { /* Header */ }
        <ContentHeader>
          <HeaderTitle
            title="CLIENTS"
            subtitle="6 clients"
          />

          <Box
            direction="row"
            justifyContent="between"
          >
            <Button
              width="175px"
              color="primary"
              label="ADD NEW CLIENT"
              onClick={this.onNewClientHandler}
            />
          </Box>
        </ContentHeader>

        { /* Filter */ }
        <ContentFilter>
          <FilterTitle text="FILTERS" />
        </ContentFilter>

        { /* Data */ }
        <ContentData>
          <ClientList />
        </ContentData>

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
