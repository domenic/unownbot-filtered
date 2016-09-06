"use strict";
/* eslint-disable require-yield */
/* eslint-disable no-invalid-this */
const fs = require("then-fs");
const koa = require("koa");
const config = require("../config.json");
const nycpokespawnFiltered = require("..");
const createTweetStream = require("../lib/twitter.js");
const createLogger = require("../lib/logger.js");

const logger = createLogger({
  log(message) {
    fs.appendFile(config.server.logFilePath, message + "\n");
  },
  error(message) {
    fs.appendFile(config.server.logFilePath, message + "\n");
  }
});

const tweetStream = createTweetStream(config.twitter, config.accountIDToFollow);
nycpokespawnFiltered(tweetStream, logger, config);

const app = koa();

app.use(function* () {
  this.type = "text/plain";
  this.body = fs.createReadStream(config.server.logFilePath);
});

app.listen(config.server.port);
