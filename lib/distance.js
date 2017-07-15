"use strict";
const { URL } = require("url");
const haversine = require("haversine");

// Extracts { latitude, longitude } from URLs of the form
// https://maps.google.com/?q=35.41025,139.93000
exports.positionFromURL = url => {
  const { searchParams } = new URL(url);
  const [latitudeString, longitudeString] = searchParams.get("q").split(",");

  return { latitude: Number(latitudeString), longitude: Number(longitudeString) };
};

exports.distanceToURL = (startingPosition, url) => {
  const position = exports.positionFromURL(url);

  return haversine(startingPosition, position);
};
