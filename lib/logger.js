"use strict";
/* eslint-disable no-console */

exports.error = message => {
  logger("error", "[ERR]  ", message);
};

exports.info = message => {
  logger("log", "[INFO] ", message);
};

function logger(consoleMethod, label, message) {
  console[consoleMethod](`${label} ${(new Date()).toISOString()}: ${message}`);
}
