"use strict";

import BaseModel from "~/models/base";

export default class Transaction extends BaseModel {
  constructor(attrs) {
    super();

    const _attrs = attrs || {};

    this._id = _attrs.id;
    this._cust_name   = _attrs.cust_name;
    this._cust_phone  = _attrs.cust_phone;
    this._payment_ref = _attrs.payment_ref;
    this._payment_gateway = _attrs.payment_gateway;
    this._currency = _attrs.currency;
    this._amount   = _attrs.amount;
  }

  /**
   * Transaction ID
   * @return {String} transaction id
   */
  get id() { return this._id; }

  /**
   * Customer name
   * @return {String} customer name
   */
  get customerName() { return this._cust_name; }

  /**
   * Customer phone number
   * @return {String} customer phone number
   */
  get customerPhone() { return this._cust_phone; }

  /**
   * Payment gateway reference code
   * @return {String} reference code
   */
  get paymentReference() { return this._payment_ref; }

  /**
   * Payment gateway
   * @return {String} payment gateway (e.g. paypal, braintree)
   */
  get paymentGateway() { return this._payment_gateway; }

  /**
   * Order currency
   * @return {String} currency code
   */
  get currency() { return this._currency; }

  /**
   * Order price
   * @return {Number} price amount
   */
  get amount() { return this._amount; }

  //
  // Serialize
  //

  toJSON() {
    return {
      id: this.id,
      cust_name:    this.customerName,
      cust_phone:   this.customerPhone,
      payment_ref:  this.paymentReference,
      payment_gateway: this.paymentGateway,
      currency: this.currency,
      amount:   this.amount
    };
  }
}