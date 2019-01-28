import Loadable from 'react-loadable';
import {
  compose,
  withState,
  withHandlers,
  lifecycle,
} from 'recompose';

import LoadingIndicator from 'components/LoadingIndicator';
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
      this.props.logoPermitted
    )
  );
}

export default compose(
  withState('code', 'setCode', ''),
  lifecycle({ componentDidMount }),
  withHandlers({ onChange }),
)(LoadableComponent);
