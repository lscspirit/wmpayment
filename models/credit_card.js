"use strict";

import check from "check-types";
import cc_valid from "card-validator";

import BaseModel from "~/models/base";

/**
 * Credit card types
 * @readonly
 * @enum {String}
 */
const CardTypes = {
  AMEX: "american-express",
  MC:   "master-card",
  JCB:  "jcb",
  VISA: "visa",
  DISCOVER: "discover"
};

export default class CreditCard extends BaseModel {
  /**
   * Credit Card
   *
   * @param  {Object}  attrs    attributes
   * @param  {String}  attrs.name         cardholder name
   * @param  {String}  attrs.number       card number
   * @param  {String}  attrs.expire_year  expiration year
   * @param  {String}  attrs.expire_month expiration month
   * @param  {String}  attrs.cvv          cvv/cvv2 code
   */
  constructor(attrs) {
    super();

    const _attrs = attrs || {};

    this._name   = _attrs.name ? _attrs.name.trim() : "";
    this._number = _attrs.number.trim();
    this._expire_year  = _attrs.expire_year.trim();
    this._expire_month = _attrs.expire_month.trim();
    this._cvv  = _attrs.cvv.trim();
    this._type = this._parseCardType();
  }

  //
  // Accessors
  //

  /**
   * Cardholder name
   * @return {String} name
   */
  get name()   { return this._name; }

  /**
   * Credit card number
   * @return {String} Card number
   */
  get number() { return this._number; }

  /**
   * Expiration Year
   * @return {String} expiration year
   */
  get expire_year()  { return this._expire_year; }

  /**
   * Expiration Month
   * @return {String} expiration Month
   */
  get expire_month() { return this._expire_month; }

  /**
   * CVV/CVV2 code
   * @return {String} cvv code
   */
  get cvv()  { return this._cvv; }

  /**
   * Card type
   * @see CardTypes
   * @return {String} card type
   */
  get type() { return this._type; }

  //
  // Serialize
  //

  toJSON() {
    return {
      name:   this.name,
      number: this.number,
      expire_year:  this.expire_year,
      expire_month: this.expire_month,
      cvv:  this.cvv,
      type: this.type
    };
  }

  //
  // Private Methods
  //

  /**
   * Parse the card number to get the card type
   * @return {String} credit card type; undefined if the card number is invalid
   */
  _parseCardType() {
    const parsed = cc_valid.number(this._number);
    return parsed.isValid ? parsed.card.type : undefined;
  }

  _validation() {
    // check name
    if (!check.nonEmptyString(this._name)) {
      this.errors.add("name", "must be a non-empty string");
    }

    // number is invalid if card type is not found
    if (!this._type) {
      this.errors.add("number", "invalid credit card number");
    }

    // check expiration year
    if (!cc_valid.expirationYear(this._expire_year).isValid) {
      this.errors.add("expire_year", "invalid expiration year");
    }

    // check expiration month
    if (!cc_valid.expirationMonth(this._expire_month).isValid) {
      this.errors.add("expire_month", "invalid expiration month");
    }

    // check cvv
    const max_cvv_len = this._type === CardTypes.AMEX ? 4 : 3; // AMEX cvv is 4 digits
    if (!cc_valid.cvv(this._cvv, max_cvv_len).isValid) {
      this.errors.add("cvv", "invalid cvv");
    }
  }
}

CreditCard.CardTypes = CardTypes;