"use strict";

import CreditCard from "~/models/credit_card";
import PaypalGateway from "~/server/lib/gateways/payment_gateway";
import BraintreeGateway from "~/server/lib/gateways/braintree_gateway";

export default class PaymentProcessor {
  /**
   * Process a credit card payment
   *
   * @param  {CreditCard} cc    credit card
   * @param  {Order}      order order
   * @return {Promise<Transaction>} promise that will be resolved with transaction record
   */
  static processCreditCardPayment(cc, order) {
    let gateway = null;
    if (cc.type === CreditCard.CardTypes.AMEX) {
      // if credit card is AMEX, then use PayPal
      if (order.currency !== "USD") {
        return Promise.reject(new Error("Only 'USD' is allowed when using AMEX"));
      }

      gateway = PaypalGateway;
    } else if (["USD", "EUR", "AUD"].includes(order.currency)) {
      // if currency is USD, EUR or AUD, then use PayPal
      gateway = PaypalGateway;
    } else {
      // use Braintree for all other currencies
      gateway = BraintreeGateway;
    }

    // make the credit card payment
    return gateway.creditCardPayment(cc, order, "direct credit card payment");
  }
}