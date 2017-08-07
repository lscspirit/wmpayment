"use strict";

import check from "check-types";

import BaseModel from "~/models/base";

const Currencies = {
  HKD: "HKD",
  USD: "USD",
  AUD: "AUD",
  EUR: "EUR",
  JPY: "JPY",
  CNY: "CNY"
};

export default class Order extends BaseModel {
  /**
   * Order item
   *
   * @param  {Object} attrs    attributes
   * @param  {String} attrs.name     customer name
   * @param  {String} attrs.phone    customer phone number
   * @param  {Number} attrs.amount   price of the order
   * @param  {String} attrs.currency currency code
   */
  constructor(attrs) {
    super();

    const _attrs = attrs || {};

    this._name  = _attrs.name  ? _attrs.name.trim() : "";
    this._phone = _attrs.phone ? _attrs.phone.trim() : "";
    this._amount   = _attrs.amount;
    this._currency = _attrs.currency;
  }

  //
  // Accessors
  //

  /**
   * Customer name
   * @return {String} name
   */
  get name() { return this._name; }

  /**
   * Customer phone
   * @return {String} phone number
   */
  get phone() { return this._phone; }

  /**
   * Item price
   * @return {Number} item price
   */
  get amount() { return this._amount; }

  /**
   * Price currency
   * @return {String} currency code
   */
  get currency() { return this._currency; }

  //
  // Serialize
  //

  toJSON() {
    return {
      name:     this.name,
      phone:    this.phone,
      amount:   this.amount,
      currency: this.currency
    };
  }

  //
  // Private Methods
  //

  _validation() {
    // check amount
    if (!check.positive(this._amount)) {
      this.errors.add("amount", "must be positive");
    }

    // check currency code
    if (!Currencies[this._currency]) {
      this.errors.add("currency", "unsupported currency");
    } else if (this._currency === Currencies.JPY && this._amount % 1 !== 0) {
      this.errors.add("amount", "amount in JPY must be an integer");
    }
  }
}

Order.Currencies = Currencies;