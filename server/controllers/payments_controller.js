"use strict";

import express from "express";

import Order from "~/models/order";
import CreditCard from "~/models/credit_card";
import PaymentProcessor from "~/server/lib/payment_processor";
import { errorResponseJson } from "~/server/helpers/response_helper";

const router = express.Router();

router.get("/", function(req, res, next) {
  res.render("payments/index");
});

router.post("/", function(req, res, next) {
  const order = new Order(req.body.order);
  const cc    = new CreditCard(req.body.cc);

  if (order.validate() && cc.validate()) {
    PaymentProcessor.creditCardPayment(order, cc).then(transaction => {
      res.status(201).json(transaction);
    }, error => {
      res.status(400).json(errorResponseJson(error));
    });
  } else {
    res.status(400).json(errorResponseJson("invalid order or credit card", {
      order: order.errors.all,
      cc: cc.errors.all
    }));
  }
});

export default router;
