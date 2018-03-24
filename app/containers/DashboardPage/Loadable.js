/**
 * Asynchronously loads the component for DashboardPage
 */
import Loadable from 'react-loadable';

import LoadingIndicator from 'components/LoadingIndicator';

export default Loadable({
  loader: () => import('.'),
  loading: LoadingIndicator,
});
