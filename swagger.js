const swaggerJsDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Uber App API",
      version: "1.0.0",
      description: "ai-mock-interview-backend"
    },
    servers: [
      {
        url: "http://localhost:3000"
      },
      {
        url: "https://unarmored-dropper-blatantly.ngrok-free.dev"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },
    tags: [
      { name: "Categories", description: "Category APIs" },
      { name: "Auth", description: "User Auth APIs" },
      { name: "Drivers", description: "Driver APIs" },
      { name: "Rides", description: "Ride APIs" },
      { name: "Payments", description: "Payment APIs" },
      { name: "Wallet", description: "Wallet APIs" },
      { name: "FCM", description: "Push Notification APIs" }
    ]
  },
  apis: ["./routes/*.js"]
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = swaggerSpec;