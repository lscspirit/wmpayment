"use strict";

import "~/spec/test_helper";

import { factory } from "factory-girl";
import { expect } from "chai";

import PaypalHelper from "~/server/helpers/paypal_helper";

const chance = require('chance').Chance();

describe("PaypalHelper", function() {
  this.timeout(15000);

  describe("::createCreditCardPayment()", function() {
    describe("with valid parameters", function() {
      before(function() {
        this.desc = chance.sentence();

        return factory.build("credit_card").then(cc => {
          this.cc = cc;
          return factory.build("order_item", {
            currency: chance.pickone(["HKD", "USD"])
          });
        }).then(order_item => {
          this.order_item = order_item;
        });
      });

      before(function() {
        // only make the actual call once for all the test below
        // because it is expensive to make the api call to paypal
        this.result = PaypalHelper.createCreditCardPayment(this.cc, this.order_item, this.desc);
      });

      it("returns a promise", function() {
        expect(this.result).to.be.a('Promise');
      });

      it("the promise will be resolved", function() {
        return this.result;
      });

      it("resolves with the payment id", function() {
        return this.result.then(payment => {
          expect(payment.id).to.not.be.empty;
        });
      });

      it("resolves with an approved payment", function() {
        return this.result.then(payment => {
          expect(payment.state).to.equal("approved");
        });
      });
    });

    describe("with invalid credit card", function() {
      before(function() {
        this.desc = chance.sentence();

        return factory.build("credit_card", { number: "1234567890" }).then(cc => {
          this.cc = cc;
          return factory.build("order_item", {
            currency: chance.pickone(["HKD", "USD"])
          });
        }).then(order_item => {
          this.order_item = order_item;
        });
      });

      before(function() {
        // only make the actual call once for all the test below
        // because it is expensive to make the api call to paypal
        this.result = PaypalHelper.createCreditCardPayment(this.cc, this.order_item, this.desc);
      });

      it("returns a promise", function() {
        expect(this.result).to.be.a('Promise');
      });

      it("the promise will be rejected", function(done) {
        this.result.catch(() => done());
      });
    });

    describe("with invalid order item", function() {
      before(function() {
        this.desc = chance.sentence();

        return factory.build("credit_card").then(cc => {
          this.cc = cc;
          return factory.build("order_item", {
            currency: "ABC"
          });
        }).then(order_item => {
          this.order_item = order_item;
        });
      });

      before(function() {
        // only make the actual call once for all the test below
        // because it is expensive to make the api call to paypal
        this.result = PaypalHelper.createCreditCardPayment(this.cc, this.order_item, this.desc);
      });

      it("returns a promise", function() {
        expect(this.result).to.be.a('Promise');
      });

      it("the promise will be rejected", function(done) {
        this.result.catch(() => done());
      });
    });
  });
});