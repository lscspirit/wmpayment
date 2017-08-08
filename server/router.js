"use strict";

import express from "express";
import PaymentsController from "~/server/controllers/payments_controller";

const router = express.Router();

router.get("/", function(req, res, next) {
  // redirect root to "/payments"
  res.redirect("/payments");
});
router.use("/payments", PaymentsController);

export default router;
