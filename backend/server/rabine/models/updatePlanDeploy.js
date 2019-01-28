import axios from 'axios';
import get from 'lodash/get';

import logger from 'utils/logger';

const droneKey = process.env.DRONE_KEY;

const _buildListURL = (url) => {
  return `https://public-api.dronedeploy.com/v2/${url}?api_key=${droneKey}`;
};

const _mapModels = (data = []) => {
  return data.map((item) => {
    const {
      id,
      name,
      location: { lat, lng },
      image_count: imageCount,
      date_creation: createdDate
    } = item;

    return {
      id,
      name,
      location: { lat, lng },
      imageCount,
      createdDate: new Date(createdDate)
    };
  });
};

const loadNextPaging = async (response, currentPlans = []) => {
  const nextPlans = await _mapModels(response.data);

  if (nextPlans && nextPlans.length > 0) {
    currentPlans.push(...nextPlans);
  }

  const link = get(response, 'headers.link');
  if (link) {
    const indexLast = link.indexOf('>');
    const nextUrl = link.substring(1, indexLast);
    return axios.get(nextUrl)
      .then(nextResponse => loadNextPaging(nextResponse, currentPlans));
  }

  return currentPlans;
};

// receive message from master process
process.on('message', async (message) => {
  const { existingPlans } = message;
  const url = _buildListURL('plans');

  axios.get(url)
    .then(response => loadNextPaging(response))
    .then(async (planDeploys) => {
      return planDeploys;
    })
    .then((planDeploys) => {
      process.send({ planDeploys, existingPlans });
    })
    .catch((err) => {
      logger.info('There is error when receiving plans', err);
    });

});

process.on('exit', (info) => {
  logger.info('exiting update plan deploy:', info);
});
