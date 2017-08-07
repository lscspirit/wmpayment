"use strict";

export default class PaymentGateway {
  static get name() { return "base"; }

  /**
   * Make a credit payment through the gateway
   *
   * @param  {CreditCard} cc    credit card
   * @param  {Order}      order order
   * @param  {String}     desc  payment description
   * @return {Promise<Transaction>} promise that will be resolved with transaction record
   */
  static creditCardPayment(cc, order, desc) {
    throw new Error("Not implemented");
  }
}