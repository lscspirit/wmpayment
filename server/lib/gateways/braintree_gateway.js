"use strict";

import PaymentGateway from "./payment_gateway";
import BraintreeHelper from "~/server/helpers/braintree_helper";
import Transaction from "~/models/transaction";

export default class BraintreeGateway extends PaymentGateway {
  static get name() { return "braintree"; }

  static creditCardPayment(cc, order, desc) {
    return BraintreeHelper.createCreditCardSale(cc, order).then(result => {
      return new Transaction(order, BraintreeGateway.name, result.id);
    });
  }
}