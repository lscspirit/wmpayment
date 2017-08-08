"use strict";

require("~/assets/stylesheets/main.scss");

import React from "react";
import ReactDOM from "react-dom";

import AppContainer from "~/client/components/app_container";

(function() {
  const container = document.getElementById("app");
  ReactDOM.render(React.createElement(AppContainer), container);
})();