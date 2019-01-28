import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Tab, TabList, TabPanel } from 'react-tabs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import {
  Note,
  DetailWrapper,
  DetailContent,
  EditorSection,
  TimelineSection,
} from './Components';
import Tabs from './Components/Tabs';
import PanelBoard from './Components/PanelBoard';
import { actions } from './orderDetail.reducer';
import ActivityContainer from './Components/Activity';
import OrderEditor from './Components/EditorContainer';
import OrderEditPane from './Components/OrderEditPane';
import {
  makeSelectOrder,
  makeGetLoadingState,
  selectOrderNoteContent,
  selectOrderActivities,
  selectIsOrderActivitiesLoading,
} from './orderDetail.selector';
import FlightInstructionsForm from './Components/FlightInstructionsForm';
import LoadingIndicator from '../../components/LoadingIndicator';

class OrderDetail extends Component {
  componentWillMount() {
    const { siteId, orderId } = this.props.route.match.params;
    const { getOrderDetail, getOrderActivities } = this.props;
    if (getOrderDetail) {
      getOrderDetail({ siteId, orderId });
    }
    if (getOrderActivities) {
      getOrderActivities({ siteId, orderId });
    }
  }

  handleOpenEditPopup = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const { openEdit } = this.props;
    if (openEdit) {
      openEdit();
    }
  }

  handleChangeOrderNote = (e) => {
    e.preventDefault();
    const { siteId, orderId } = this.props.route.match.params;

    const { submitNote, noteContent } = this.props;
    if (submitNote) {
      submitNote({ siteId, orderId, content: noteContent });
    }
  }

  render() {
    const {
      detailData,
      isDetailLoading,
      onChangeNote,
      noteContent,
      clearNote,
      updateOrderDetail,
      orderActivities,
      isLoadingActivities,
      getOrderActivities,
    } = this.props;

    const activities = orderActivities
      ? orderActivities.map((activity) => ({
        id: activity._id,
        title: activity.user.userFullName,
        createdDate: activity.createdAt,
        notes: activity.content,
      }))
      : [];

    return (
      <DetailWrapper>
        <DetailContent>
          <PanelBoard
            detailData={detailData}
            isDetailLoading={isDetailLoading}
            openEdit={this.handleOpenEditPopup}
            editOrderDetail={updateOrderDetail}
            getOrderActivities={getOrderActivities}
          />

          <Note>
            <Tabs>
              <TabList>
                <Tab>NEW NOTE</Tab>
                <Tab>FLIGHT INSTRUCTIONS</Tab>
              </TabList>

              <TabPanel>
                <EditorSection>
                  <OrderEditor
                    noteContent={noteContent}
                    clearNote={clearNote}
                    onChangeNote={onChangeNote}
                    submitNote={this.handleChangeOrderNote}
                  />
                </EditorSection>

                <TimelineSection>
                  {isLoadingActivities && <LoadingIndicator />}
                  {
                    !isLoadingActivities && orderActivities &&
                    <ActivityContainer
                      id="orderDetailActivity"
                      activities={activities}
                    />
                  }
                </TimelineSection>
              </TabPanel>

              <TabPanel>
                <FlightInstructionsForm />
              </TabPanel>
            </Tabs>
          </Note>
        </DetailContent>

        <OrderEditPane />
      </DetailWrapper>
    );
  }
}

OrderDetail.propTypes = {
  detailData: PropTypes.object,
  isDetailLoading: PropTypes.bool,
  onChangeNote: PropTypes.func,
  submitNote: PropTypes.func,
  noteContent: PropTypes.string,
  openEdit: PropTypes.func,
  clearNote: PropTypes.func,
  route: PropTypes.object,
  getOrderDetail: PropTypes.func,
  updateOrderDetail: PropTypes.func,
  getOrderActivities: PropTypes.func,
  orderActivities: PropTypes.arrayOf(PropTypes.object),
  isLoadingActivities: PropTypes.bool,
};

const mapDispatchToProps = (dispatch) => ({
  openEdit: () => dispatch(actions.showEditOrder()),
  submitNote: (data) => dispatch(actions.submitOrderNote(data)),
  onChangeNote: (text) => dispatch(actions.changeOrderNote(text)),
  clearNote: () => dispatch(actions.changeOrderNote('')),
  getOrderDetail: (data) => dispatch(actions.getOrderByIdRequest(data)),
  updateOrderDetail: (data) => dispatch(actions.updateOrderRequest(data)),
  getOrderActivities: (data) => dispatch(actions.getOrderActivities(data)),
});

const mapStateToProps = createStructuredSelector({
  isDetailLoading: makeGetLoadingState(),
  detailData: makeSelectOrder(),
  noteContent: selectOrderNoteContent(),
  orderActivities: selectOrderActivities(),
  isLoadingActivities: selectIsOrderActivitiesLoading(),
});

const withRedux = connect(mapStateToProps, mapDispatchToProps);

export default withRedux(OrderDetail);
