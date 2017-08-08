"use strict";

import React from "react";
import PropTypes from "prop-types";
import { Row, Col } from "react-bootstrap";
import getSymbolFromCurrency from 'currency-symbol-map'

import Transaction from "~/models/transaction";

export default class TransactionDisplay extends React.PureComponent {
  render() {
    const tran = this.props.transaction;

    return (
      <div className="transaction-display">
        <Row>
          <Col xs={4} className="field">Id:</Col>
          <Col xs={3} className="value">{ tran.id }</Col>
        </Row>
        <Row>
          <Col xs={4} className="field">Name:</Col>
          <Col xs={3} className="value">{ tran.customerName }</Col>
        </Row>
        <Row>
          <Col xs={4} className="field">Phone:</Col>
          <Col xs={3} className="value">{ tran.customerPhone }</Col>
        </Row>
        <Row>
          <Col xs={4} className="field">Payment Gateway:</Col>
          <Col xs={3} className="value">{ tran.paymentGateway }</Col>
        </Row>
        <Row>
          <Col xs={4} className="field">Payment Reference:</Col>
          <Col xs={3} className="value">{ tran.paymentReference }</Col>
        </Row>
        <Row>
          <Col xs={4} className="field">Amount:</Col>
          <Col xs={3} className="value">
            { tran.currency }&nbsp;
            { getSymbolFromCurrency(tran.currency) }
            { tran.amount }
          </Col>
        </Row>
      </div>
    );
  }
}
TransactionDisplay.propTypes = {
  transaction: PropTypes.instanceOf(Transaction).isRequired
};
