"use strict";

module.exports = consoleLike => {
  return {
    error(message) {
      logger("error", "[ERR]  ", message);
    },
    info(message) {
      logger("log", "[INFO] ", message);
    },
    event(message) {
      logger("log", "[!!!!] ", message);
    }
  };

  function logger(consoleMethod, label, message) {
    consoleLike[consoleMethod](`${label} ${(new Date()).toISOString()}: ${message}`);
  }
};
