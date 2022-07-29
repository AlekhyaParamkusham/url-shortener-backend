const express = require("express");
const router = express.Router();
const urlController = require("./../controllers/urlController");

router.get("/:code", urlController.redirectUrl);

module.exports = router;
