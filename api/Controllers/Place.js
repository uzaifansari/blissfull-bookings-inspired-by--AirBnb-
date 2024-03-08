const jwt = require("jsonwebtoken");
const PlaceModal = require("../models/Place");
const BookingModel = require("../models/Booking");
require("dotenv").config();

const jwtSecret = process.env.jwtSecret;

const addPlaces = (req, res) => {
  const { token } = req.cookies;
  const {
    title,
    address,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, user) => {
    if (err) throw err;
    const place = await PlaceModal.create({
      owner: user.id,
      title,
      address,
      photos: addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    });
    res.json(place);
  });
};

const getUserPlaces = (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, user) => {
    const { id, isSuperAdmin } = user;
    if (isSuperAdmin) {
      res.json(await PlaceModal.find());
    } else {
      res.json(await PlaceModal.find({ owner: id }));
    }
  });
};

const getParticularPlace = async (req, res) => {
  const { id } = req.params;
  res.json(await PlaceModal.findById(id));
};

const updatePlace = async (req, res) => {
  const { token } = req.cookies;
  const {
    id,
    title,
    address,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, user) => {
    const place = await PlaceModal.findById(id);
    if (user.id === place?.owner.toString()) {
      place.set({
        title,
        address,
        photos: addedPhotos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price,
      });
      await place.save();
      res.json("ok");
    }
  });
};

const getAllPlaces = async (req, res) => {
  res.json(await PlaceModal.find());
};

const deletePlace = async (req, res) => {
  const { id } = req.params;
  const deletedPlace = await PlaceModal.findByIdAndDelete(id);
  const findBooking = await BookingModel.find({ place: id });
  if (findBooking) {
    await BookingModel.deleteMany({ place: id });
  }
  res.json(deletedPlace);
};

module.exports = {
  addPlaces,
  getUserPlaces,
  getParticularPlace,
  updatePlace,
  getAllPlaces,
  deletePlace,
};
