"use strict";

import React from "react";
import { Row, Col } from "react-bootstrap";

import server from "~/client/helpers/server_client";
import PaymentFormContainer from "~/client/components/payment_form";
import TransactionDisplay from "~/client/components/transaction_display";
import lightbox from "~/client/components/lightbox";

export default class AppContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lightbox: null
    };

    this._submitPayment = this._submitPayment.bind(this);
    this._onLbClose = this._onLbClose.bind(this);
  }

  render() {

    return (
      <div>
        { this.state.lightbox }
        <Row>

        </Row>
        <Row>
          <Col sm={6} smOffset={3}>
            <PaymentFormContainer onSubmit={this._submitPayment}/>
          </Col>
        </Row>
      </div>
    );
  }

  /**
   * Submit a payment
   * @param  {Order}      order order
   * @param  {CreditCard} cc    credit card
   * @return {Promise<Transaction>}
   */
  _submitPayment(order, cc) {
    const prom = server.client.createPayment(order, cc);

    // display result in lightbox
    prom.then(transaction => {
      let LbComp = lightbox(TransactionDisplay);
      this.setState({
        lightbox: <LbComp transaction={transaction}
          lbMessage="Payment Successful"
          onClose={this._onLbClose}/>
      });
    }, () => {});

    return prom;
  }

  _onLbClose() {
    this.setState({
      lightbox: null
    });
  }
}