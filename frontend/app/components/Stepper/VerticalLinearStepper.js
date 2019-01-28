// vendor
import React from 'react';
import PropTypes from 'prop-types';

// app
import Stepper from './Stepper';
import Step from './Step';
import StepLabel from './StepLabel';
import StepContent from './StepContent';
import SvgTimelineIcon from '../Icon/SvgTimeline';

const steps = [
  {
    order: 1,
    key: 'order_created',
    label: 'Order Created',
    status: 'completed',
  },
  {
    order: 2,
    key: 'flight_instructions_sent',
    label: 'Flight Instructions Sent',
    status: 'completed',
  },
  {
    order: 3,
    key: 'zone_map_created',
    label: 'Zone Map Created',
    status: 'completed',
  },
  {
    order: 4,
    key: 'drone_confirmed',
    label: 'Drone Confirmed',
    status: 'completed',
  },
  {
    order: 5,
    key: 'flight_completed',
    label: 'Flight Completed',
    status: 'in_progress',
  },
  {
    order: 6,
    key: 'defect_detection',
    label: 'Defect Detection',
    status: 'in_progress',
  },
  {
    order: 7,
    key: 'ready_for_review',
    label: 'Ready For Review',
    status: 'not_yet',
  },
  {
    order: 8,
    key: 'in_process',
    label: 'In Process',
    status: 'not_yet',
  },
  {
    order: 9,
    key: 'repair_map_complete',
    label: 'Repair Map Complete',
    status: 'not_yet',
  },
];

const VerticalLinearStepper = ({ showTitle }) => (
  <Stepper
    orientation="vertical"
    showAllContent
  >
    {
      steps.map((step) => (
        <Step key={step.key} icon={SvgTimelineIcon}>
          <StepLabel showTitle={showTitle} active>
            {step.label}
          </StepLabel>
          <StepContent>
            <p>Tell me why</p>
            <p>Tell me why</p>
          </StepContent>
        </Step>
      ))
    }
  </Stepper>
);

VerticalLinearStepper.propTypes = {
  showTitle: PropTypes.bool,
};

VerticalLinearStepper.defaultProps = {
  showTitle: false,
};

export default VerticalLinearStepper;
