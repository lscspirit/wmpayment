"use strict";

import { factory } from "factory-girl";
import CreditCard from "~/models/credit_card";

const chance = require('chance').Chance();

const VALID_TYPES = [
  "American Express",
  "Mastercard",
  "Visa"
];

factory.define("credit_card", CreditCard, buildOptions => {
  let attrs = {
    name: chance.name()
  };

  // determine credit card type
  let type = null;
  if (buildOptions.amex) {
    type = "American Express";
  } else if (buildOptions.excludeAmex) {
    // pick a credit card type that is not amex
    do {
      type = chance.pickone(VALID_TYPES);
    } while (type === "American Express")
  } else {
    type = chance.pickone(VALID_TYPES);
  }
  // generate a number for the selected type
  attrs.number = chance.cc({ type: type });

  // generate expiration date
  if (buildOptions.expired) {
    attrs.expire_month = chance.exp_month();
    // get a year in the past
    attrs.expire_year  = ((new Date()).getFullYear() - chance.natural({ min: 1, max: 5 })).toString();
  } else {
    let future_exp = chance.exp({ raw: true });
    attrs.expire_year  = future_exp.year;
    attrs.expire_month = future_exp.month;
  }

  // generate a cvv code
  // AMEX uses a 4 digit CVV
  attrs.cvv = chance.string({
    length: type === "American Express" ? 4 : 3,
    pool: "0123456789"
  });

  return attrs;
});