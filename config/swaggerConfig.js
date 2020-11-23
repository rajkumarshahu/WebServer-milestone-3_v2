require("dotenv").config();
const swaggerDefinition = {
  info: {
    title: "Patient Data REST API",
    version: "1.0",
    description: "Backend REST API for WeCare application to manage patients and patients'record",
  },
  host: process.env.HostName,
  basePath: "/",
  securityDefinitions: {
    UserSecurity: {
      type: "apiKey",
      name: "User-Key",
      scheme: "bearer",
      in: "header",
    },
  },
  schemes: ["http"],
};

const options = {
  swaggerDefinition,
  apis: ["./routes/*.js"],
};

module.exports = options;