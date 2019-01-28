/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

// vendor
import React from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { createStructuredSelector } from 'reselect';
import LinearProgress from '@material-ui/core/LinearProgress';

import ToastMessage from 'components/ToastMessage';

// app
import LoginPage from 'containers/LoginPage/Loadable';
import SignupPage from 'containers/SignupPage/Loadable';
import PasswordEmailPage from 'containers/PasswordEmailPage/Loadable';
import PasswordResetPage from 'containers/PasswordResetPage/Loadable';

import SiteMapPage, { socket } from 'containers/SiteMapPage';
import SharedSitePhotos from 'containers/SiteMediaPage/Shared';
import SharedSitePhotoDetail from 'containers/SitePhotoDetail/Shared';
import auth from '../../appApi/auth';
import LoadableAppContainer from './Loadable';
import { updateAuthenticatedUser } from './actions';
import { makeGetS3SyncInfo, makeGetS3SyncInfoState, makeGetS3Folder } from '../../appSelector/s3';
import makeGetLoading from '../../appSelector/loadingBar';
import { actions as s3Actions } from '../../appReducer/s3.reducer';
import { initSocketClient } from './SocketClient';

const { NODE_ENV } = process.env;
const isNotProduction = NODE_ENV !== 'production';

const StyledLinearProgress = styled(LinearProgress)`
  position: fixed !important;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
`;

const AppWrapper = styled.div`
  margin: 0 auto;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100%;
  min-height: 100vh;
`;

const DevelopmentMessage = styled.p`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 4;
  padding: 0.1rem;
  margin: 0.2rem auto;
  width: 425px;

  text-align: center;
  text-transform: uppercase;
  font-size: 0.8125rem;
  line-height: 1.2;

  background: hsla(341, 100%, 50%, 1.0);
  color: white;
`;

const BusyMessage = styled.p`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 4;
  padding: 0.1rem;
  margin: 0.2rem auto;
  width: 425px;

  text-align: center;
  text-transform: uppercase;
  font-size: 0.8125rem;
  line-height: 1.2;

  background: hsl(59, 100%, 50%, 1.0);
  color: black;
`;

const RoutesUnAuth = ({ from }) => (
  <Switch>
    <Route exact path="/login" component={LoginPage} />
    <Route exact path="/signup" component={SignupPage} />
    <Route exact path="/signup/:id" component={SignupPage} />
    <Route exact path="/reset-email" component={PasswordEmailPage} />
    <Route exact path="/reset-password/:token" render={(route) => <PasswordResetPage route={route} />} />
    <Route exact path="/shared/:siteId/map/:token" render={(route) => <SiteMapPage route={route} />} />
    <Route exact path="/shared/:siteId/media/:token" render={(route) => <SharedSitePhotos route={route} />} />
    <Route exact path="/shared/:siteId/areas/:areaId/media/:photoId/:token" render={(route) => <SharedSitePhotoDetail route={route} />} />
    <Route
      path=""
      render={() => (<Redirect
        to={{
          pathname: '/login',
          from,
        }}
      />)
      }
    />
    {/* <Route path="" component={LoginPage} /> */}
  </Switch>
);

RoutesUnAuth.propTypes = {
  from: PropTypes.string,
};

class App extends React.Component {

  constructor() {
    super();
    this.state = {
      isBusy: false,
    };
  }
  componentDidMount() {
    if (auth.loggedIn()) {
      const userInfo = auth.userInfo();
      this.props.updateAuthenticatedUser(userInfo);
      try {
        initSocketClient(socket, userInfo, (data) => this.setState({ isBusy: data.isBusy }));
      } catch (err) {
        console.log('error', err); // eslint-disable-line
      }
    }
  }


  componentWillReceiveProps(nextProps) {
    if (this.props.s3SyncInfo !== nextProps.s3SyncInfo && nextProps.s3SyncInfo) {
      this.updateSyncIndicator(nextProps);
    }
  }

  updateSyncIndicator(nextProps) {
    const { s3Folder: rabineS3Folder } = this.props;

    const options = {
      autoClose: false,
      hideProgressBar: true,
      pauseOnHover: true,
      onClose: () => {
        this.toastId = null;
      },
    };

    const {
      imageCount,
      videoCount,
      syncedPhotos,
      syncedVideos,
    } = nextProps.s3SyncInfo;

    const image = (imageCount === -1 ? 0 : imageCount);
    const video = (videoCount === -1 ? 0 : videoCount);
    const syncedImage = (syncedPhotos === -1 ? 0 : syncedPhotos);
    const syncedVideo = (syncedVideos === -1 ? 0 : syncedVideos);

    const total = image + video;
    const syncedTotal = syncedImage + syncedVideo;

    const title = `S3: ${rabineS3Folder}`;
    const content = `${syncedTotal}/${total} photos`;

    const Message = <ToastMessage content={content} title={title} synced={syncedTotal} total={total} />;

    if (!this.toastId) {
      this.toastId = toast(Message, options);
    } else {
      toast.update(this.toastId, { render: Message });
    }

    if (syncedTotal < total) {
      this.props.getS3SyncInfo(rabineS3Folder);
    } else {
      setTimeout(() => {
        toast.dismiss(this.toastId);
        this.toastId = null;
      }, 5000);
    }
  }

  render() {
    const { infoLoading } = this.props;

    return (
      <AppWrapper id="outer-container">
        <Helmet
          titleTemplate="%s - rabinesite"
          defaultTitle="rabinesite"
        >
          <meta name="description" content="A rabine site" />
        </Helmet>
        {isNotProduction && !this.state.isBusy && (
          <DevelopmentMessage>
            Attention! This instance is for development and testing purposes.
          </DevelopmentMessage>
        )}

        {this.state.isBusy && (
          <BusyMessage>
            THIS SITE IS CURRENTLY BEING WORKED ON
          </BusyMessage>
        )}

        { infoLoading ? <StyledLinearProgress color="secondary" /> : null }
        <ToastContainer autoClose={1500} hideProgressBar />
        { auth.loggedIn() ? <LoadableAppContainer /> : <RoutesUnAuth from={this.props.history.location.pathname} />}
      </AppWrapper>
    );
  }
}

App.propTypes = {
  s3Folder: PropTypes.string,
  s3SyncInfo: PropTypes.object,
  getS3SyncInfo: PropTypes.func,
  history: PropTypes.object,
  updateAuthenticatedUser: PropTypes.func,
  infoLoading: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  s3Folder: makeGetS3Folder(),
  s3SyncInfo: makeGetS3SyncInfo(),
  s3SyncInfoLoading: makeGetS3SyncInfoState(),
  infoLoading: makeGetLoading(),
});

const mapDispatchToProps = (dispatch) => ({
  getS3SyncInfo: (folder) => dispatch(s3Actions.getS3SyncInfoRequest(folder)),
  updateAuthenticatedUser: (user) => dispatch(updateAuthenticatedUser(user)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
