import React from 'react';
import PropTypes from 'prop-types';
import ReactPaginate from 'react-paginate';

class Pagination extends React.Component { // eslint-disable-line
  render() {
    const { totalPages, pageChanged, forcePage } = this.props;
    return (
      <ReactPaginate
        pageCount={totalPages}
        previousLabel={<span className="fa fa-chevron-left" />}
        nextLabel={<span className="fa fa-chevron-right" />}
        onPageChange={pageChanged}
        forcePage={forcePage}
      />
    );
  }
}

Pagination.propTypes = {
  totalPages: PropTypes.number,
  forcePage: PropTypes.number,
  pageChanged: PropTypes.func,
};

export default Pagination;
