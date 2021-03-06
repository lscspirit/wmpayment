"use strict";

import $ from "jquery";

import Transaction from "~/models/transaction";

let _client = null;
export default class ServerClient {
  /**
   * Initialize this client
   * (e.g. crediential, csrf tokens)\
   *
   * @param  {Object} opts options
   */
  static init(opts) {

  }

  /**
   * Get the singleton client instance
   * @type {ServerClient}
   */
  static get client() {
    if (_client) return _client;

    _client = new ServerClient();
    return _client;
  }

  //
  // API Methods
  //

  /**
   * Create a new payment
   *
   * @param  {Order}      order order
   * @param  {CreditCard} cc    credit card
   * @return {Promise<Transaction>} a promise that will be resolved with a
   *   transation
   */
  createPayment(order, cc) {
    const payload = { order, cc };
    const req = $.ajax({
      type: "POST",
      url: "/payments",
      data: JSON.stringify(payload),
      dataType: "json",
      contentType: "application/json; charset=utf-8"
    });

    return new Promise((resolve, reject) => {
      req
        .done(data => resolve(new Transaction(data)))
        .fail((xhr, status, err) => {
          if (xhr.status >= 400 && xhr.status < 500) {
            reject(xhr.responseJSON);
          } else {
            reject(new Error(status));
          }
        });
    });
  }

  /**
   * Search for a payment record
   *
   * @param  {String} id   transaction id
   * @param  {String} name customer name
   * @return {Promise<Transaction>} 
   */
  searchTransaction(id, name) {
    const payload = { id, name };
    const req = $.ajax({
      type: "POST",
      url: "/payments/search",
      data: JSON.stringify(payload),
      dataType: "json",
      contentType: "application/json; charset=utf-8"
    });

    return new Promise((resolve, reject) => {
      req
        .done(data => resolve(new Transaction(data)))
        .fail((xhr, status, err) => {
          if (xhr.status >= 400 && xhr.status < 500) {
            reject(xhr.responseJSON);
          } else {
            reject(new Error(status));
          }
        });
    });
  }
}