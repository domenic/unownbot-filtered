"use strict";
const { EventEmitter } = require("events");
const test = require("ava");
const createHappenings = require("../lib/happenings.js");

test("emits connected event when the tweet stream becomes connected", t => {
  t.plan(2);

  const fakeStream = new EventEmitter();
  const happenings = createHappenings(fakeStream, [], "12345");

  happenings.on("connected", (...args) => {
    t.pass("connected event must be emitted");
    t.deepEqual(args, [], "zero arguments must be passed");
  });

  const fakeResponse = { fake: "response" };
  fakeStream.emit("connected", fakeResponse);
});
