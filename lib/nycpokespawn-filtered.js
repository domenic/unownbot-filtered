"use strict";
const twilio = require("twilio");
const createHappeningsEmitter = require("./happenings.js");

module.exports = (tweetStream, logger, config) => {
  const twilioClient = twilio(config.twilio.accountSID, config.twilio.authToken);

  const happenings = createHappeningsEmitter(
    tweetStream,
    config.pokemonDesired,
    config.accountIDToFollow,
    config.locations
  );

  logger.info("nycpokespawn-filtered started" + (config.configLabel ? ` for ${config.configLabel}` : ""));

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
    logger.info(`${data.pokemon} spawned, but we're not interested`);
  });

  happenings.on("desired spawn", data => {
    logger.info(`${data.pokemon} spawned at ${data.location} until ${data.until}`);
  });

  happenings.on("desired spawn within range", data => {
    const message = `${data.pokemon} spawned at ${data.location} until ${data.until}, ` +
                    `which is ${data.distance.toFixed(2)} km from ${data.closeTo}! ${data.url}`;
    logger.event(message);

    twilioClient.sendMessage({
      to: config.numberToText,
      from: config.twilio.phoneNumber,
      body: message
    })
    .then(result => logger.info(`${data.pokemon} text sent, with SID ${result.sid}`))
    .catch(err => logger.error(`${err.message}
- status: ${err.status}
- code: ${err.code}
- moreInfo: ${err.moreInfo}`));
  });
};
