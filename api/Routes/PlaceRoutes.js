const express = require("express");
const router = express.Router();
const {
  addPlaces,
  getUserPlaces,
  getParticularPlace,
  updatePlace,
  getAllPlaces,
  deletePlace,
} = require("../Controllers/Place");

router.post("/places", addPlaces);
router.get("/user-places", getUserPlaces);
router.get("/places/:id", getParticularPlace);
router.put("/places", updatePlace);
router.get("/places", getAllPlaces);
router.delete("/places/:id", deletePlace);

module.exports = router;
