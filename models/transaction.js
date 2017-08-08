"use strict";

import BaseModel from "~/models/base";

export default class Transaction extends BaseModel {
  /**
   * Create a Transaction
   *
   * @param  {Object|Order} attrs_or_order   attributes or an Order object
   * @param  {String} [gateway]       payment gateway
   * @param  {String} [gateway_ref]   payment reference code
   *
   * @example <caption>with attributes</caption>
   *   new Transaction({
   *     cust_name:  "John Doe",
   *     cust_phone: "123-4234",
   *     currency:   "USD",
   *     amount: 1232.02,
   *     payment_gateway: "paypal",
   *     payment_ref:     "dk3n2i9djl2h2"
   *   });
   *
   * @example <caption>with attributes</caption>
   *   new Transaction(order, "paypal", "dk3n2i9djl2h2");
   *
   * @constructor
   */
  constructor(attrs_or_order, gateway, gateway_ref) {
    super();

    let _attrs = null;
    if (arguments.length === 3) {
      _attrs = {
        cust_name:  attrs_or_order.name,
        cust_phone: attrs_or_order.phone,
        currency:   attrs_or_order.currency,
        amount:     attrs_or_order.amount,
        payment_gateway: gateway,
        payment_ref: gateway_ref
      };
    } else {
      _attrs = attrs_or_order || {};
    }

    this._id = _attrs.id;
    this._cust_name   = _attrs.cust_name;
    this._cust_phone  = _attrs.cust_phone;
    this._payment_ref = _attrs.payment_ref;
    this._payment_gateway = _attrs.payment_gateway;
    this._currency = _attrs.currency;
    this._amount   = _attrs.amount;
  }

  //
  // Accessors
  //

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