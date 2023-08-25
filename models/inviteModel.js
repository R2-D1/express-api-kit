const mongoose = require('mongoose');

const inviteSchema = new mongoose.Schema({
  email: {
    type: String,
    require: [true, 'Email must have title'],
  },
  token: {
    type: String,
    require: [true, 'Token must have body'],
  },
});

const Invite = mongoose.model('Invite', inviteSchema);
module.exports = Invite;
