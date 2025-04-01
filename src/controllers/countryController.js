const axios = require("axios");
const { StatusCodes } = require("http-status-codes");
const Country = require("../models/countryModel");

// Fetch and Store Countries from External API
exports.fetchAndStoreCountries = async (req, res) => {
  try {
    const response = await axios.get("https://restcountries.com/v3.1/all");
    const countries = response.data.map((country) => ({
      name: country.name.common,
      capital: country.capital ? country.capital[0] : "N/A",
      region: country.region,
      population: country.population,
      area: country.area,
      flag: country.flags.png,
    }));

    await Country.insertMany(countries);
    res
      .status(StatusCodes.CREATED)
      .json({ success: true, message: "Countries stored successfully" });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Get All Countries
exports.getAllCountries = async (req, res) => {
  try {
    const countries = await Country.find();
    res
      .status(StatusCodes.OK)
      .json({
        success: true,
        message: "Retrieve all countries from the database",
        countries,
      });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Get Country by ID
exports.getCountryById = async (req, res) => {
  try {
    const country = await Country.findById(req.params.id);
    if (!country)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Country not found" });

    res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Retrieve a country by ID", country });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Add New Country
exports.addCountry = async (req, res) => {
  const { name, capital, region, population, area, flag } = req.body;
  try {
    const country = new Country({
      name,
      capital,
      region,
      population,
      area,
      flag,
    });
    await country.save();
    res
      .status(StatusCodes.CREATED)
      .json({ success: true, message: "Add a new country manually", country });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Update Country
exports.updateCountry = async (req, res) => {
  try {
    const updatedCountry = await Country.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedCountry)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Country not found" });

    res
      .status(StatusCodes.OK)
      .json({
        success: true,
        message: "Update country details",
        updatedCountry,
      });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Delete Country
exports.deleteCountry = async (req, res) => {
  try {
    const country = await Country.findByIdAndDelete(req.params.id);
    if (!country)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Country not found" });

    res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Delete a country" });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
