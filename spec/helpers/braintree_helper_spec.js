"use strict";

import "~/spec/test_helper";

import { factory } from "factory-girl";
import { expect } from "chai";

import BraintreeHelper from "~/server/helpers/braintree_helper";

const chance = require('chance').Chance();

// Braintree sandbox only accepts a fixed set of test card numbers
// see: https://developers.braintreepayments.com/reference/general/testing/node
const TEST_CARD_NUMBERS = [
  "6011111111111117",   // Discover
  "3530111333300000",   // JCB
  "5555555555554444",   // Mastercard
  "4500600000000061"    // Visa
];

const TEST_DECLINED_CARD_NUM = [
  "4000111111111115",   // Visa
  "5105105105105100",   // Mastercard
  "6011000990139424",   // Discover
  "3566002020360505"    // JCB
];

describe("BraintreeHelper", function() {
  this.timeout(5000);

  describe("::createCreditCardSale()", function() {
    before(function() {
      return factory.build("order", {}, {
        currencies: ["HKD", "JPY", "CNY"]
      }).then(order => {
        this.order = order;
      });
    });

    describe("with valid credit card", function() {
      before(function() {
        return factory.build("credit_card", {
          number: chance.pickone(TEST_CARD_NUMBERS)
        }, {
          excludeAmex: true
        }).then(cc => {
          this.cc = cc;
        });
      });

      before(function() {
        this.operation = BraintreeHelper.createCreditCardSale(this.cc, this.order);
      });

      it("returns a promise", function() {
        expect(this.operation).to.be.a("Promise");
      });

      it("resolves with the transaction id", function() {
        return expect(this.operation).to.eventually.have.property("id");
      });
    });

    describe("with declined credit card", function() {
      before(function() {
        return factory.build("credit_card", {
          number: chance.pickone(TEST_DECLINED_CARD_NUM)
        }, {
          excludeAmex: true
        }).then(cc => {
          this.cc = cc;
        });
      });

      before(function() {
        this.operation = BraintreeHelper.createCreditCardSale(this.cc, this.order);
      });

      it("returns a promise", function() {
        expect(this.operation).to.be.a("Promise");
      });

      it("rejects with a error message", function() {
        return this.operation.catch(error => {
          expect(error.message).to.match(/declined/i);
        });
      });
    });
  });
});