// vendor
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import Steps from 'rc-steps';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { Tab, TabList, TabPanel } from 'react-tabs';
import moment from 'moment';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

// app
import injectSaga from 'common/injectSaga';
import injectReducer from 'common/injectReducer';
import reducer from './reducer';
import saga from './saga';
import * as select from './selector';
import * as actions from './actions';

// component
// import Button from '../../components/Button';
import Tabs from './Components/Tabs';
import Editor from './Components/EditorContainer';
import {
  DetailWrapper, DetailContent,
  DetailInfo, TitleDetail, EditButton,
  Note, EditorButton, EditorWrapper,
  Activity,
} from './Components';
import { InfoContainer } from './Components/InfoContainer';
import EditIcon from '../../images/icons/edits.svg';
import Timeline from '../../components/Timeline';
import TimelineItem from '../../components/Timeline/TimelineItem';
import EditDetailSlidePane from './Components/EditDetail';
// hoc

// import messages from './mesages';

import './style.css';

class ClientDetail extends Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    getClientDetail: PropTypes.func,
    route: PropTypes.any,
    detailData: PropTypes.any,
    isDetailLoading: PropTypes.bool,
    onChangeNote: PropTypes.func,
    submitNote: PropTypes.func,
    noteContent: PropTypes.string,
    openEdit: PropTypes.func,
    clearNote: PropTypes.func,
    editClientRequest: PropTypes.func,
    getClientNote: PropTypes.func,
    clientNoteData: PropTypes.any,
  };

  constructor() {
    super();
    this.state = {};
  }
  componentWillMount() {
    const clientId = this.props.route.match.params.clientId;
    this.props.getClientDetail(clientId);
    this.props.getClientNote(clientId);
  }

  render() {
    const { detailData, clientNoteData, isDetailLoading, onChangeNote, submitNote, noteContent, openEdit, clearNote, editClientRequest } = this.props;
    return (
      <DetailWrapper>
        <DetailContent>
          <DetailInfo>
            <TitleDetail>
              Details
              <EditButton onClick={openEdit}><EditIcon /></EditButton>
            </TitleDetail>
            {!isDetailLoading && <InfoContainer data={detailData} />}
          </DetailInfo>
          <Note>
            <Tabs>
              <TabList>
                <Tab>NEW NOTE</Tab>
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
                        document.dispatchEvent(new CustomEvent('clearDetailClientEditor'));
                        clearNote();
                      }}
                    >CANCEL</button>
                  </EditorButton>
                </EditorWrapper>
              </TabPanel>
            </Tabs>
          </Note>
          <Activity>
            <Tabs hasNoBorder hasNoBackground>
              <TabList>
                <Tab>Notes</Tab>
              </TabList>

              <TabPanel>
                <Timeline>
                  {
                    clientNoteData && clientNoteData.reduceRight((arr, last) => arr.concat(last), []).map((note) => (
                      <TimelineItem
                        key={note.id}
                        title={note.client}
                        createdAt={moment(note.createdDate).format('MMMM DD @ hh:mm A')}
                        container="card"
                      >
                        <p>
                          {note.notes}
                        </p>
                      </TimelineItem>
                    ))

                  }
                </Timeline>
              </TabPanel>
            </Tabs>
          </Activity>
        </DetailContent>
        <EditDetailSlidePane editClientRequest={editClientRequest} />
      </DetailWrapper>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  isDetailLoading: select.IsLoadingDetail(),
  detailData: select.DetailData(),
  noteContent: select.NoteContent(),
  clientNoteData: select.ClientNoteData(),
});

const mapDispatchToProps = (dispatch) => ({
  getClientDetail: (id) => dispatch(actions.fetchDetail(id)),
  getClientNote: (id) => dispatch(actions.fetchClientNote(id)),
  onChangeNote: (text) => dispatch(actions.changeNote(text)),
  editClientRequest: (client) => dispatch(actions.editClientRequest(client)),
  submitNote: () => dispatch(actions.submitNote()),
  openEdit: () => dispatch(actions.openEdit()),
  closeEdit: () => dispatch(actions.closeEdit()),
  clearNote: () => dispatch(actions.changeNote('')),
});

const withRedux = connect(mapStateToProps, mapDispatchToProps);
const withReducer = injectReducer({ key: 'clientDetail', reducer });
const withSaga = injectSaga({ key: 'clientDetail', saga });

export default compose(
  withReducer,
  withSaga,
  withRedux,
)(ClientDetail);
