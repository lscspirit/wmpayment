"use strict";

import express from "express";
import PaymentsController from "~/server/controllers/payments_controller";

const router = express.Router();

router.use("/payments", PaymentsController);

export default router;
