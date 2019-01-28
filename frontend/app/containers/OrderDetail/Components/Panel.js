import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import styled from 'styled-components';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import {
  PanelSummaryTitle,
  PanelSummaryWrapper,
  PanelSummaryTitleWrapper,
  PanelSummaryProgressWrapper,
  PanelSummaryProgress,
  PanelSummarySubTitle,
  PanelSummaryInfoWrapper,
  PanelExpandIcon,
  Label,
  Checkbox,
  EditButton,
  PanelTopSummaryWrapper,
} from '.';
import EditIcon from '../../../images/icons/edits.svg';
import { InfoContainer } from './InfoContainer';
import ExpansionPanel from './ExpansionPanel';
import CheckboxIcon from '../../../images/icons/fill_checkbox.svg';
import LoadingIndicator from '../../../components/LoadingIndicator';

class Panel extends Component {
  constructor(props) {
    super(props);

    this.panel = {
      detail: this.renderDetailPanel,
      option: this.renderOptionPanel,
    };

    this.state = {
      currentStatus: this.props.status || '',
      checkedValues: [],
      expanded: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { currentStatus } = this.state;
    if (nextProps && currentStatus !== nextProps.status) {
      this.setState(() => ({ currentStatus: nextProps.status }));
    }
  }

  getTotalItems = () => {
    const { options } = this.props;
    return options ? options.length : 0;
  }

  getCompletedItems = () => {
    const { currentStatus } = this.state;
    const { options } = this.props;
    return currentStatus && options ? this.findStatusIndex(options, currentStatus) + 1 : 0;
  }

  getLastCompletedItem = (lastIndex) => {
    const { options } = this.props;
    return options && lastIndex ? options[lastIndex - 1].text : '';
  }

  getCompletedPercentage = (completed, total) => completed && total ? ((completed / total) * 100).toFixed(0) : '0'

  handleChange = (value) => () => {
    const { currentStatus } = this.state;
    if (currentStatus !== value) {
      this.setState(() => ({ currentStatus: value }), this.handleAction);
    }
  }

  handleChangeExpand = (event, expanded) => {
    event.preventDefault();
    this.setState({ expanded });
  };

  handleAction = () => {
    const { currentStatus } = this.state;
    const { editOrderDetail, orderId, type, siteId } = this.props;

    if (editOrderDetail && orderId && type && currentStatus) {
      editOrderDetail({
        orderId,
        siteId,
        payload: {
          service: {
            type,
            status: currentStatus,
          },
        },
      });
    }
  }

  findStatusIndex = (options, filter) =>
    options.findIndex(({ value }) => filter.toLowerCase() === value.toLowerCase())

  renderByPanelType = () => {
    const { panelType } = this.props;
    return this.panel[panelType]();
  }

  renderOptionPanel = () => {
    const { options, title } = this.props;
    const { currentStatus } = this.state;
    const currentStatusIndex = currentStatus ? this.findStatusIndex(options, currentStatus) : -1;

    return (
      options &&
      options.map(({ value, text }) => (
        <div key={`${title}_${value}`}>
          <Label
            control={
              <Checkbox
                name="checkType"
                id="checkType"
                onChange={this.handleChange(value)}
                checked={this.findStatusIndex(options, value) <= currentStatusIndex}
                checkedIcon={<CheckboxIcon />}
              />
            }
            label={text}
          />
        </div>
      ))
    );
  }

  renderDetailPanel = () => {
    const { isDetailLoading, detailData } = this.props;
    return isDetailLoading || !detailData
    ? <LoadingIndicator />
    : (
      <InfoContainer
        data={detailData}
      />
    );
  }

  render() {
    const { title, subtitle, classes, enableEdit, openEdit } = this.props;
    const { expanded } = this.state;

    const totalItems = this.getTotalItems();
    const completedItems = this.getCompletedItems();
    const lastCompletedItem = this.getLastCompletedItem(completedItems) || 'Nothing Completed';
    const completedPercentage = this.getCompletedPercentage(completedItems, totalItems);

    return (
      <ExpansionPanel expanded={expanded} onChange={this.handleChangeExpand}>
        <ExpansionPanelSummary
          classes={{
            root: classes.root,
            content: classes.content,
          }}
        >
          <PanelSummaryWrapper>
            <PanelSummaryInfoWrapper>
              <PanelExpandIcon expanded={expanded}>
                <ExpandMoreIcon />
              </PanelExpandIcon>

              <PanelSummaryTitleWrapper>
                <PanelTopSummaryWrapper>
                  <PanelSummaryTitle>{title}</PanelSummaryTitle>
                  {
                    enableEdit &&
                    <EditButton onClick={openEdit}><EditIcon /></EditButton>
                  }
                </PanelTopSummaryWrapper>
                {
                  subtitle &&
                  <PanelSummarySubTitle>{`${completedItems} of ${totalItems} - ${lastCompletedItem}`}</PanelSummarySubTitle>
                }
              </PanelSummaryTitleWrapper>
            </PanelSummaryInfoWrapper>
          </PanelSummaryWrapper>

          {
            subtitle &&
            <PanelSummaryProgressWrapper>
              <PanelSummaryProgress width={`${completedPercentage}%`} />
            </PanelSummaryProgressWrapper>
          }
        </ExpansionPanelSummary>

        <ExpansionPanelDetails>
          <ExpansionPanelContent>
            {
              this.renderByPanelType()
            }
          </ExpansionPanelContent>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}

Panel.propTypes = {
  options: PropTypes.array,
  title: PropTypes.string,
  subtitle: PropTypes.bool,
  editOrderDetail: PropTypes.func,
  orderId: PropTypes.string,
  type: PropTypes.string,
  isDetailLoading: PropTypes.bool,
  detailData: PropTypes.object,
  classes: PropTypes.object,
  enableEdit: PropTypes.bool,
  openEdit: PropTypes.func,
  status: PropTypes.string,
  siteId: PropTypes.string,
  panelType: PropTypes.oneOf(['option', 'detail']).isRequired,
};

Panel.defaultProps = {
  enableEdit: false,
};

const ExpansionPanelContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

const summaryStyles = () => ({
  root: {
    padding: 0,
  },
  content: {
    flexDirection: 'column',
    margin: '12px 0 0 0',
  },
});

export default withStyles(summaryStyles)(Panel);
