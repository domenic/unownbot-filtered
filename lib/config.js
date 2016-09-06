"use strict";
/* eslint-disable no-console */
/* eslint-disable no-process-exit */
const path = require("path");
const fs = require("then-fs");

module.exports = () => {
  const filePath = process.argv[2] ? path.resolve(process.argv[2]) : path.resolve(__dirname, "../config.json");

  let configString;
  try {
    configString = fs.readFileSync(filePath, { encoding: "utf-8" });
  } catch (e) {
    if (e.code === "ENOENT") {
      console.error("The config file doesn't exist yet.");
      console.error(`Go to ${path.resolve(__dirname, "..")} and copy config.sample.json to config.json.`);
      console.error("Then follow the instructions in the readme for filling it out.");
      process.exit(1);
    } else {
      throw e;
    }
  }

  return JSON.parse(configString);
};
