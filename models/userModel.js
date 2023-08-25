const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true,
        unique: true,
    },
    password: {
        type: String,
        require: true
    },
    role: {
        type: String,
        require: true
    },
    reset_password_token: {
        type: String,
        require: false
    }
});

const User = mongoose.model("User", postSchema);
module.exports = User;