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
   * @param  {String} attrs.amount   price of the order
   * @param  {String} attrs.currency currency code
   */
  constructor(attrs) {
    super();

    const _attrs = attrs || {};

    this._name  = _attrs.name  ? _attrs.name.trim() : "";
    this._phone = _attrs.phone ? _attrs.phone.trim() : "";
    this._amount   = _attrs.amount.toString().trim();
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
  get amount() { return parseFloat(this._amount); }

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
    // check name
    if (this._name.length <= 3) {
      this.errors.add("name", "must be longer than 3 characters");
    }

    // check phone number
    if (!this._phone.match(/^(?!-)(?!.*--)^(?:\+\d+\ ?)?(?:\(\d+\)\ ?)?\d[\d\-\ ]{4,}\d\ *(?:,?\ *(?:(?:ext\.?\ *|x))?\d+)?$/i)) {
      this.errors.add("phone", "not a valid phone number");
    }

    // check amount
    if (!this._amount.match(/^\d+(?:\.\d{1,2})?$/)) {
      this.errors.add("amount", "must be a positive number");
    }

    // check currency code
    if (!Currencies[this._currency]) {
      this.errors.add("currency", "unsupported currency");
    } else if (this._currency === Currencies.JPY && this.amount % 1 !== 0) {
      this.errors.add("amount", "amount in JPY must be an integer");
    }
  }
}

Order.Currencies = Currencies;