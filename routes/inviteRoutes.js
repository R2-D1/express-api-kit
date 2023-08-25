const express = require("express");
const inviteController = require("../controllers/inviteController");
const {check} = require('express-validator');
const isAdminMiddleware = require("../middlewares/isAdminMiddleware");

const router = express.Router();

// invite user by email
router.post("/", isAdminMiddleware, check('email')
    .isEmail()
    .withMessage('Email is invalid'), inviteController.createInvite);

// check token is valid
router.get('/check-token/:token', inviteController.checkToken);

// get all invites
router.get('/', isAdminMiddleware, inviteController.getAllInvites);

// remove invite
router.delete('/:id', isAdminMiddleware, inviteController.deleteInvite);

module.exports = router;