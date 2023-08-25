const express = require('express');
const userController = require('../controllers/userController');
const { check } = require('express-validator');
const isAdminMiddleware = require('../middlewares/isAdminMiddleware');
const isLoggedInMiddleware = require('../middlewares/isLoggedInMiddleware');

const router = express.Router();

/**
 * @swagger
 * /users/signup/{token}:
 *   post:
 *     tags:
 *       - Users
 *     summary: Signup with an invite token
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         description: Invite token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Signup successful
 */

router.post(
  '/signup/:token',
  check('password')
    .isLength({ min: 6 })
    .withMessage('Must be at least 6 chars long')
    .matches(/\d/)
    .withMessage('Must contain a number')
    .matches(/[A-Za-z]/)
    .withMessage('Must contain a character'),
  userController.sungUp
);

/**
 * @swagger
 * /users/check-token/{token}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Check if a reset password token is valid
 *     description: Returns a status indicating if the token is valid or not.
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         description: Token to check validity
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Token is valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: valid
 *       400:
 *         description: Token is invalid or expired
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: invalid
 *       404:
 *         description: Token not found
 */

router.get('/check-token/:token', userController.checkResetPasswordToken);

/**
 * @swagger
 * /users/reset-password/{token}:
 *   post:
 *     tags:
 *       - Users
 *     summary: Reset user password using a token
 *     description: Allows a user to reset their password using a provided token.
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         description: Token to validate the password reset
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 description: New password to set for the user
 *                 example: Example123
 *     responses:
 *       200:
 *         description: Password reset successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password reset successfully
 *       400:
 *         description: Invalid data or token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid token or password requirements not met
 *       404:
 *         description: Token not found
 */

router.post(
  '/reset-password/:token',
  check('password')
    .isLength({ min: 6 })
    .withMessage('Must be at least 6 chars long')
    .matches(/\d/)
    .withMessage('Must contain a number')
    .matches(/[A-Za-z]/)
    .withMessage('Must contain a character'),
  userController.resetPassword
);

/**
 * @swagger
 * /users/change-password/:
 *   post:
 *     tags:
 *       - Users
 *     summary: Change the password for an authenticated user
 *     description: Allows an authenticated user to change their password.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - new_password
 *             properties:
 *               new_password:
 *                 type: string
 *                 description: The new password the user wishes to set
 *                 example: NewPassword123
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password changed successfully
 *       400:
 *         description: Invalid data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid password requirements not met
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Not authorized
 */

router.post(
  '/change-password/',
  isLoggedInMiddleware,
  check('new_password')
    .isLength({ min: 6 })
    .withMessage('Must be at least 6 chars long')
    .matches(/\d/)
    .withMessage('Must contain a number')
    .matches(/[A-Za-z]/)
    .withMessage('Must contain a character'),
  userController.changePassword
);

/**
 * @swagger
 * /users/change-email:
 *   post:
 *     tags:
 *       - Users
 *     summary: Change the email for an authenticated user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 description: The new email the user wishes to set
 *                 example: newemail@example.com
 *     responses:
 *       200:
 *         description: Email changed successfully
 */

router.post(
  '/change-email',
  isLoggedInMiddleware,
  check('email').isEmail().withMessage('Email is invalid'),
  userController.changeEmail
);

/**
 * @swagger
 * /users/login:
 *   post:
 *     tags:
 *       - Users
 *     summary: Authenticate a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logged in successfully
 */

router.post('/login', userController.login);

/**
 * @swagger
 * /users/forgot-password:
 *   post:
 *     tags:
 *       - Users
 *     summary: Initiate password reset for a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset initiated
 */

router.post(
  '/forgot-password',
  check('email').isEmail().withMessage('Email is invalid'),
  userController.forgotPassword
);

/**
 * @swagger
 * /users/change-role/{id}:
 *   put:
 *     tags:
 *       - Users
 *     summary: Change role of a user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum:
 *                   - user
 *                   - admin
 *     responses:
 *       200:
 *         description: Role changed successfully
 */

router.put(
  '/change-role/:id',
  isAdminMiddleware,
  check('role').isIn(['user', 'admin']).withMessage('Role is not available'),
  userController.changeRole
);

/**
 * @swagger
 * /users/:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get all users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 */

router.get('/', isAdminMiddleware, userController.getAllUsers);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Delete a user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 */

router.delete('/:id', isAdminMiddleware, userController.deleteUser);

module.exports = router;
