import React from 'react';
import Stepper from './Stepper';
import Step from './Step';
import StepLabel from './StepLabel';

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

const HorizontalLinearStepper = () => {
  const activeStep = steps
    .sort((step, nextStep) => parseInt(step.order, 10) - parseInt(nextStep.order, 10))
    .filter((step) => step.status === 'in_progress')
    .shift();

  const activeStepIndex = steps.indexOf(activeStep);

  return (
    <Stepper activeStep={activeStepIndex}>
      {
        steps.map((step) => (
          <Step key={step.key}>
            <StepLabel>
              {step.label}
            </StepLabel>
          </Step>
        ))
      }
    </Stepper>
  );
};

export default HorizontalLinearStepper;
