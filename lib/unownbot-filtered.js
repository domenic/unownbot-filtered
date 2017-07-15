"use strict";
const twilio = require("twilio");
const createHappeningsEmitter = require("./happenings.js");

module.exports = (tweetStream, logger, config) => {
  const twilioClient = twilio(config.twilio.accountSID, config.twilio.authToken);

  const happenings = createHappeningsEmitter(
    tweetStream,
    config.accountIDToFollow,
    config.locations
  );

  logger.info("unownbot-filtered started" + (config.configLabel ? ` for ${config.configLabel}` : ""));

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

  happenings.on("spawn", data => {
    logger.info(`Unown spawned: IV ${data.iv}, TTL ${data.ttl}`);
  });

  happenings.on("spawn within range", data => {
    const message = `Unown (letter ${data.letter}) spawned with IV ${data.iv}, TTL ${data.ttl}, and it is ` +
                    `${data.distance.toFixed(2)} km from ${data.closeTo}! ${data.url}`;
    logger.event(message);

    twilioClient.sendMessage({
      to: config.numberToText,
      from: config.twilio.phoneNumber,
      body: message
    })
    .then(result => logger.info(`Text sent, with SID ${result.sid}`))
    .catch(err => logger.error(`${err.message}
- status: ${err.status}
- code: ${err.code}
- moreInfo: ${err.moreInfo}`));
  });
};
