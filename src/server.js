const dotenv = require("dotenv").config();
const express = require("express");
const userRoutes = require("./routes/userRoutes");
const bodyParser = require("body-parser");
const countryRoutes = require("./routes/countryRoutes");
const connectDb = require("./config/db");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

connectDb();

const app = express();
const PORT = process.env.PORT || 5001;
app.use(express.json());
app.use(bodyParser.json());

// Setup Swagger

// Swagger Configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "User Management API",
      version: "1.0.0",
      description:
        "API for managing users with registration, login, and CRUD operations",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: "Local server",
      },
    ],
  },
  apis: ["./src/routes/*.js", "./src/controllers/*.js"],
};

// Initialize Swagger
const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
// Routes
app.use("/api/users", userRoutes);
app.use("/api/countries", countryRoutes);

app.get("/hello", (req, res) => {
  res.send("API is running...");
});

app.get("/", (req, res) => {
  res.send("Hello, Docker with Express and MongoDB!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Swagger docs at http://localhost:${PORT}/api-docs`);
});
