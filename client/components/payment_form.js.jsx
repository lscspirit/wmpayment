"use strict";

import React from "react";
import PropTypes from "prop-types";
import { Map } from "immutable";
import ImmutablePropTypes from "react-immutable-proptypes";
import {
  Form, FormGroup, FormControl,
  Col, Row, ControlLabel, Panel,
  Button, HelpBlock, Alert
} from "react-bootstrap";

import { ModelErrors } from "~/models/base";
import Order from "~/models/order";
import CreditCard from "~/models/credit_card";

class PaymentForm extends React.PureComponent {
  constructor(props) {
    super(props);

    this._buildOrderSection = this._buildOrderSection.bind(this);
    this._buildCreditCardSection = this._buildCreditCardSection.bind(this);
  }

  render() {
    const error_msg = this.props.errorMessage ? (
      <Alert bsStyle="danger">
        { this.props.errorMessage }
      </Alert>
    ) : null;

    const button_content = this.props.loading ? (
      <span>
        <span className="fa fa-spinner fa-spin fa-fw" style={{marginRight: 5}}/>
        Processing
      </span>
    ) : "Submit";

    return (
      <Panel header="Payment Form" bsStyle="primary">
        { error_msg }
        { this._buildOrderSection() }
        { this._buildCreditCardSection() }

        <Row>
          <Col sm={12}>
            <Button bsStyle="primary"
              disabled={ this.props.loading }
              onClick={ this.props.onSubmit } block>
              { button_content }
            </Button>
          </Col>
        </Row>
      </Panel>
    );
  }

  _buildOrderSection() {
    const name_errors  = this.props.orderErrors.get("name");
    const phone_errors = this.props.orderErrors.get("phone");
    const currency_errors = this.props.orderErrors.get("currency");
    const amount_errors   = this.props.orderErrors.get("amount");

    return (
      <Form>
        <FormGroup controlId="name" validationState={ name_errors.length > 0 ? "error" : null }>
          <ControlLabel>Name</ControlLabel>
          <FormControl type="input" disabled={ this.props.loading }
            value={ this.props.order.get("name") }
            onChange={ this.props.onChange.bind(null, "order", "name") }
            placeholder="Name"/>
          <HelpBlock>{ name_errors.length > 0 ? name_errors.join(', ') : null }</HelpBlock>
        </FormGroup>
        <FormGroup controlId="phone" validationState={ phone_errors.length > 0 ? "error" : null }>
          <ControlLabel>Phone</ControlLabel>
          <FormControl type="input" disabled={ this.props.loading }
            value={ this.props.order.get("phone") }
            onChange={ this.props.onChange.bind(null, "order", "phone") }
            placeholder="Phone"/>
          <HelpBlock>{ phone_errors.length > 0 ? phone_errors.join(', ') : null }</HelpBlock>
        </FormGroup>
        <Row>
          <Col sm={4}>
            <FormGroup controlId="currency" validationState={ currency_errors.length > 0 ? "error" : null }>
              <ControlLabel>Currency</ControlLabel>
              <FormControl componentClass="select"
                disabled={ this.props.loading }
                value={ this.props.order.get("currency") }
                onChange={ this.props.onChange.bind(null, "order", "currency") }>
                <option value="">---</option>
                {
                  Object.keys(Order.Currencies).map(cur => {
                    return (<option key={cur} value={cur}>{cur}</option>);
                  })
                }
              </FormControl>
              <HelpBlock>{ currency_errors.length > 0 ? currency_errors.join(', ') : null }</HelpBlock>
            </FormGroup>
          </Col>
          <Col sm={8}>
            <FormGroup controlId="amount" validationState={ amount_errors.length > 0 ? "error" : null }>
              <ControlLabel>Amount</ControlLabel>
              <FormControl type="input"
                disabled={ this.props.loading }
                value={ this.props.order.get("amount") }
                onChange={ this.props.onChange.bind(null, "order", "amount") }
                placeholder="Amount"/>
              <HelpBlock>{ amount_errors.length > 0 ? amount_errors.join(', ') : null }</HelpBlock>
            </FormGroup>
          </Col>
        </Row>
      </Form>
    );
  }

  _buildCreditCardSection() {
    const yr_options = [<option key="select" value="">-- Year --</option>];
    let curr_yr = (new Date()).getFullYear();
    for (let i = 0; i < 20; i++) {
      yr_options.push(
        <option key={curr_yr} value={curr_yr}>{curr_yr}</option>
      );
      curr_yr++;
    }

    const name_errors   = this.props.ccErrors.get("name");
    const number_errors = this.props.ccErrors.get("number");
    const cvv_errors    = this.props.ccErrors.get("cvv");
    const expire_month_errors = this.props.ccErrors.get("expire_month");
    const expire_year_errors  = this.props.ccErrors.get("expire_year");

    return (
      <Form>
        <FormGroup controlId="cc_name" validationState={ name_errors.length > 0 ? "error" : null }>
          <ControlLabel>Cardholder Name</ControlLabel>
          <FormControl type="input"
            disabled={ this.props.loading }
            value={ this.props.cc.get("name") }
            onChange={ this.props.onChange.bind(null, "cc", "name") }
            placeholder="Cardholder Name"/>
          <HelpBlock>{ name_errors.length > 0 ? name_errors.join(', ') : null }</HelpBlock>
        </FormGroup>
        <Row>
          <Col sm={8}>
            <FormGroup controlId="cc_number" validationState={ number_errors.length > 0 ? "error" : null }>
              <ControlLabel>Card Number</ControlLabel>
              <FormControl type="input"
                disabled={ this.props.loading }
                value={ this.props.cc.get("number") }
                onChange={ this.props.onChange.bind(null, "cc", "number") }
                placeholder="Card Number"/>
              <HelpBlock>{ number_errors.length > 0 ? number_errors.join(', ') : null }</HelpBlock>
            </FormGroup>
          </Col>
          <Col sm={4}>
            <FormGroup controlId="cvv" validationState={ cvv_errors.length > 0 ? "error" : null }>
              <ControlLabel>CVV/CVV2</ControlLabel>
              <FormControl type="input"
                disabled={ this.props.loading }
                value={ this.props.cc.get("cvv") }
                onChange={ this.props.onChange.bind(null, "cc", "cvv") }
                placeholder="CVV/CVV2"/>
              <HelpBlock>{ cvv_errors.length > 0 ? cvv_errors.join(', ') : null }</HelpBlock>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col sm={4}>
            <FormGroup controlId="exp_month" validationState={ expire_month_errors.length > 0 ? "error" : null }>
              <ControlLabel>Exp Month</ControlLabel>
              <FormControl componentClass="select"
                disabled={ this.props.loading }
                value={ this.props.cc.get("expire_month") }
                onChange={ this.props.onChange.bind(null, "cc", "expire_month") }>
                <option value="">-- Month --</option>
                <option value="01">01</option>
                <option value="02">02</option>
                <option value="03">03</option>
                <option value="04">04</option>
                <option value="05">05</option>
                <option value="06">06</option>
                <option value="07">07</option>
                <option value="08">08</option>
                <option value="09">09</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
              </FormControl>
              <HelpBlock>{ expire_month_errors.length > 0 ? expire_month_errors.join(', ') : null }</HelpBlock>
            </FormGroup>
          </Col>
          <Col sm={4}>
            <FormGroup controlId="exp_month" validationState={ expire_year_errors.length > 0 ? "error" : null }>
              <ControlLabel>Exp Year</ControlLabel>
              <FormControl componentClass="select"
                disabled={ this.props.loading }
                value={ this.props.cc.get("expire_year") }
                onChange={ this.props.onChange.bind(null, "cc", "expire_year") }>
                { yr_options }
              </FormControl>
              <HelpBlock>{ expire_year_errors.length > 0 ? expire_year_errors.join(', ') : null }</HelpBlock>
            </FormGroup>
          </Col>
        </Row>
      </Form>
    );
  }
}
PaymentForm.propTypes = {
  loading: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string,
  order: ImmutablePropTypes.map.isRequired,
  orderErrors: PropTypes.instanceOf(ModelErrors).isRequired,
  cc:    ImmutablePropTypes.map.isRequired,
  ccErrors: PropTypes.instanceOf(ModelErrors).isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default class PaymentFormContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = this._freshState();

    this._onValueChange = this._onValueChange.bind(this);
    this._onSubmit = this._onSubmit.bind(this);
    this._getOrder = this._getOrder.bind(this);
    this._getCreditCard = this._getCreditCard.bind(this);
  }

  render() {
    return <PaymentForm loading={ this.state.loading }
      errorMessage={ this.state.errorMessage }
      order={ this.state.order } orderErrors={ this.state.orderErrors }
      cc={ this.state.cc } ccErrors={ this.state.ccErrors }
      onChange={ this._onValueChange } onSubmit={ this._onSubmit }/>;
  }

  //
  // Private Methods
  //

  _freshState() {
    return {
      errorMessage: null,
      loading: false,
      order: Map({
        name:     "",
        phone:    "",
        currency: "",
        amount:   ""
      }),
      orderErrors: new ModelErrors(),
      cc: Map({
        name:   "",
        number: "",
        expire_year:  "",
        expire_month: "",
        cvv: ""
      }),
      ccErrors: new ModelErrors()
    };
  }

  _onValueChange(target, field, evt) {
    const m = target === "order" ? this.state.order : this.state.cc;
    this.setState({
      [target]: m.set(field, evt.target.value)
    });
  }

  _onSubmit() {
    const order = this._getOrder();
    const cc    = this._getCreditCard();

    // validates object
    order.validate();
    cc.validate();

    if (order.errors.isEmpty() && cc.errors.isEmpty()) {
      // if the form is valid, then send the request
      this.props.onSubmit(order, cc).then(transaction => {
        this.setState(this._freshState());
      }, err => {
        this.setState({
          errorMessage: err.error,
          loading: false,
          orderErrors: new ModelErrors(err.details.order || {}),
          ccErrors: new ModelErrors(err.details.cc || {})
        });
      });

      // set loading state and clear validation error
      this.setState({
        loading: true,
        orderErrors: new ModelErrors(),
        ccErrors: new ModelErrors()
      });
    } else {
      this.setState({
        errorMessage: "invalid order or credit card",
        loading: false,
        orderErrors: order.errors,
        ccErrors:    cc.errors
      });
    }
  }

  _getOrder() {
    return new Order({
      name:     this.state.order.get("name"),
      phone:    this.state.order.get("phone"),
      amount:   this.state.order.get("amount"),
      currency: this.state.order.get("currency")
    });
  }

  _getCreditCard() {
    return new CreditCard({
      name:   this.state.cc.get("name"),
      number: this.state.cc.get("number"),
      expire_year:  this.state.cc.get("expire_year"),
      expire_month: this.state.cc.get("expire_month"),
      cvv: this.state.cc.get("cvv")
    });
  }
}

PaymentFormContainer.propTypes = {
  onSubmit: PropTypes.func.isRequired
}