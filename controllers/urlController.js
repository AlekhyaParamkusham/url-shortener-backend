const express = require("express");
const validUrl = require("valid-url");
const shortid = require("shortid");
const Url = require("../models/urlModel");
const catchAsync = require("./../utils/catchAsync");

exports.shortenUrl = catchAsync(async (req, res, next) => {
  const { longUrl } = req.body;
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  if (!validUrl.isUri(baseUrl)) {
    return res.status(401).json("Invalid base URL");
  }

  const urlCode = shortid.generate();
  // check long url if valid using the validUrl.isUri method
  if (validUrl.isUri(longUrl)) {
    try {
      let url = await Url.findOne({ longUrl });

      // url exist and return the respose
      if (url) {
        res.json(url);
      } else {
        // join the generated short code the the base url
        const shortUrl = baseUrl + "/" + urlCode;

        // invoking the Url model and saving to the DB
        url = new Url({
          longUrl,
          shortUrl,
          urlCode,
          date: new Date(),
        });
        await url.save();
        res.status(200).json({
          status: "success",
          data: {
            url,
          },
        });
      }
    } catch (err) {
      // exception handler
      console.log(err);
      res.status(500).json("Server Error");
    }
  } else {
    res.status(401).json("Invalid longUrl");
  }
});

exports.redirectUrl = catchAsync(async (req, res, next) => {
  try {
    // find a document match to the code in req.params.code
    const url = await Url.findOne({
      urlCode: req.params.code,
    });
    if (url) {
      // when valid we perform a redirect
      return res.redirect(url.longUrl);
    } else {
      // else return a not found 404 status
      return res.status(404).json("No URL Found");
    }
  } catch (err) {
    // exception handler
    console.error(err);
    res.status(500).json("Server Error");
  }
});

exports.getUrls = catchAsync(async (req, res, next) => {
  const urls = await Url.find();
  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: urls.length,
    data: {
      urls,
    },
  });
});
