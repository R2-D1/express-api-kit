const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

mongoose.set('strictQuery', true);
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const {
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_IP,
  MONGO_PORT,
} = require('./config/config');

const apiV1Router = express.Router();

const mongoURL = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/express-api-kit`;
const app = express();
const port = process.env.PORT || 3000;

// include routers
const userRouter = require('./routes/userRoutes');
const inviteRouter = require('./routes/inviteRoutes');

mongoose
  .connect(mongoURL)
  .catch((error) => console.error(error));

app.use(express.json());
app.enable('trust proxy');

app.use(cors({}));

// Attach Individual Routers
apiV1Router.use('/invites', inviteRouter);
apiV1Router.use('/users', userRouter);

// Attach the Main API Router to the App
app.use('/api/v1', apiV1Router);

// Swagger
const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Express API Swagger',
      version: '1.0.0',
    },
    servers: [
      {
        url: process.env.API_URL,
      },
    ],
  },
  // Paths to files with Swagger annotations
  apis: ['./routes/*.js'], // Adjust the path to your actual route files if it's different.
};

const specs = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.listen(port);
