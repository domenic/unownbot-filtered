"use strict";
const logger = require("./logger.js");
const createHappeningsEmitter = require("./happenings.js");

module.exports = (tweetStream, config) => {
  const happenings = createHappeningsEmitter(
    tweetStream,
    config.pokemonDesired,
    config.accountIDToFollow,
    config.locations
  );

  happenings.on("connected", () => {
    logger.info("Connection to the Tweet stream successfully established");
  });

  happenings.on("error", err => {
    if (err.statusCode) {
      logger.error(`${err.message}
- statusCode: ${err.statusCode}
- code: ${err.code}
- twitterReply: ${err.twitterReply}`);
    } else {
      logger.error(err.stack);
    }
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
};
