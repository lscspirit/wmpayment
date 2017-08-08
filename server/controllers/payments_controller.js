"use strict";

import express from "express";

import Order from "~/models/order";
import CreditCard from "~/models/credit_card";
import PaymentProcessor from "~/server/lib/payment_processor";
import TransactionRecord from "~/server/records/transaction_record";
import { errorResponseJson } from "~/server/helpers/response_helper";

const router = express.Router();

router.get("/", function(req, res, next) {
  res.render("payments/index");
});

router.post("/", function(req, res, next) {
  const order = new Order(req.body.order);
  const cc    = new CreditCard(req.body.cc);

  if (order.validate() && cc.validate()) {
    PaymentProcessor.processCreditCardPayment(cc, order).then(transaction => {
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

router.post("/search", function(req, res, next) {
  TransactionRecord.search(req.body.id, req.body.name).then(transaction => {
    if (transaction) {
      res.status(200).json(transaction);
    } else {
      res.status(404).json(errorResponseJson("record not found"));
    }
  }, error => {
    res.status(400).json(errorResponseJson(error));
  });
});

export default router;
