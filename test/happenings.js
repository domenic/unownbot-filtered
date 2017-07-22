"use strict";
const { EventEmitter } = require("events");
const test = require("ava");
const createHappenings = require("../lib/happenings.js");
const fixtureTweets = require("./fixtures/tweets.json");

const fixtureTweet = fixtureTweets[0];
const fixtureTweetWithGoodTTL = fixtureTweets[10];
const fixtureTweetNoIVOrLetter = fixtureTweets[6];
const nonUnownTweet = fixtureTweets[5];

test.cb("emits a 'connected' event when the tweet stream becomes connected", t => {
  const fakeStream = new EventEmitter();
  const happenings = createHappenings(fakeStream, [], "12345", []);

  happenings.on("connected", (...args) => {
    t.pass("'connected' event must be emitted");
    t.deepEqual(args, [], "zero arguments must be passed");
    t.end();
  });
  happenings.on("error", err => {
    t.end(err);
  });

  const fakeResponse = { fake: "response" };
  fakeStream.emit("connected", fakeResponse);
});

test.cb("emits an 'error' event when the tweet stream errors", t => {
  const fakeStream = new EventEmitter();
  const happenings = createHappenings(fakeStream, [], "12345", []);
  const fakeError = new Error("boo");

  happenings.on("error", (...args) => {
    t.pass("'error' event must be emitted");
    t.deepEqual(args, [fakeError], "the error must be passed as an argument");
    t.end();
  });

  fakeStream.emit("error", fakeError);
});

test.cb("emits a 'spawn' event when an Unown spawns without IV or letter information", t => {
  const fakeStream = new EventEmitter();
  const happenings = createHappenings(fakeStream, "837234225715818497", []);

  happenings.on("spawn", (...args) => {
    t.pass("'spawn' event must be emitted");
    t.deepEqual(
      args,
      [{
        iv: "unknown",
        letter: "unknown",
        ttl: "19m 55s",
        url: "https://maps.google.com/?q=42.98498,-81.23867"
      }]
    );
    t.end();
  });
  happenings.on("error", err => {
    t.end(err);
  });

  fakeStream.emit("tweet", fixtureTweetNoIVOrLetter);
});

test.cb("emits a 'spawn' event when an Unown spawns with IV and letter information", t => {
  const fakeStream = new EventEmitter();
  const happenings = createHappenings(fakeStream, "837234225715818497", []);

  happenings.on("spawn", (...args) => {
    t.pass("'spawn' event must be emitted");
    t.deepEqual(
      args,
      [{
        iv: "28%",
        letter: "X",
        ttl: "unknown",
        url: "https://maps.google.com/?q=-33.89882,151.03017"
      }]
    );
    t.end();
  });
  happenings.on("error", err => {
    t.end(err);
  });

  fakeStream.emit("tweet", fixtureTweet);
});

test.cb("emits a 'spawn' event when an Unown spawns with a known TTL", t => {
  t.plan(2);

  const fakeStream = new EventEmitter();
  const happenings = createHappenings(fakeStream, "837234225715818497", []);

  happenings.on("spawn", (...args) => {
    t.pass("'spawn' event must be emitted");
    t.deepEqual(
      args,
      [{
        iv: "unknown",
        letter: "unknown",
        ttl: "59m 56s",
        url: "https://maps.google.com/?q=32.68503,-117.17349"
      }]
    );
    t.end();
  });
  happenings.on("error", err => {
    t.end(err);
  });

  fakeStream.emit("tweet", fixtureTweetWithGoodTTL);
});

test.cb("does not emit an event if the tweet is from a different user", t => {
  const fakeStream = new EventEmitter();
  const happenings = createHappenings(fakeStream, "1234", []);

  happenings.on("spawn", () => {
    t.fail("'spawn' event must not be emitted");
  });
  happenings.on("spawn within range", () => {
    t.fail("'spawn within range' event must not be emitted");
  });
  happenings.on("error", err => {
    t.end(err);
  });

  const fakeTweet = JSON.parse(JSON.stringify(fixtureTweet));
  fakeTweet.user.id_str = "1235";
  fakeStream.emit("tweet", fakeTweet);

  t.pass("No events were emitted");
  t.end();
});

test.cb("emits an error event if it can't parse the tweet", t => {
  t.plan(2);

  const fakeStream = new EventEmitter();
  const happenings = createHappenings(fakeStream, "837234225715818497", []);

  happenings.on("spawn", () => {
    t.fail("'spawn' event must not be emitted");
  });
  happenings.on("spawn within range", () => {
    t.fail("'spawn within range' event must not be emitted");
  });
  happenings.on("error", error => {
    t.pass("'error' event must be emitted");
    t.is(error.message, `Could not parse tweet with text '${nonUnownTweet.text}'`);
    t.end();
  });

  fakeStream.emit("tweet", nonUnownTweet);
});

test.cb("emits a 'spawn within range' event when an Unown spawns within range without IV or letter information", t => {
  const fakeStream = new EventEmitter();
  const happenings = createHappenings(fakeStream, "837234225715818497", [
    {
      label: "Home",
      latitude: 42.9,
      longitude: -81.2,
      radius: 10
    }
  ]);

  happenings.on("spawn within range", (...args) => {
    t.pass("'spawn within range' event must be emitted");
    t.deepEqual(
      args,
      [{
        iv: "unknown",
        letter: "unknown",
        ttl: "19m 55s",
        url: "https://maps.google.com/?q=42.98498,-81.23867",
        distance: 9.959824198142288,
        closeTo: "Home"
      }]
    );
    t.end();
  });
  happenings.on("error", err => {
    t.end(err);
  });

  fakeStream.emit("tweet", fixtureTweetNoIVOrLetter);
});

test.cb("emits a 'spawn within range' event when an Unown spawns within range with IV and letter information", t => {
  t.plan(2);

  const fakeStream = new EventEmitter();
  const happenings = createHappenings(fakeStream, "837234225715818497", [
    {
      label: "Home",
      latitude: -33.8,
      longitude: 151.0,
      radius: 20
    }
  ]);

  happenings.on("spawn within range", (...args) => {
    t.pass("'spawn within range' event must be emitted");
    t.deepEqual(
      args,
      [{
        iv: "28%",
        letter: "X",
        ttl: "unknown",
        url: "https://maps.google.com/?q=-33.89882,151.03017",
        distance: 11.33600027054718,
        closeTo: "Home"
      }]
    );
    t.end();
  });
  happenings.on("error", err => {
    t.end(err);
  });

  fakeStream.emit("tweet", fixtureTweet);
});

test.cb("emits a 'spawn within range' event when an Unown spawns within range with a known TTL", t => {
  t.plan(2);

  const fakeStream = new EventEmitter();
  const happenings = createHappenings(fakeStream, "837234225715818497", [
    {
      label: "Home",
      latitude: 32.6,
      longitude: -117.1,
      radius: 20
    }
  ]);

  happenings.on("spawn within range", (...args) => {
    t.pass("'spawn within range' event must be emitted");
    t.deepEqual(
      args,
      [{
        iv: "unknown",
        letter: "unknown",
        ttl: "59m 56s",
        url: "https://maps.google.com/?q=32.68503,-117.17349",
        distance: 11.693738886491372,
        closeTo: "Home"
      }]
    );
    t.end();
  });
  happenings.on("error", err => {
    t.end(err);
  });

  fakeStream.emit("tweet", fixtureTweetWithGoodTTL);
});

test.cb("does not emit 'spawn within range' event when an Unown spawns outside of the range", t => {
  const fakeStream = new EventEmitter();
  const happenings = createHappenings(fakeStream, "837234225715818497", [
    {
      label: "Home",
      latitude: 40.80,
      longitude: -73.96,
      radius: 0.9
    }
  ]);

  happenings.on("spawn within range", () => {
    t.fail("'spawn within range' must not be emitted");
  });
  happenings.on("error", err => {
    t.end(err);
  });

  fakeStream.emit("tweet", fixtureTweet);

  t.pass("No events were emitted");
  t.end();
});
