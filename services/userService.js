const Invite = require('../models/inviteModel');
const jwt = require('jsonwebtoken');

const isInviteExist = async (token) => {
  const invite = await Invite.findOne({ token });
  return !!invite;
};

module.exports = { isInviteExist };
