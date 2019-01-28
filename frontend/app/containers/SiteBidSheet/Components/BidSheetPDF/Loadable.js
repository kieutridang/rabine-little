import Loadable from 'react-loadable';
import {
  compose,
  withState,
  withHandlers,
  lifecycle,
} from 'recompose';

import LoadingIndicator from 'components/LoadingIndicator/index';

import { doc } from './template';


const LoadableComponent = Loadable({
  loader: () => import('./index'),
  loading: LoadingIndicator,
});


const onChange = (props) => (code) => {
  props.setCode(code);
};


async function componentDidMount() {
  this.props.setCode(
      doc(
        this.props.values.textValues,
        this.props.values.color,
        this.props.values.checkboxValues.zones,
        this.props.values.checkboxValues.repairs,
        this.props.clientLogo,
        this.props.logoPermitted,
        this.props.siteDetail,
        this.props.zones,
        this.props.repairs,
        this.props.toggledYears,
        this.props.zoneMapScreenshot,
        this.props.screenshotRepairs,
        this.props.propertyScreenshot
      )
    );
}


export default compose(
  withState('code', 'setCode', ''),
  lifecycle({ componentDidMount }),
  withHandlers({
    onChange,
  }),
)(LoadableComponent);
