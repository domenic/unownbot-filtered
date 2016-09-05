"use strict";
const Twit = require("twit");
const config = require("../config.json");
const logger = require("./logger.js");
const createHappeningsEmitter = require("./happenings.js");

const stream = createTweetStream();
const happenings = createHappeningsEmitter(stream, config.pokemonDesired, config.accountIDToFollow, config.locations);

happenings.on("connected", () => {
  logger.info("Connection to the Tweet stream successfully established");
});

happenings.on("error", err => {
  logger.error(`${err.message}
- statusCode: ${err.statusCode}
- code: ${err.code}
- twitterReply: ${err.twitterReply}`);
});

happenings.on("undesired spawn", data => {
  logger.info(`${data.pokemon} spawned, but we're not interested.`);
});

happenings.on("desired spawn", data => {
  logger.info(`${data.pokemon} spawned at ${data.location} until ${data.until}`);
});

happenings.on("desired spawn within range", data => {
  logger.event(`${data.pokemon} spawned at ${data.location} until ${data.until}, ` +
               `which is ${data.distance.toFixed(2)} km from ${data.closeTo}!`);
});

function createTweetStream() {
  const t = new Twit({
    consumer_key: config.consumerKey,
    consumer_secret: config.consumerSecret,
    access_token: config.accessToken,
    access_token_secret: config.accessTokenSecret
  });

  return t.stream("statuses/filter", { follow: config.accountIDToFollow });
}
