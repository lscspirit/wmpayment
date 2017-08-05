"use strict";

import check from "check-types";
import cc_valid from "card-validator";

import ModelErrors from "~/models/model_errors";

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

export default class CreditCard {
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
    this._name   = attrs.name;
    this._number = attrs.number;
    this._expire_year  = attrs.expire_year;
    this._expire_month = attrs.expire_month;
    this._cvv  = attrs.cvv;
    this._type = this._parseCardType();

    this._errors = new ModelErrors();

    // validate properties
    this._validate();
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
  // Public Methods
  //

  /**
   * Return whether properties of this credit card object are valid
   * @return {Boolean} true if valid
   */
  isValid() {
    return !this._errors.hasError();
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

  _validate() {
    // check name
    if (!check.nonEmptyString(this._name)) {
      this._errors.add("name", "must be a non-empty string");
    }

    // number is invalid if card type is not found
    if (!this._type) {
      this._errors.add("number", "invalid credit card number");
    }

    // check expiration year
    if (!cc_valid.expirationYear(this._expire_year).isValid) {
      this._errors.add("expire_year", "invalid expiration year");
    }

    // check expiration month
    if (!cc_valid.expirationMonth(this._expire_month).isValid) {
      this._errors.add("expire_month", "invalid expiration month");
    }

    // check cvv
    const max_cvv_len = this._type === CardTypes.AMEX ? 4 : 3; // AMEX cvv is 4 digits
    if (!cc_valid.cvv(this._cvv, max_cvv_len).isValid) {
      this._errors.add("cvv", "invalid cvv");
    }
  }
}

CreditCard.CardTypes = CardTypes;