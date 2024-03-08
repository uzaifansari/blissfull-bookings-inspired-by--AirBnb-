const express = require("express");
const multer = require("multer");
const router = express.Router();
const { uploadByLink, uploadFromLocal } = require("../Controllers/Upload");

const photosMiddleWare = multer({ dest: "uploads" });

router.post("/upload-by-link", uploadByLink);
router.post("/upload", photosMiddleWare.array("photos", 100), uploadFromLocal);

module.exports = router;
