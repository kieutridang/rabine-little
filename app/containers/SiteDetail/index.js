// vendor
import React, { Component, PropTypes } from 'react';
// import Steps from 'rc-steps';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

// app
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import reducer from './reducer';
import saga from './saga';
import * as select from './selector';
import * as actions from './actions';

// component
// import Button from '../../components/Button';
import HeaderTitle from '../../components/Title/HeaderTitle';
import Editor from './Components/EditorContainer';
import { DetailWrapper, DetailHeader, DetailContent,
  DetailInfo, TitleDetail, EditButton,
  Note, EditorButton,
  Activity } from './Components';
import { InfoContainer } from './Components/InfoContainer';
import EditIcon from '../../images/icons/edits.svg';
  // import { mapDispatchToProps } from '../DronePartnerPage/components/AddDronePatnerPane';
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

class SiteDetail extends Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    getSiteDetail: PropTypes.func,
    route: PropTypes.any,
    detailData: PropTypes.any,
    isDetailLoading: PropTypes.bool,
  }

  constructor() {
    super();
    this.state = { };
  }

  componentWillMount() {
    const siteId = this.props.route.match.params.siteId;
    this.props.getSiteDetail(siteId);
  }

  render() {
    const { detailData, isDetailLoading } = this.props;

    return (
      <DetailWrapper>
        <DetailHeader>
          <HeaderTitle
            title="Naperville Home Depo"
            subtitle="BV-10212"
          />
          {/* <Steps current={1}>
            <Steps.Step title="first" />
            <Steps.Step title="second" />
            <Steps.Step title="third" />
          </Steps> */}
        </DetailHeader>

        <DetailContent>
          <DetailInfo>
            <TitleDetail>
              Details
              <EditButton ><EditIcon /></EditButton>
            </TitleDetail>
            {!isDetailLoading && <InfoContainer data={detailData} />}
          </DetailInfo>
          <Note>
            <Editor />
            <EditorButton>
              <button
                className="primary"
                onClick={this.saveHandler}
              >SAVE</button>
              <button
                className="secondary"
                onClick={this.cancelHandler}
              >CANCEL</button>
            </EditorButton>
          </Note>
          <Activity>
            {/* <Steps current={1}>
              <Steps.Step title="first" />
              <Steps.Step title="second" />
              <Steps.Step title="third" />
            </Steps> */}
          </Activity>
        </DetailContent>
      </DetailWrapper>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  isDetailLoading: select.IsLoadingDetail(),
  detailData: select.DetailData(),
});

const mapDispatchToProps = (dispatch) => ({
  getSiteDetail: (id) => dispatch(actions.fetchDetail(id)),
});

const withRedux = connect(mapStateToProps, mapDispatchToProps);
const withReducer = injectReducer({ key: 'siteDetail', reducer });
const withSaga = injectSaga({ key: 'siteDetail', saga });

export default compose(
  withReducer,
  withSaga,
  withRedux,
)(SiteDetail);
