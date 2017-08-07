"use strict";

import PaymentGateway from "./payment_gateway";
import PaypalHelper from "~/server/helpers/paypal_helper";
import Transaction from "~/models/transaction";

export default class PaypalGateway extends PaymentGateway {
  static get name() { return "paypal"; }

  static creditCardPayment(cc, order, desc) {
    return PaypalHelper.createCreditCardPayment(cc, order, desc).then(result => {
      return new Transaction(order, PaypalGateway.name, result.id);
    });
  }
}