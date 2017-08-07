"use strict";

import sinon from "sinon";
import chai from "chai";
import { expect } from "chai";
import { factory } from "factory-girl";

import PaymentProcessor from "~/server/lib/payment_processor";
import PaypalGateway from "~/server/lib/gateways/payment_gateway";
import BraintreeGateway from "~/server/lib/gateways/braintree_gateway";

let sandbox;

describe("PaymentProcessor", function() {
  describe("::processCreditCardPayment()", function() {
    beforeEach(function() {
      sandbox = sinon.sandbox.create();
      // stub the gateways' creditCardPayment()
      this.paypal_cc    = sandbox.stub(PaypalGateway, "creditCardPayment").returns(Promise.resolve());
      this.braintree_cc = sandbox.stub(BraintreeGateway, "creditCardPayment").returns(Promise.resolve());
    });

    afterEach(function() {
      sandbox.restore();
    });

    describe("with AMEX credit card", function() {
      beforeEach(function() {
        return factory.build("credit_card", {}, { amex: true }).then(cc => {
          this.cc = cc;
        });
      });

      describe("in USD", function() {
        beforeEach(function() {
          return factory.build("order", { currency: "USD" }).then(order => {
            this.order = order;
          });
        });

        beforeEach(function() {
          this.result = PaymentProcessor.processCreditCardPayment(this.cc, this.order);
        });

        it("returns a promise", function() {
          expect(this.result).to.be.a("Promise");
        });

        it("uses the PayPal gateway", function() {
          expect(this.paypal_cc).to.have.been.calledOnce;
        });

        it("does not use the PayPal gateway", function() {
          expect(this.braintree_cc).to.not.have.been.called;
        });
      });

      describe("in non-USD", function() {
        beforeEach(function() {
          return factory.build("order", {}, {
            currencies: ["HKD", "AUD", "EUR", "JPY", "CNY"]
          }).then(order => {
            this.order = order;
          });
        });

        beforeEach(function() {
          this.result = PaymentProcessor.processCreditCardPayment(this.cc, this.order);
          this.result.catch(() => null);
        });

        it("returns a promise", function() {
          expect(this.result).to.be.a("Promise");
        });

        it("returns a rejected promise", function() {
          return expect(this.result).to.be.rejected;
        });

        it("returns a promise rejected with an Error", function() {
          return expect(this.result).to.be.rejectedWith(Error);
        });

        it("returns a promise rejected with an Error message", function() {
          return this.result.catch(err => {
            expect(err.message).to.equal("Only 'USD' is allowed when using AMEX");
          });
        });
      });
    });

    describe("with non-AMEX credit card", function() {
      beforeEach(function() {
        return factory.build("credit_card", {}, { excludeAmex: true }).then(cc => {
          this.cc = cc;
        });
      });

      describe("in USD/EUR/AUD", function() {
        beforeEach(function() {
          return factory.build("order", {}, {
            currencies: ["USD", "EUR", "AUD"]
          }).then(order => {
            this.order = order;
          });
        });

        beforeEach(function() {
          this.result = PaymentProcessor.processCreditCardPayment(this.cc, this.order);
        });

        it("returns a promise", function() {
          expect(this.result).to.be.a("Promise");
        });

        it("uses the PayPal gateway", function() {
          expect(this.paypal_cc).to.have.been.calledOnce;
        });

        it("does not use the PayPal gateway", function() {
          expect(this.braintree_cc).to.not.have.been.called;
        });
      });

      describe("in non-USD/EUR/AUD", function() {
        beforeEach(function() {
          return factory.build("order", {}, {
            currencies: ["HKD", "JPY", "CNY"]
          }).then(order => {
            this.order = order;
          });
        });

        beforeEach(function() {
          this.result = PaymentProcessor.processCreditCardPayment(this.cc, this.order);
        });

        it("returns a promise", function() {
          expect(this.result).to.be.a("Promise");
        });

        it("does not use the PayPal gateway", function() {
          expect(this.paypal_cc).to.not.have.been.called;
        });

        it("uses the PayPal gateway", function() {
          expect(this.braintree_cc).to.have.been.calledOnce;
        });
      });
    });
  });
});
