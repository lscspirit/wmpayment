"use strict";

import "~/spec/test_helper";

import sinon from "sinon";
import chai from "chai";
import { expect } from "chai";
import { factory } from "factory-girl";

import server from "~/server/app";
import PaymentProcessor from "~/server/lib/payment_processor";

const chance = require('chance').Chance();
let sandbox;

describe.only("POST /payments", function() {
  beforeEach(function() {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe("with valid order and credit card", function() {
    beforeEach(function() {
      const cc_prom    = factory.build("credit_card");
      const order_prom = factory.build("order");

      return Promise.all([cc_prom, order_prom]).then(values => {
        this.cc    = values[0];
        this.order = values[1];
        this.request = makePaymentRequest(this.order, this.cc);
      });
    });

    describe("and successful payment", function() {
      beforeEach(function() {
        // stub a successful payment call
        sandbox.stub(PaymentProcessor, "creditCardPayment").returns(Promise.resolve());
      });

      it("responds in json format", function() {
        return this.request.catch(res => {
          expect(res.response).to.be.json;
        });
      });

      it("responds with status 201", function() {
        return this.request.then(res => {
          expect(res).to.have.status(201);
        });
      });
    });

    describe("and unsuccessful payment", function() {
      beforeEach(function() {
        // stub a successful payment call
        const rejection = Promise.reject(new Error("payment failed"));
        rejection.catch(() => null);  // this is needed to prevent a "UnhandledPromiseRejectionWarning"
        sandbox.stub(PaymentProcessor, "creditCardPayment").returns(rejection);
      });

      it("responds in json format", function() {
        return this.request.catch(err => {
          expect(err.response).to.be.json;
        });
      });

      it("responds with status 400", function() {
        return this.request.catch(err => {
          expect(err).to.have.status(400);
        });
      });

      it("responds with the an error message", function() {
        return this.request.catch(err => {
          expect(err.response.body.error).to.equal("payment failed");
        });
      });
    });
  });

  describe("with invalid order and/or credit card", function() {
    beforeEach(function() {
      const invalid_values = {
        order: pickRandomFields({
          currency: chance.pickone(["MOP", "CAD"]),
          amount:   chance.integer({ min: -1000, max: 0 })
        }),
        cc: pickRandomFields({
          number: chance.pickone(["12345678901234", "0000000000000"]),
          expire_month: chance.integer({ min: 13, max: 20 })
        })
      };

      // randomly pick one or both of the value sets ("cc" or "order") from above
      this.invalid_fields = pickRandomFields(invalid_values);

      const cc_prom    = factory.build("credit_card",
        this.invalid_fields["cc"] || {}, { excludeAmex: true });
      const order_prom = factory.build("order", this.invalid_fields["order"] || {});

      return Promise.all([cc_prom, order_prom]).then(values => {
        this.cc    = values[0];
        this.order = values[1];
        this.request = makePaymentRequest(this.order, this.cc);
      });
    });

    it("responds in json format", function() {
      return this.request.catch(err => {
        expect(err.response).to.be.json;
      });
    });

    it("responds with status 400", function() {
      return this.request.catch(err => {
        expect(err).to.have.status(400);
      });
    });

    it("responds with the an error message", function() {
      return this.request.catch(err => {
        expect(err.response.body.error).to.equal("invalid order or credit card");
      });
    });

    it("responds with detail error message for each erroneous field", function() {
      return this.request.catch(err => {
        // check the "cc" and "order" sets
        Object.keys(this.invalid_fields).forEach(set => {
          // match erroneous fields in each set
          Object.keys(this.invalid_fields[set]).forEach(field => {
            expect(err.response.body.details[set][field]).to.not.be.empty;
          });
        });
      });
    });

    it("only responds with detail error messages for the erroneous fields", function() {
      return this.request.catch(err => {
        // check the "cc" and "order" sets
        Object.keys(err.response.body.details).forEach(set => {
          // match erroneous fields in each set
          Object.keys(err.response.body.details[set]).forEach(field => {
            expect(this.invalid_fields[set][field]).to.not.be.an("undefined");
          });
        });
      });
    });
  });
});

//
// Helper Methods
//

function makePaymentRequest(order, cc) {
  return chai.request(server)
           .post("/payments")
           .send({
             order: order,
             cc:    cc
           });
}

function pickRandomFields(field_pool, count) {
  const fields = Object.keys(field_pool);
  if (fields.length === 0) return {};

  const _count = count === undefined ? chance.integer({ min: 1, max: fields.length }) : count;
  const picked_fields = chance.pickset(fields, _count);

  return picked_fields.reduce((result, field) => {
    result[field] = field_pool[field];
    return result;
  }, {});
}
