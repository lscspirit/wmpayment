"use strict";

import React from "react";
import { Row, Col } from "react-bootstrap";

import server from "~/client/helpers/server_client";
import PaymentFormContainer from "~/client/components/payment_form";
import SearchFormContainer from "~/client/components/search_form";
import TransactionDisplay, { TransactionNotFound } from "~/client/components/transaction_display";
import lightbox from "~/client/components/lightbox";

export default class AppContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lightbox: null
    };

    this._submitPayment = this._submitPayment.bind(this);
    this._submitSearch  = this._submitSearch.bind(this);
    this._onLbClose = this._onLbClose.bind(this);
  }

  render() {

    return (
      <div>
        { this.state.lightbox }
        <Row>
          <Col sm={6} smOffset={3}>
            <SearchFormContainer onSubmit={this._submitSearch}/>
          </Col>
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

  /**
   * Submit a payment record search
   * @param  {String} id   transaction id
   * @param  {String} name customer name
   * @return {Promise<Transaction>}
   */
  _submitSearch(id, name) {
    const prom = server.client.searchTransaction(id, name);

    // display result in lightbox
    prom.then(transaction => {
      let LbComp = lightbox(TransactionDisplay);
      this.setState({
        lightbox: <LbComp transaction={transaction}
          lbMessage="Payment Record Found"
          onClose={this._onLbClose}/>
      });
    }, err => {
      let LbComp = lightbox();
      this.setState({
        lightbox: <LbComp
          lbMessage="Payment Record Not Found"
          onClose={this._onLbClose}/>
      });
    });

    return prom;
  }

  _onLbClose() {
    this.setState({
      lightbox: null
    });
  }
}