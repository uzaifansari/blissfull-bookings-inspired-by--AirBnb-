const mongoose = require("mongoose");

const PlaceSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "USer" },
  title: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  photos: [String],
  description: {
    type: String,
    required: true,
  },
  perks: [String],
  extraInfo: String,
  checkIn: {
    type: String,
    required: true,
  },
  checkOut: {
    type: String,
    required: true,
  },
  maxGuests: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const PlaceModel = mongoose.model("Place", PlaceSchema);

module.exports = PlaceModel;
