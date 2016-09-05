"use strict";
const { EventEmitter } = require("events");
const config = require("../config.json");
const fakeTweets = require("../test/fixtures/tweets.json");
const nycpokespawnFiltered = require("..");

const stream = new EventEmitter();
nycpokespawnFiltered(stream, config);

stream.emit("connected");

let delay = 0;
for (const tweet of fakeTweets) {
  setTimeout(() => stream.emit("tweet", tweet), delay);
  delay += 1000;
}
