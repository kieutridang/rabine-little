import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Drawer from '@material-ui/core/Drawer';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import moment from 'moment';

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

import { toFeet } from '../../../utils/number/numberUtils';
import { FormTitle } from '../Popup/styled/StyledForm';
import FormRow from '../Popup/styled/FormRow';
import FormColumn from '../Popup/styled/FormColumn';
import FormLabel from '../Popup/styled/FormLabel';
import FormRowContent from '../Popup/styled/FormRowContent';
import CommentList from '../MapControls/CommentList';
import CommentEditor from '../MapControls/CommentEditor';
import { ContentPaneBody, ContentPane, ContentPaneEditor } from '../MapControls/CommentPane';

const styles = () => ({
  drawerPaper: {
    width: '22.875rem',
    left: '15.625rem',
    backgroundColor: '#212223',
    opacity: 0.95,
    zIndex: 1500,
  },
});

class ZoneInfoSideMenu extends Component {
  state = {
    open: !!this.props.showSharedRepairInfo,
    activeTab: 'info',
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
              {`COMMENTS (${comments.length})`}
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
    } = this.props;

    return (
      <ContentPane fullWidth>
        <ContentPaneBody>
          <CommentList
            comments={comments}
            enableDelete={false}
          />
        </ContentPaneBody>

        <ContentPaneEditor>
          <CommentEditor
            readOnly={readOnly}
            id={repairId}
          />
        </ContentPaneEditor>
      </ContentPane>
    );
  }

  renderInfo = () => {
    const { activeTab } = this.state;
    if (activeTab !== 'info') {
      return null;
    }

    const {
      _id: repairId,
      data,
      readableArea,
      readableDistance,
    } = this.props;

    const areaSqFeet = toFeet(readableArea.metric).toFixed(2);
    const perimeterFeet = toFeet(readableDistance.metric).toFixed(2);

    const {
      properties: {
        createdAt,
        updatedAt,
        title,
        surfaceType,
        trafficType,
        pci,
      },
    } = data;

    const createdDate = createdAt ? moment(createdAt).fromNow() : '---';
    const updatedDate = updatedAt ? moment(updatedAt).fromNow() : '---';

    return (
      <SideMenuContentWrapper>
        <ImageSlider repairId={repairId} />

        <SideMenuInfoContentContainer>
          <FormTitle>ZONE INFORMATION</FormTitle>

          <FormRow>
            <FormColumn hasMargin>
              <FormLabel info labelColumn fontSize="0.75rem">ZONE NAME</FormLabel>
              <FormRowContent info noMargin>{title || 'Not set'}</FormRowContent>
            </FormColumn>

            <FormColumn hasMargin>
              <FormLabel info labelColumn fontSize="0.75rem">SURFACE TYPE</FormLabel>
              <FormRowContent info noMargin>{surfaceType || 'Not set'}</FormRowContent>
            </FormColumn>
          </FormRow>

          <FormRow>
            <FormColumn hasMargin>
              <FormLabel info labelColumn fontSize="0.75rem">PCI</FormLabel>
              <FormRowContent info noMargin>{pci || 'Not set'}</FormRowContent>
            </FormColumn>

            <FormColumn hasMargin>
              <FormLabel info labelColumn fontSize="0.75rem">TRAFFIC TYPE</FormLabel>
              <FormRowContent info noMargin>{trafficType || 'Not set'}</FormRowContent>
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

ZoneInfoSideMenu.propTypes = {
  showSharedRepairInfo: PropTypes.bool,
  closeSideMenuSharedMap: PropTypes.func,
  classes: PropTypes.object,
  data: PropTypes.object,
  readableArea: PropTypes.object,
  readableDistance: PropTypes.object,
  readOnly: PropTypes.bool,
  _id: PropTypes.string,
};

const comments = [
  {
    id: '123',
    authorName: 'Nichol',
    comment: 'i want to test 1',
    createdDate: '2018-07-29T18:31:20.568Z',
  },
  {
    id: '124',
    authorName: 'Nichol',
    comment: 'i want to test 2',
    createdDate: '2018-07-29T18:31:20.568Z',
  },
  {
    id: '125',
    authorName: 'Nichol',
    comment: 'i want to test 3',
    createdDate: '2018-07-29T18:31:20.568Z',
  },
  {
    id: '126',
    authorName: 'Nichol',
    comment: 'i want to test 4',
    createdDate: '2018-07-29T18:31:20.568Z',
  },
];

export default withStyles(styles)(ZoneInfoSideMenu);
