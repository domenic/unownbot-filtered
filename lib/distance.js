"use strict";
const https = require("https");
const { parse: parseURL } = require("url");
const haversine = require("haversine");

exports.followRedirects = function followRedirects(url) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, res => {
      request.abort();

      if (res.headers.location) {
        resolve(followRedirects(res.headers.location));
      } else {
        resolve(url);
      }
    })
    .on("error", reject);
  });
};

// Extracts { latitude, longitude } from URLs of the form
// https://www.google.com/maps/place/40.8053786841,-73.9689989085/?dg=dbrw&newdg=1
exports.positionFromURL = url => {
  const { pathname } = parseURL(url);
  const [, latitudeString, longitudeString] = /^\/maps\/place\/([^,]+),([^/]+)\//.exec(pathname);

  return { latitude: Number(latitudeString), longitude: Number(longitudeString) };
};

exports.distanceToShortenedURL = (startingPosition, shortenedURL) => {
  return exports.followRedirects(shortenedURL).then(finalURL => {
    const finalPosition = exports.positionFromURL(finalURL);

    return haversine(startingPosition, finalPosition);
  });
};
