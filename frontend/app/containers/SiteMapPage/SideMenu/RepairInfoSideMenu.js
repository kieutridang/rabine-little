import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Drawer from '@material-ui/core/Drawer';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import find from 'lodash/find';
import moment from 'moment';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import {
  SideMenuHeader,
  SideMenuHeaderItem,
  SideMenuHeaderWrapper,
  CloseIcon,
  SideMenuHeaderLeft,
  SideMenuContentWrapper,
  SideMenuInfoContentContainer,
} from './elements';
import ImageSlider from './ImageSlider';
import { actions } from '../../../appReducer/repairComment.reducer';
import { makeSelectSiteRepairPhotos } from '../../../appSelector/siteRepairs';
import { makeSelectError, makeSelectComments } from '../../../appSelector/repairComment';

import { toFeet } from '../../../utils/number/numberUtils';
import { FormTitle } from '../Popup/styled/StyledForm';
import FormRow from '../Popup/styled/FormRow';
import FormColumn from '../Popup/styled/FormColumn';
import FormLabel from '../Popup/styled/FormLabel';
import FormRowContent from '../Popup/styled/FormRowContent';
import RepairInfoSideMenuComment from './RepairInfoSideMenuComment';

const styles = () => ({
  drawerPaper: {
    width: '22.875rem',
    left: '15.625rem',
    backgroundColor: '#212223',
    opacity: 0.95,
    zIndex: 1500,
  },
});

class RepairInfoSideMenu extends Component {
  state = {
    open: !!this.props.showSharedRepairInfo,
    activeTab: 'info',
  }

  componentWillMount() {
    const { getComments, _id: repairId } = this.props;
    if (getComments && repairId) getComments(repairId);
  }

  handleClose = () => {
    this.setState({ open: false });

    const { closeSideMenuSharedMap } = this.props;
    if (closeSideMenuSharedMap) {
      closeSideMenuSharedMap();
    }
  };

  switchTab = (tab) => () => {
    this.setState({ activeTab: tab });
  }

  renderHeader = () => {
    const { activeTab } = this.state;
    const { comments } = this.props;

    return (
      <SideMenuHeaderWrapper>
        <SideMenuHeader>
          <SideMenuHeaderLeft>
            <SideMenuHeaderItem
              className={activeTab === 'info' && 'active'}
              onClick={this.switchTab('info')}
            >
              INFO
            </SideMenuHeaderItem>
            <SideMenuHeaderItem
              className={activeTab === 'comments' && 'active'}
              onClick={this.switchTab('comments')}
            >
              {comments ? `COMMENTS (${comments.length})` : '0'}
            </SideMenuHeaderItem>
          </SideMenuHeaderLeft>

          <IconButton color="default" onClick={this.handleClose}>
            <CloseIcon />
          </IconButton>
        </SideMenuHeader>
      </SideMenuHeaderWrapper>
    );
  };

  renderComments = () => {
    const { activeTab } = this.state;
    if (activeTab !== 'comments') {
      return null;
    }

    const {
      _id: repairId,
      readOnly,
      comments,
    } = this.props;

    return (
      <RepairInfoSideMenuComment
        repairId={repairId}
        readOnly={readOnly}
        comments={comments}
      />
    );
  }

  renderInfo = () => {
    const { activeTab } = this.state;
    if (activeTab !== 'info') {
      return null;
    }

    const {
      data,
      layers,
      features,
      siteRepairs,
      readableArea,
      readableDistance,
      siteRepairPhotos,
    } = this.props;

    const areaSqFeet = toFeet(readableArea.metric).toFixed(2);
    const perimeterFeet = toFeet(readableDistance.metric).toFixed(2);

    const {
      properties: {
        _id,
        createdAt,
        updatedAt,
        zoneId,
        repairType,
        title,
        layerId,
      },
    } = data;

    const createdDate = createdAt ? moment(createdAt).fromNow() : '---';
    const updatedDate = updatedAt ? moment(updatedAt).fromNow() : '---';

    const siteRepair = find(siteRepairs, (s) => s.id === _id);
    const repairLayer = find(layers, (l) => l._id === layerId); // eslint-disable-line
    const zoneLayer = find(features, (f) => f._id === zoneId); // eslint-disable-line

    return (
      <SideMenuContentWrapper>
        <ImageSlider siteRepairPhotos={siteRepairPhotos} />

        <SideMenuInfoContentContainer>
          <FormTitle noBottomBorder>REPAIR DETAILS</FormTitle>
          <FormRow>
            <FormColumn>
              <FormLabel info labelColumn fontSize="0.75rem">REPAIR NAME</FormLabel>
              <FormRowContent info noMargin>{title}</FormRowContent>
            </FormColumn>
          </FormRow>

          <FormRow>
            <FormColumn hasMargin>
              <FormLabel info labelColumn fontSize="0.75rem">YEAR</FormLabel>
              <FormRowContent info noMargin>{repairLayer ? repairLayer.name : 'Not set'}</FormRowContent>
            </FormColumn>

            <FormColumn hasMargin>
              <FormLabel info labelColumn fontSize="0.75rem">TYPE OF REPAIR</FormLabel>
              <FormRowContent info noMargin>{repairType || 'Not set'}</FormRowContent>
            </FormColumn>
          </FormRow>

          <FormRow>
            <FormColumn hasMargin>
              <FormLabel info labelColumn fontSize="0.75rem">AREA</FormLabel>
              <FormRowContent info noMargin>{areaSqFeet} SF</FormRowContent>
            </FormColumn>

            <FormColumn hasMargin>
              <FormLabel info labelColumn fontSize="0.75rem">PERIMETER</FormLabel>
              <FormRowContent info noMargin>{perimeterFeet} FT</FormRowContent>
            </FormColumn>
          </FormRow>

          <FormRow>
            <FormColumn hasMargin>
              <FormLabel info labelColumn fontSize="0.75rem">TOTAL COST</FormLabel>
              <FormRowContent info noMargin>${siteRepair ? siteRepair.total : '0.00'}</FormRowContent>
            </FormColumn>

            <FormColumn hasMargin>
              <FormLabel info labelColumn fontSize="0.75rem">ZONE</FormLabel>
              <FormRowContent info noMargin>
                {zoneLayer && zoneLayer.title ? zoneLayer.title : 'Not set'}
              </FormRowContent>
            </FormColumn>
          </FormRow>

          <FormRow>
            <FormColumn hasMargin>
              <FormLabel info labelColumn fontSize="0.75rem">CREATED</FormLabel>
              <FormRowContent info noMargin>{createdDate}</FormRowContent>
            </FormColumn>

            <FormColumn hasMargin>
              <FormLabel info labelColumn fontSize="0.75rem">LAST UPDATED</FormLabel>
              <FormRowContent info noMargin>{updatedDate}</FormRowContent>
            </FormColumn>
          </FormRow>
        </SideMenuInfoContentContainer>
      </SideMenuContentWrapper>
    );
  }

  render() {
    const { open } = this.state;
    const { classes } = this.props;

    return (
      <Drawer
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        {this.renderHeader()}
        {this.renderInfo()}
        {this.renderComments()}
      </Drawer>
    );
  }
}

RepairInfoSideMenu.propTypes = {
  showSharedRepairInfo: PropTypes.bool,
  closeSideMenuSharedMap: PropTypes.func,
  classes: PropTypes.object,
  data: PropTypes.object,
  layers: PropTypes.array,
  features: PropTypes.array,
  siteRepairs: PropTypes.array,
  readableArea: PropTypes.object,
  readableDistance: PropTypes.object,
  readOnly: PropTypes.bool,
  _id: PropTypes.string,
  siteRepairPhotos: PropTypes.array,
  getComments: PropTypes.func,
  comments: PropTypes.array,
};

const mapStateToProps = createStructuredSelector({
  siteRepairPhotos: makeSelectSiteRepairPhotos(),
  comments: makeSelectComments(),
  errorComments: makeSelectError(),
});

const mapDispatchToProps = (dispatch) => ({
  getComments: (repairInstanceId) => dispatch(actions.getRepairCommentsRequest({ repairInstanceId })),
});

const withRedux = connect(mapStateToProps, mapDispatchToProps);

export default withRedux(withStyles(styles)(RepairInfoSideMenu));
