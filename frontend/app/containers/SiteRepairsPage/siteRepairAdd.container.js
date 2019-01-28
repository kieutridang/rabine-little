// vendor
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { withFormik } from 'formik';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { FormattedMessage, injectIntl } from 'react-intl';
import MaskedInput from 'react-text-mask';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

// app
import messages from './messages';
import SlidingPane from '../../components/SlidePane';
import { Form, InputWrap, Input } from './Components/Form';
import { ErrorMessage } from './Components/ErrorMessage';
import { unitOptions, yearOptions } from '../Common/Options';
import { AddButton } from './Components/AddButton';
import LoadingIndicator from '../../components/LoadingIndicator';
import { makeSelectZoneOptions } from '../../appSelector/zones';
import { actions } from '../../appReducer/siteRepairs.reducer';
import {
  makeSelectSiteRepairError,
  makeSelectAddingSiteRepair,
  makeSelectIsOpenAddSiteRepair,
  selectFeatureType,
} from '../../appSelector/siteRepairs';
import { currencyFormat2Number } from '../../utils/number/numberUtils';

class SiteRepairAdd extends Component {

  componentDidMount() {
    this.props.clearSiteRepairError();
  }

  handleCloseDialog = () => {
    this.props.onRequestClose();
  }

  renderInput = (name, messageLabel, placeHolder) => {
    const {
      values,
      intl,
      touched,
      errors,
      handleChange,
      handleBlur,
    } = this.props;

    return (
      <InputWrap>
        <label htmlFor={`${name}`}>
          <FormattedMessage {...messageLabel} />
        </label>
        <Input
          name={`${name}`}
          id={`${name}`}
          type="text"
          placeholder={intl.formatMessage(placeHolder)}
          onChange={handleChange}
          onBlur={handleBlur}
          value={values[name]}
        />
        {touched[name] && errors[name] && <ErrorMessage>{errors[name]}</ErrorMessage>}
      </InputWrap>
    );
  };

  renderMaskedInput = (name, messageLabel, placeHolder, prefix) => {
    const {
      values,
      intl,
      touched,
      errors,
      handleChange,
      handleBlur,
    } = this.props;

    const numberMask = createNumberMask({
      prefix: prefix || '',
      suffix: '',
      allowDecimal: true,
    });

    return (
      <InputWrap>
        <label htmlFor={`${name}`}>
          <FormattedMessage {...messageLabel} />
        </label>
        <MaskedInput
          name={`${name}`}
          id={`${name}`}
          type="text"
          placeholder={intl.formatMessage(placeHolder)}
          onChange={handleChange}
          onBlur={handleBlur}
          value={values[name]}
          mask={numberMask}
          render={(ref, props) => (<Input innerRef={ref} {...props} />)}
        />
        {touched[name] && errors[name] && <ErrorMessage>{errors[name]}</ErrorMessage>}
      </InputWrap>
    );
  };

  renderSelect = (name, messageLabel, placeHolder, options = []) => {
    const {
      values,
      intl,
      touched,
      errors,
      handleChange,
      handleBlur,
    } = this.props;

    return (
      <InputWrap>
        <label htmlFor={`${name}`} >
          <FormattedMessage {...messageLabel} />
        </label>

        <select
          name={`${name}`}
          id={`${name}`}
          onChange={handleChange}
          onBlur={handleBlur}
          value={values[name]}
          placeholder={intl.formatMessage(placeHolder)}
        >
          {
            options.map(({ text, value }) => <option key={value} value={text}>{text}</option>)
          }
        </select>
        {touched[name] && errors[name] && <ErrorMessage>{errors[name]}</ErrorMessage>}
      </InputWrap>
    );
  };

  render() {
    const {
      serverError,
      isLoading,
      handleSubmit,
      isOpen,
      zoneOptions,
    } = this.props;

    const zones = (zoneOptions || []).map((i) => ({
      text: i.title,
      value: i._id,
    }));
    zones.unshift({
      text: '',
      value: null,
    });

    const units = [...unitOptions];
    units.unshift({
      text: '',
      value: null,
    });

    const years = [...yearOptions];
    years.unshift({
      text: '',
      value: null,
    });

    return (
      <SlidingPane
        isOpen={isOpen}
        title="Add Site Repair"
        onRequestClose={this.handleCloseDialog}
      >
        <Form onSubmit={handleSubmit}>
          {this.renderInput('title', messages.repairScopeLabel, messages.repairScopePlaceHolder)}
          {this.renderInput('qty', messages.qtyLabel, messages.qtyPlaceHolder)}
          {this.renderSelect('unit', messages.unitLabel, messages.unitPlaceHolder, units)}
          {this.renderMaskedInput('unitPrice', messages.unitPriceLabel, messages.unitPricePlaceHolder, '$ ')}
          {this.renderSelect('zone', messages.zoneLabel, messages.zonePlaceHolder, zones)}
          {this.renderSelect('year', messages.yearLabel, messages.yearPlaceHolder, years)}

          {
            serverError &&
            <ErrorMessage align="center">
              {serverError}
            </ErrorMessage>
          }
          {
            isLoading && <LoadingIndicator />
          }
          <AddButton><FormattedMessage {...messages.createSiteRepairButton} /></AddButton>
        </Form>
      </SlidingPane>
    );
  }
}

const createSiteRepairFormik = withFormik({
  mapPropsToValues: (props) => {
    const initialState = {
      // vendor
      intl: props.intl,
      // form
      title: props.title || '',
      qty: props.qty || '',
      unit: props.unit || unitOptions[0],
      unitPrice: props.unitPrice || '',
      zone: props.zone || unitOptions[0],
      year: props.year || '',
      siteId: props.siteId || '',
      type: 'Repair',
    };
    return initialState;
  },

  handleSubmit: (values, { props: { addSiteRepairRequest, featureType } }) => {
    const {
      title,
      qty,
      unit,
      unitPrice,
      zone,
      year,
      siteId,
      type,
    } = values;

    const siteRepairRequest = {
      title,
      qty,
      unit,
      unitPrice: currencyFormat2Number(unitPrice),
      zone,
      year,
      siteId,
      type,
      featureType,
    };

    addSiteRepairRequest(siteRepairRequest);
  },
});

const mapDispatchToProps = (dispatch) => ({
  addSiteRepairRequest: (siteRepair) => dispatch(actions.addSiteRepairsRequest(siteRepair)),
  clearSiteRepairError: () => dispatch(actions.clearSiteRepairError()),
  onRequestClose: () => dispatch(actions.closeAddSiteRepairPane()),
});

const mapStateToProps = createStructuredSelector({
  zoneOptions: makeSelectZoneOptions(),
  serverError: makeSelectSiteRepairError(),
  isLoading: makeSelectAddingSiteRepair(),
  isOpen: makeSelectIsOpenAddSiteRepair(),
  featureType: selectFeatureType(),
});

const withRedux = connect(mapStateToProps, mapDispatchToProps);

SiteRepairAdd.propTypes = {
  isOpen: PropTypes.bool,
  values: PropTypes.object,
  touched: PropTypes.object,
  errors: PropTypes.object,
  intl: PropTypes.object,
  serverError: PropTypes.string,
  isLoading: PropTypes.bool,
  zoneOptions: PropTypes.array,
  onRequestClose: PropTypes.func,
  handleChange: PropTypes.func,
  handleBlur: PropTypes.func,
  handleSubmit: PropTypes.func,
  clearSiteRepairError: PropTypes.func,
};

export default compose(
  injectIntl,
  withRedux,
  createSiteRepairFormik
)(SiteRepairAdd);
