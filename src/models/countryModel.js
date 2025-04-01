const mongoose = require("mongoose");

const countrySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    capital: { type: String },
    region: { type: String },
    population: { type: String },
    area: { type: String },
    flag: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Country", countrySchema);
