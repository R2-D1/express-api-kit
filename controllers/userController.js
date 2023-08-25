const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Invite = require('../models/inviteModel');
const User = require('../models/userModel');
const sendEmail = require('../services/emailService');

exports.sungUp = async (request, response) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(400).json({
      success: false,
      messages: errors.array(),
    });
  }

  const { token } = request.params;
  const invite = await Invite.findOne({ token });
  if (!invite) {
    return response.status(400).json({
      success: false,
      message: 'Token is invalid',
    });
  }

  // generate password hash
  const passwordHash = await bcrypt.hash(request.body.password, 12);

  const user = {
    email: invite.email,
    password: passwordHash,
    role: 'user',
  };

  try {
    await User.create(user);
    // remove invite
    invite.delete();
    return response.status(201).json({
      success: true,
    });
  } catch (error) {
    return response.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.checkResetPasswordToken = async (request, response) => {
  const { token } = request.params;
  const isTokenValid = await User.findOne({ reset_password_token: token });

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

exports.resetPassword = async (request, response) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(400).json({
      success: false,
      messages: errors.array(),
    });
  }

  const { token } = request.params;
  const user = await User.findOne({ reset_password_token: token });
  if (!user) {
    return response.status(400).json({
      success: false,
      message: 'Token is invalid',
    });
  }

  // generate password hash
  user.password = await bcrypt.hash(request.body.password, 12);
  user.reset_password_token = null;

  try {
    await user.save();
    return response.status(201).json({
      success: true,
    });
  } catch (error) {
    return response.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.changePassword = async (request, response) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(400).json({
      success: false,
      messages: errors.array(),
    });
  }

  const authToken = request.headers.authorization.split(' ')[1];
  const { password } = request.body;
  const newPassword = request.body.new_password;

  try {
    const decode = jwt.verify(authToken, process.env.JWT_SECRET);
    const { email } = decode;
    const user = await User.findOne({ email });
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new Error('Incorrect password');
    }

    user.password = await bcrypt.hash(newPassword, 12);
    user.save();

    return response.status(201).json({
      success: true,
    });
  } catch (error) {
    return response.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

exports.changeEmail = async (request, response) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(400).json({
      success: false,
      messages: errors.array(),
    });
  }

  const authToken = request.headers.authorization.split(' ')[1];
  const { password } = request.body;
  const newEmail = request.body.email;

  try {
    const decode = jwt.verify(authToken, process.env.JWT_SECRET);
    const { email } = decode;
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      throw new Error('Incorrect password');
    }

    user.email = newEmail;
    user.save();

    return response.status(201).json({
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.changeRole = async (request, response) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(400).json({
      success: false,
      messages: errors.array(),
    });
  }

  const { id } = request.params;
  const { role } = request.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    user.role = role;
    user.save();

    return response.status(201).json({
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.forgotPassword = async (request, response) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(400).json({
      success: false,
      messages: errors.array(),
    });
  }

  const { email } = request.body;
  const user = await User.findOne({ email });

  if (!user) {
    return response.status(400).json({
      success: false,
      message: 'User with this email not found',
    });
  }

  const token = crypto.randomBytes(20).toString('hex');
  user.reset_password_token = token;

  try {
    user.save();
    await sendEmail(
      email,
      'Reset password',
      'Hi there!',
      'It looks like you forgot your password, follow the link below and reset it.',
      'Reset password',
      `http://localhost:50946/reset-password/${token}`,
    );
    return response.status(201).json({
      success: true,
    });
  } catch (error) {
    return response.status(400).json({
      success: false,
      message: 'Error while reset password',
    });
  }
};

exports.login = async (request, response) => {
  const errorMessage = 'Incorrect username or password';
  const { email, password } = request.body;

  const user = await User.findOne({ email });
  if (!user) {
    return response.status(400).json({
      success: false,
      message: errorMessage,
    });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  const jwtToken = jwt.sign(
    { email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '432000s' },
  );

  if (isPasswordCorrect) {
    return response.status(200).json({
      success: true,
      token: jwtToken,
    });
  }
  return response.status(400).json({
    success: false,
    message: errorMessage,
  });
};

exports.getAllUsers = async (request, response) => {
  const users = await User.find({}, { email: 1, role: 1 });
  response.status(200).json({
    success: true,
    results: users.length,
    data: users,
  });
};

exports.deleteUser = async (request, response) => {
  const user = await User.findById(request.params.id);
  if (user) {
    user.delete();
    response.status(201).json({
      success: true,
    });
  } else {
    response.status(404).json({
      success: false,
      message: 'User is not found',
    });
  }
};
