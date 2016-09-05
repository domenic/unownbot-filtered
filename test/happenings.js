"use strict";
const { EventEmitter } = require("events");
const test = require("ava");
const createHappenings = require("../lib/happenings.js");
const fixtureTweets = require("./fixtures/tweets.json");

const retweetFixtureTweet = fixtureTweets[0];
const dragoniteFixtureTweet = fixtureTweets[12];

test("emits a 'connected' event when the tweet stream becomes connected", t => {
  t.plan(2);

  const fakeStream = new EventEmitter();
  const happenings = createHappenings(fakeStream, [], "12345", []);

  happenings.on("connected", (...args) => {
    t.pass("'connected' event must be emitted");
    t.deepEqual(args, [], "zero arguments must be passed");
  });

  const fakeResponse = { fake: "response" };
  fakeStream.emit("connected", fakeResponse);
});

test("emits an 'error' event when the tweet stream errors", t => {
  t.plan(2);

  const fakeStream = new EventEmitter();
  const happenings = createHappenings(fakeStream, [], "12345", []);
  const fakeError = new Error("boo");

  happenings.on("error", (...args) => {
    t.pass("'error' event must be emitted");
    t.deepEqual(args, [fakeError], "the error must be passed as an argument");
  });

  fakeStream.emit("error", fakeError);
});

test("emits a 'desired spawn' event when something desired spawns", t => {
  t.plan(2);

  const fakeStream = new EventEmitter();
  const happenings = createHappenings(fakeStream, ["Dragonite"], "754728450573930496", []);

  happenings.on("desired spawn", (...args) => {
    t.pass("'desired spawn' event must be emitted");
    t.deepEqual(
      args,
      [{
        pokemon: "Dragonite",
        location: "380 Riverside Dr, 10025",
        until: "3:56:05 PM",
        url: "https://goo.gl/LhphUu"
      }]
    );
  });

  fakeStream.emit("tweet", dragoniteFixtureTweet);
});

test("emits an 'undesired spawn' event when something undesired spawns", t => {
  t.plan(2);

  const fakeStream = new EventEmitter();
  const happenings = createHappenings(fakeStream, ["Gengar"], "754728450573930496", []);

  happenings.on("undesired spawn", (...args) => {
    t.pass("'undesired spawn' event must be emitted");
    t.deepEqual(
      args,
      [{
        pokemon: "Dragonite",
        location: "380 Riverside Dr, 10025",
        until: "3:56:05 PM",
        url: "https://goo.gl/LhphUu"
      }]
    );
  });

  fakeStream.emit("tweet", dragoniteFixtureTweet);
});

test("does not emit an event if the tweet is from a different user", t => {
  const fakeStream = new EventEmitter();
  const happenings = createHappenings(fakeStream, ["Dragonite"], "1234", []);

  happenings.on("desired spawn", () => {
    t.fail("'desired spawn' event must not be emitted");
  });
  happenings.on("undesired spawn", () => {
    t.fail("'undesired spawn' event must not be emitted");
  });

  const fakeTweet = JSON.parse(JSON.stringify(dragoniteFixtureTweet));
  fakeTweet.user.id_str = "1235";
  fakeStream.emit("tweet", fakeTweet);
});

test("does not emit an event if the tweet is @nycpokespawn retweeting", t => {
  const fakeStream = new EventEmitter();
  const happenings = createHappenings(fakeStream, ["Dragonite"], "754728450573930496", []);

  happenings.on("desired spawn", () => {
    t.fail("'desired spawn' event must not be emitted");
  });
  happenings.on("undesired spawn", () => {
    t.fail("'undesired spawn' event must not be emitted");
  });

  fakeStream.emit("tweet", retweetFixtureTweet);
});

test("emits an error event if it can't parse the tweet", t => {
  t.plan(2);

  const fakeStream = new EventEmitter();
  const happenings = createHappenings(fakeStream, ["Dragonite"], "754728450573930496", []);

  const fakeTweet = JSON.parse(JSON.stringify(dragoniteFixtureTweet));
  fakeTweet.text = "I want to tell you something that isn't about a spawning poke!";

  happenings.on("desired spawn", () => {
    t.fail("'desired spawn' event must not be emitted");
  });
  happenings.on("undesired spawn", () => {
    t.fail("'undesired spawn' event must not be emitted");
  });
  happenings.on("error", error => {
    t.pass("'error' event must be emitted");
    t.is(error.message, `Could not parse tweet with text '${fakeTweet.text}'`);
  });

  fakeStream.emit("tweet", fakeTweet);
});

test.cb("emits a 'desired spawn within range' event when something desired spawns within range", t => {
  t.plan(2);

  const fakeStream = new EventEmitter();
  const happenings = createHappenings(fakeStream, ["Dragonite"], "754728450573930496", [
    {
      label: "Home",
      latitude: 40.80,
      longitude: -73.96,
      radius: 1
    }
  ]);

  happenings.on("desired spawn within range", (...args) => {
    t.pass("'desired spawn within range' event must be emitted");
    t.deepEqual(
      args,
      [{
        pokemon: "Dragonite",
        location: "380 Riverside Dr, 10025",
        until: "3:56:05 PM",
        url: "https://goo.gl/LhphUu",
        distance: 0.9651027009170235,
        closeTo: "Home"
      }]
    );

    t.end();
  });

  fakeStream.emit("tweet", dragoniteFixtureTweet);
});

test("does not emit 'desired spawn within range' event when something desired spawns outside of the range", t => {
  const fakeStream = new EventEmitter();
  const happenings = createHappenings(fakeStream, ["Dragonite"], "754728450573930496", [
    {
      label: "Home",
      latitude: 40.80,
      longitude: -73.96,
      radius: 0.9
    }
  ]);

  happenings.on("desired spawn within range", () => {
    t.fail("'desired spawn within range' must not be emitted");
  });

  fakeStream.emit("tweet", dragoniteFixtureTweet);
});
