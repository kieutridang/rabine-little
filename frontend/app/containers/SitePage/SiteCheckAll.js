import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

const SiteCheckAll = ({ children }) => {
  const table = document.getElementsByTagName('table')[0];
  if (table) {
    const thead = table.getElementsByTagName('thead')[0];
    const tr = thead.getElementsByTagName('tr')[0];
    const th = tr.getElementsByTagName('th')[0];
    const span = th.getElementsByTagName('span')[0];
    return ReactDOM.createPortal(
      children,
      span
    );
  }
  return null;
};

SiteCheckAll.propTypes = {
  children: PropTypes.node,
};

export default SiteCheckAll;
