// vendor
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import moment from 'moment';
import { createStructuredSelector } from 'reselect';
import { Tab, TabList, TabPanel } from 'react-tabs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import injectSaga from 'common/injectSaga';
import injectReducer from 'common/injectReducer';

import { rabineFetcher } from '../../appApi/fetcher/rabineFetcher';

// app
import reducer from './reducer';
import saga from './saga';
import * as select from './selector';
import * as actions from './actions';

// component
import Tabs from './Components/Tabs';
import HeaderTitle from '../../components/Title/HeaderTitle';
import Editor from './Components/EditorContainer';
import {
  DetailWrapper, DetailHeader, DetailContent,
  DetailInfo, TitleDetail, EditButton,
  Note, EditorButton, EditorWrapper,
  Activity,
} from './Components';
import { InfoContainer } from './Components/InfoContainer';
import EditIcon from '../../images/icons/edits.svg';
import Timeline from '../../components/Timeline';
import TimelineItem from '../../components/Timeline/TimelineItem';
import SiteStatus from './Components/SiteStatus';
import EditDetailSlidePane from './Components/EditDetail';

import { actions as dronePlanActions } from '../../appReducer/dronePlan.reducer';
import { actions as clientActions } from '../../appReducer/client.reducer';
import { makeGetClients } from '../../appSelector/client';
import { makeGetDronePlans } from '../../appSelector/dronePlan';
import { actions as s3Actions } from '../../appReducer/s3.reducer';
import { makeSelectS3Folders, makeSyncS3IsLoadingState } from '../../appSelector/s3';

import './style.css';

class SiteDetail extends Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props, context) {
    super(props, context);

    this.state = {
      mapShareLinkUrl: '',
      isMapShareLinkCopied: false,
      isMapShareLinkError: false,

      photosShareLinkUrl: '',
      isPhotosShareLinkCopied: false,
      isPhotosShareLinkError: false,
    };

    this.toastId = null;
  }

  componentWillMount() {
    const { siteId, token } = this.props.route.match.params;

    this.props.getSiteDetail(siteId, token);
    this.getMapShareLink();
    this.getPhotosShareLink();
  }

  getLocationLink = (path = '') =>
    `${window.location.protocol}//${window.location.host}${path}`;

  getMapShareLink = () => {
    const { siteId } = this.props.route.match.params;
    rabineFetcher.get(`site/${siteId}/map/share`)
      .then((response) => {
        const mapShareLinkUrl = this.getLocationLink(`/shared/${siteId}/map/${response.token}`);
        this.setState(() => ({ mapShareLinkUrl }));
      }).catch(() => {
        this.setState(() => ({ isMapShareLinkError: true }));
      });
  };

  getPhotosShareLink = () => {
    const { siteId } = this.props.route.match.params;
    rabineFetcher.get(`site/${siteId}/photos/share`)
      .then((response) => {
        const photosShareLinkUrl = this.getLocationLink(`/shared/${siteId}/media/${response.token}`);
        this.setState(() => ({ photosShareLinkUrl }));
      }).catch(() => {
        this.setState(() => ({ isPhotosShareLinkError: true }));
      });
  };

  syncFolderHandler = () => {
    const { detailData: { rabineS3Folder }, syncS3FolderHandler, syncS3IsLoading } = this.props;
    const { siteId } = this.props.route.match.params;

    if (!syncS3IsLoading) {
      syncS3FolderHandler(siteId, rabineS3Folder);
    }
  };

  handleOpenEditSide = () => {
    const { openEdit, getClientsRequest, getDronePlansRequest, getS3Folders } = this.props;
    if (openEdit) {
      openEdit();
      getClientsRequest();
      getDronePlansRequest();
      getS3Folders();
    }
  }

  render() {
    const {
      detailData,
      isDetailLoading,
      onChangeNote,
      submitNote,
      noteContent,
      clearNote,
      editSiteRequest,
      clients,
      dronePlans,
      s3Folders,
      s3SyncInfo,
      syncS3IsLoading,
    } = this.props;

    const {
      id,
      name = '',
      dronePlanName,
      activities,
    } = detailData;

    return (
      <DetailWrapper>
        <DetailHeader>
          <div style={{ gridArea: 'title' }}>
            <HeaderTitle
              title={name}
              subtitle={dronePlanName}
            />
          </div>
          <div style={{ gridArea: 'stepper', alignSelf: 'center' }}>
            <SiteStatus
              siteId={id}
            />
          </div>
        </DetailHeader>

        <DetailContent>
          <DetailInfo>
            <TitleDetail>
              Details
              <EditButton onClick={this.handleOpenEditSide}><EditIcon /></EditButton>
            </TitleDetail>
            {
              !isDetailLoading &&
                <InfoContainer
                  {...this.state}
                  className=""
                  mapShareLinkCopied={() => this.setState({ isMapShareLinkCopied: true })}
                  photosShareLinkCopied={() => this.setState({ isPhotosShareLinkCopied: true })}
                  data={detailData}
                  syncS3IsLoading={syncS3IsLoading}
                  syncFolder={this.syncFolderHandler}
                />
            }
          </DetailInfo>
          <Note>
            <Tabs>
              <TabList>
                <Tab>NEW NOTE</Tab>
                <Tab>NEW ORDER</Tab>
              </TabList>

              <TabPanel>
                <EditorWrapper>
                  <Editor
                    onChange={onChangeNote}
                    noteContent={noteContent}
                  />
                  <EditorButton>
                    <button
                      className={`primary ${noteContent === '' ? 'disabled' : null}`}
                      disabled={noteContent === ''}
                      onClick={submitNote}
                    >SAVE</button>
                    <button
                      className="secondary"
                      onClick={() => {
                        document.dispatchEvent(new CustomEvent('clearDetailSiteEditor'));
                        clearNote();
                      }}
                    >CANCEL</button>
                  </EditorButton>
                </EditorWrapper>
              </TabPanel>
              <TabPanel>
                <h2>Any content 2</h2>
              </TabPanel>
            </Tabs>
          </Note>
          <Activity>
            <Tabs hasNoBorder hasNoBackground>
              <TabList>
                <Tab>ACTIVITY</Tab>
              </TabList>

              <TabPanel>
                <Timeline componentId={id}>
                  {
                    activities && activities.reduceRight((arr, last) => arr.concat(last), []).map((activity) => (
                      <TimelineItem
                        key={activity.id}
                        title={activity.creator}
                        createdAt={moment(activity.createdDate).format('MMMM DD @ hh:mm A')}
                        container="card"
                      >
                        <p>
                          {activity.notes}
                        </p>
                      </TimelineItem>
                    ))

                  }
                </Timeline>
              </TabPanel>
            </Tabs>
          </Activity>
        </DetailContent>

        <EditDetailSlidePane
          s3SyncInfo={s3SyncInfo}
          editSiteRequest={editSiteRequest}
          clients={clients}
          dronePlans={dronePlans}
          s3Folders={s3Folders}
        />

      </DetailWrapper>
    );
  }
}

SiteDetail.propTypes = {
  getSiteDetail: PropTypes.func,
  route: PropTypes.any,
  detailData: PropTypes.object,
  isDetailLoading: PropTypes.bool,
  onChangeNote: PropTypes.func,
  submitNote: PropTypes.func,
  noteContent: PropTypes.string,
  openEdit: PropTypes.func,
  clearNote: PropTypes.func,
  editSiteRequest: PropTypes.func,
  clients: PropTypes.array,
  dronePlans: PropTypes.array,
  s3Folders: PropTypes.array,
  getClientsRequest: PropTypes.func,
  getDronePlansRequest: PropTypes.func,
  getS3Folders: PropTypes.func,
  s3SyncInfo: PropTypes.object,
  syncS3FolderHandler: PropTypes.func,
  syncS3IsLoading: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  isDetailLoading: select.IsLoadingDetail(),
  detailData: select.DetailData(),
  noteContent: select.NoteContent(),
  clients: makeGetClients(),
  dronePlans: makeGetDronePlans(),
  s3Folders: makeSelectS3Folders(),
  syncS3IsLoading: makeSyncS3IsLoadingState(),
});

const mapDispatchToProps = (dispatch) => ({
  getSiteDetail: (id, token) => dispatch(actions.fetchDetail(id, token)),
  onChangeNote: (text) => dispatch(actions.changeNote(text)),
  editSiteRequest: (site) => dispatch(actions.editSiteRequest(site)),
  submitNote: () => dispatch(actions.submitNote()),
  openEdit: () => dispatch(actions.openEdit()),
  closeEdit: () => dispatch(actions.closeEdit()),
  clearNote: () => dispatch(actions.changeNote('')),
  getClientsRequest: (filter) => dispatch(clientActions.getClientsRequest(filter)),
  getDronePlansRequest: () => dispatch(dronePlanActions.getDronePlansRequest()),
  getS3Folders: () => dispatch(s3Actions.getS3FoldersRequest()),
  syncS3FolderHandler: (siteId, rabineS3Folder) =>
    dispatch(s3Actions.syncS3FolderRequest({ siteId, rabineS3Folder })),
});

const withRedux = connect(mapStateToProps, mapDispatchToProps);
const withReducer = injectReducer({ key: 'siteDetail', reducer });
const withSaga = injectSaga({ key: 'siteDetail', saga });

export default compose(
  withReducer,
  withSaga,
  withRedux,
)(SiteDetail);
