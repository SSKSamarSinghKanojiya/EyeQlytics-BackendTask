const express = require("express");
const {
  fetchAndStoreCountries,
  getAllCountries,
  getCountryById,
  addCountry,
  updateCountry,
  deleteCountry,
} = require("../controllers/countryController");
const router = express.Router();

// External API Fetch
router.post("/fetch", fetchAndStoreCountries);

// CRUD Operations
router.get("/", getAllCountries);
router.get("/:id", getCountryById);
router.post("/", addCountry);
router.put("/:id", updateCountry);
router.delete("/:id", deleteCountry);

module.exports = router;
