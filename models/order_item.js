"use strict";

import check from "check-types";

import ModelErrors from "~/models/model_errors";

const Currencies = {
  HKD: "HKD",
  USD: "USD",
  AUD: "AUD",
  EUR: "EUR",
  JPY: "JPY",
  CNY: "CNY"
};

export default class OrderItem {
  /**
   * Order item
   *
   * @param  {Object} attrs    attributes
   * @param  {Number} attrs.amount   price of the order
   * @param  {String} attrs.currency currency code
   */
  constructor(attrs) {
    this._amount   = attrs.amount;
    this._currency = attrs.currency;

    this._errors = new ModelErrors();

    // validate properties
    this._validate();
  }

  //
  // Accessors
  //

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
  // Private Methods
  //

  _validate() {
    // check amount
    if (!check.positive(this._amount)) {
      this._errors.add("amount", "must be positive");
    }

    // check currency code
    if (!Currencies[this._currency]) {
      this._errors.add("currency", "unsupported currency");
    } else if (this._currency === Currencies.JPY && this._amount % 1 !== 0) {
      this._errors.add("amount", "amount in JPY must be an integer");
    }
  }
}

OrderItem.Currencies = Currencies;