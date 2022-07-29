const express = require("express");
const router = express.Router();

const urlController = require("./../controllers/urlController");

router.post("/shorten", urlController.shortenUrl);
router.get("/dashboard", urlController.getUrls);

module.exports = router;
