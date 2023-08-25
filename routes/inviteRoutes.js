const express = require("express");
const inviteController = require("../controllers/inviteController");
const {check} = require('express-validator');
const isAdminMiddleware = require("../middlewares/isAdminMiddleware");

const router = express.Router();

/**
 * @swagger
 * /invites:
 *   post:
 *     summary: Invite user by email
 *     description: Send an invitation to a user by email.
 *     tags:
 *       - Invitations
 *     parameters:
 *       - name: email
 *         description: Email address to send the invitation to.
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Invitation successfully sent.
 *       400:
 *         description: Invalid email provided.
 */

router.post("/", isAdminMiddleware, check('email')
    .isEmail()
    .withMessage('Email is invalid'), inviteController.createInvite);

/**
 * @swagger
 * /invites/check-token/{token}:
 *   get:
 *     summary: Check if a token is valid
 *     tags:
 *       - Invitations
 *     parameters:
 *       - name: token
 *         description: Token to check validity for.
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Token is valid.
 *       400:
 *         description: Token is invalid or expired.
 */

router.get('/check-token/:token', inviteController.checkToken);

/**
 * @swagger
 * /invites:
 *   get:
 *     summary: Get all invites
 *     description: Retrieve a list of all invites.
 *     tags:
 *       - Invitations
 *     responses:
 *       200:
 *         description: List of all invites.
 */

router.get('/', isAdminMiddleware, inviteController.getAllInvites);

/**
 * @swagger
 * /invites/{id}:
 *   delete:
 *     summary: Remove an invite
 *     description: Delete an invite by its ID.
 *     tags:
 *       - Invitations
 *     parameters:
 *       - name: id
 *         description: ID of the invite to delete.
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Invite successfully deleted.
 *       404:
 *         description: Invite not found.
 */

router.delete('/:id', isAdminMiddleware, inviteController.deleteInvite);

module.exports = router;