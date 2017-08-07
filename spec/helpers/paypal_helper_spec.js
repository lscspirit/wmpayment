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

        // for the purpose of this spec, we exclude AMEX because it only supports USD
        const cc_prom    = factory.build("credit_card", {}, { excludeAmex: true });
        const order_prom = factory.build("order", {}, { currencies: ["USD", "EUR", "AUD"] });
        return Promise.all([cc_prom, order_prom]).then(result => {
          this.cc    = result[0];
          this.order = result[1];
        });
      });

      before(function() {
        // only make the actual call once for all the test below
        // because it is expensive to make the api call to paypal
        this.result = PaypalHelper.createCreditCardPayment(this.cc, this.order, this.desc);
      });

      it("returns a promise", function() {
        expect(this.result).to.be.a('Promise');
      });

      it("the promise will be resolved", function() {
        return expect(this.result).to.eventually.be.fulfilled;
      });

      it("resolves with the payment id", function() {
        return expect(this.result).to.eventually.have.property("id");
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

        const cc_prom    = factory.build("credit_card", { number: "1234567890" });
        const order_prom = factory.build("order", {}, { currencies: ["HKD", "USD"] });
        return Promise.all([cc_prom, order_prom]).then(result => {
          this.cc    = result[0];
          this.order = result[1];
        });
      });

      before(function() {
        // only make the actual call once for all the test below
        // because it is expensive to make the api call to paypal
        this.result = PaypalHelper.createCreditCardPayment(this.cc, this.order, this.desc);
      });

      it("returns a promise", function() {
        expect(this.result).to.be.a('Promise');
      });

      it("the promise will be rejected", function() {
        return expect(this.result).to.eventually.be.rejected;
      });
    });

    describe("with invalid order item", function() {
      before(function() {
        this.desc = chance.sentence();

        const cc_prom    = factory.build("credit_card");
        const order_prom = factory.build("order", { currency: "ABC" });
        return Promise.all([cc_prom, order_prom]).then(result => {
          this.cc    = result[0];
          this.order = result[1];
        });
      });

      before(function() {
        // only make the actual call once for all the test below
        // because it is expensive to make the api call to paypal
        this.result = PaypalHelper.createCreditCardPayment(this.cc, this.order, this.desc);
      });

      it("returns a promise", function() {
        expect(this.result).to.be.a('Promise');
      });

      it("the promise will be rejected", function() {
        return expect(this.result).to.eventually.be.rejected;
      });
    });
  });
});