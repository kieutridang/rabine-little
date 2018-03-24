/* eslint-disable react/sort-comp */
import React from 'react';

/*  */
export class RootComponent extends React.Component {
  mounted = false;
  unsubscribeEvents = [];
  subscribeEvents = [];

  componentDidMount() {
    this.mounted = true;
    this.subscribeEvents.forEach((subscribe) => subscribe());
  }

  componentWillUnmount() {
    this.mounted = false;
    this.unsubscribeEvents.forEach((unsubscribe) => unsubscribe());
  }

  setState(newState) {
    if (this.mounted) {
      super.setState(newState);
    }
  }

  safeUpdate() {
    if (this.mounted) {
      this.forceUpdate();
    }
  }

  addUnsubscribeEvent(unsubscribeEvent) {
    this.unsubscribeEvents.push(unsubscribeEvent);
  }

  addSubscribeEvent(subscribeEvent) {
    this.subscribeEvents.push(subscribeEvent);
  }
}

export default RootComponent;
