"use strict";

import config from "config";
import braintree from "braintree";

const bt_config = config.get("braintree");
const gateway   = braintree.connect({
  environment: bt_config.mode === "production" ?
    braintree.Environment.Production : braintree.Environment.Sandbox,
  merchantId: bt_config.merchantId,
  publicKey:  bt_config.publicKey,
  privateKey: bt_config.privateKey
});

//
// Braintree Helper Class
//
export default class BraintreeHelper {
  /**
   * Generate a ClientToken to be used for creating a nonce in the client
   *
   * @return {Promise<String>} a promise that will be resolved with the ClientToken string
   */
  static generateClientToken() {
    return gateway.clientToken.generate().then(resp => resp.clientToken);
  }

  static createSale(client_nonce, item) {
    return gateway.transaction.sale({
      amount: item.amount.toString(),
      paymentMethodNonce: client_nonce,
      merchantAccountId: _merchantAccountForCurrency(item.currency),
      options: {
        submitForSettlement: true
      }
    }).then(result => {
      if (result.success) {
        return {
          id: result.transaction.id
        };
      } else {
        throw new Error(result.message);
      }
    });
  }
}

//
// Helper Methods
//

/**
 * Find the Braintree Merchant Account Id for the specified currency
 *
 * @param   {String} currency currency code
 * @return  {String} merchant account id
 * @throws  {Error}  when the currency is not supported
 */
function _merchantAccountForCurrency(currency) {
  const acct = bt_config.merchantAccounts[currency];
  if (!acct) throw new Error(`Currency '${currency}' not supported`);
  return acct;
}