const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const {MONGO_USERNAME, MONGO_PASSWORD, MONGO_IP, MONGO_PORT} = require("./config/config");
mongoose.set('strictQuery', true);

const mongoURL = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/express-api-kit`;
const app = express();
const port = process.env.PORT || 3000;

// include routers
const userRouter = require("./routes/userRoutes");
const inviteRouter = require("./routes/inviteRoutes");

mongoose.connect(mongoURL)
    .then(() => console.log('Successfully connected to DB'))
    .catch((error) => console.log(error));

app.use(express.json());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/invites", inviteRouter);

app.listen(port, () => console.log(`Listening on port ${port}`));
