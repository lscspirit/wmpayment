"use strict";

import "~/spec/test_helper";

import { factory } from "factory-girl";
import { expect } from "chai";

import BraintreeHelper from "~/server/helpers/braintree_helper";

describe("BraintreeHelper", function() {
  this.timeout(5000);

  describe("::generateClientToken()", function() {
    before(function() {
      this.operation = BraintreeHelper.generateClientToken();
    });

    it("returns a promise", function() {
      expect(this.operation).to.be.a("Promise");
    });

    it("resolves with a client token", function() {
      return this.operation.then(token => {
        expect(token).to.not.be.empty;
      });
    });
  });

  // The following spec uses static test nonce from Braintree sandbox
  // see: https://developers.braintreepayments.com/reference/general/testing/node
  describe("::createSale()", function() {
    before(function() {
      return factory.build("order_item", {}, {
        currencies: ["HKD", "JPY", "CNY"]
      }).then(order_item => this.order_item = order_item);
    });

    describe("with valid nonce", function() {
      before(function() {
        this.operation = BraintreeHelper.createSale("fake-valid-no-billing-address-nonce", this.order_item);
      });

      it("returns a promise", function() {
        expect(this.operation).to.be.a("Promise");
      });

      it("resolves with the transaction id", function() {
        return this.operation.then(transaction => {
          expect(transaction.id).to.not.be.empty;
        });
      });
    });
  });
});