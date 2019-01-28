import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Tab, TabList, TabPanel } from 'react-tabs';

import { Activity } from '.';
import Tabs from './Tabs';
import Timeline from '../../../components/Timeline';
import TimelineItem from '../../../components/Timeline/TimelineItem';

const ActivityContainer = ({
  id,
  activities,
}) => (
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
                title={activity.title}
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
  );

ActivityContainer.propTypes = {
  id: PropTypes.string,
  activities: PropTypes.array,
};

export default ActivityContainer;
