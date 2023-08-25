const User = require('../models/userModel');
const { validationResult } = require('express-validator');
const Invite = require('../models/inviteModel');
const sendEmail = require('../services/emailService');
const { isInviteExist } = require('../services/userService');
const crypto = require('crypto');

exports.checkToken = async (request, response) => {
  const token = request.params.token;
  const isTokenValid = await isInviteExist(token);

  if (isTokenValid) {
    response.status(200).json({
      success: true,
    });
  } else {
    response.status(400).json({
      success: false,
      message: 'Token is invalid',
    });
  }
};

exports.createInvite = async (request, response) => {
  const errors = validationResult(request);

  if (!errors.isEmpty()) {
    return response.status(402).json({ errors: errors.array() });
  }

  const email = request.body.email;

  // check existed invite
  const previousInvite = await Invite.findOne({ email });
  if (previousInvite) {
    return response.status(400).json({
      success: false,
      message: `User with this email is already invited`,
    });
  }

  // check existed invite
  const existUser = await User.findOne({ email });
  if (existUser) {
    return response.status(400).json({
      success: false,
      message: 'User with this email already exist',
    });
  }

  let token = crypto.randomBytes(20).toString('hex');

  try {
    await sendEmail(
      email,
      'Registration',
      'Hi there!',
      `You were invited to ${process.env.APP_NAME} application. Follow link below to continue.`,
      'Registration',
      `${process.env.APP_URL}/registration/` + token
    );
    await Invite.create({ email, token });

    response.status(200).json({
      success: true,
    });
  } catch (e) {
    response.status(400).json({
      success: false,
      message: e.message,
    });
  }
};

exports.getAllInvites = async (request, response) => {
  const invites = await Invite.find({}, { email: 1 });
  response.status(200).json({
    success: true,
    results: invites.length,
    data: invites,
  });
};

exports.deleteInvite = async (request, response) => {
  const user = await Invite.findById(request.params.id);
  if (user) {
    user.delete();
    response.status(201).json({
      success: true,
    });
  } else {
    response.status(404).json({
      success: false,
      error: 'Invite is not found',
    });
  }
};
