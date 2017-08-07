"use strict";

require("~/assets/stylesheets/main.scss");

import React from "react";
import ReactDOM from "react-dom";

import PaymentFormContainer from "~/client/components/payment_form";

(function() {
  const container = document.getElementById("payment-form");
  ReactDOM.render(React.createElement(PaymentFormContainer), container);
})();