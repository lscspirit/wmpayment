"use strict";

import config from "config";
import paypal from "paypal-rest-sdk";

import CreditCard from "~/models/credit_card";

//
// Configure Paypal REST SDK
//

const paypal_config = config.get("paypal");
paypal.configure({
  mode: paypal_config.mode,
  client_id:     paypal_config.clientId,
  client_secret: paypal_config.clientSecret
});

//
// Paypal Helper Class
//
export default class PaypalHelper {
  /**
   * Make a credit card payment
   *
   * @param  {CreditCard} cc    credit card
   * @param  {Order}      item  order item
   * @param  {String}     desc  payment description
   * @return {Promise<Object>}
   */
  static createCreditCardPayment(cc, item, desc) {
    // split the name string into first and last name
    // assumption: the last part of the name is always the last name, and
    // the rest of the string is the first name
    const name_parts = cc.name.split(" ");
    const last_name  = name_parts.pop();
    const first_name = name_parts.length === 0 ? null : name_parts.join(" ");

    let payment_payload = {
      intent: "sale",
      payer: {
        payment_method: "credit_card",
        funding_instruments: [{
          credit_card: {
            number: cc.number,
            type: _convertToPaypalType(cc.type),
            expire_month: cc.expire_month.toString(),
            expire_year: cc.expire_year.toString(),
            cvv2: cc.cvv,
            first_name: first_name,
            last_name: last_name
          }
        }]
      },
      transactions: [{
        amount: {
          total: item.amount.toString(),
          currency: item.currency
        },
        description: desc
      }],
    };

    // return a promise as the paypal api call is async
    return new Promise((resolve, reject) => {
      paypal.payment.create(payment_payload, (error, payment) => {
        if (error) {
          reject(new Error(error.message));
        } else {
          resolve({
            id: payment.id,
            state: payment.state
          });
        }
      });
    });
  }
}

//
// Helper Methods
//

function _convertToPaypalType(type) {
  switch(type) {
    case CreditCard.CardTypes.AMEX:
      return "amex";
    case CreditCard.CardTypes.MC:
      return "mastercard";
    case CreditCard.CardTypes.JCB:
      return "jcb";
    case CreditCard.CardTypes.VISA:
      return "visa";
    case CreditCard.CardTypes.DISCOVER:
      return "discover";
    default:
      return type;
  }
}