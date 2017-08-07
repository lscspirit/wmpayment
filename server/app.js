"use strict";

import path from "path";
import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
// webpack
import webpack from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";
import clientWebpackConfig from "~/webpack.client.config.js";

import appRouter from "~/server/router";

//
// Initialize Express
//

const app = express();

// public directory
app.use(express.static(__dirname + "../public"));

// setup view engine
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs");

// setup request logging
app.use(morgan('combined'));

// setup request parsing
app.use(bodyParser.json());

// setup router
app.use(appRouter);

//
// Configure Webpack
//

if (app.get("env") !== "production") {
  const webpackCompiler = webpack(clientWebpackConfig);
  app.use(webpackDevMiddleware(webpackCompiler, {
    publicPath: clientWebpackConfig.output.publicPath
  }));
}

module.exports = app;

