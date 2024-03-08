const multer = require("multer");
const fs = require("fs");
const imageDownloader = require("image-downloader");

const photosMiddleWare = multer({ dest: "uploads" });

const uploadByLink = async (req, res) => {
  const { link } = req.body;
  const newName = "photo" + Date.now() + ".jpg";
  const destPath = "D:/ReactJS/Hotel Booking FInal/api/uploads/" + newName;

  try {
    await imageDownloader.image({
      url: link,
      dest: destPath,
    });

    res.json(newName);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to download image" });
  }
};

const uploadFromLocal = (req, res) => {
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname } = req.files[i];
    const parts = originalname.split(".");
    const extension = parts[parts.length - 1];
    const newPath = path + "." + extension;
    fs.renameSync(path, newPath);
    uploadedFiles.push(newPath.replace("uploads\\", ""));
  }
  res.json(uploadedFiles);
};

module.exports = { uploadByLink, uploadFromLocal };
