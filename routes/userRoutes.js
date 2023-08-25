const express = require("express");
const userController = require("../controllers/userController");
const {check} = require('express-validator');
const isAdminMiddleware = require("../middlewares/isAdminMiddleware");
const isLoggedInMiddleware = require("../middlewares/isLoggedInMiddleware");


const router = express.Router();

// signup by invite token
router.post("/signup/:token",
    check('password')
        .isLength({min: 6})
        .withMessage('Must be at least 6 chars long')
        .matches(/\d/)
        .withMessage('Must contain a number')
        .matches(/[A-Za-z]/)
        .withMessage('Must contain a character'), userController.sungUp);

// check reset password token
router.get('/check-token/:token', userController.checkResetPasswordToken)

// reset password by token
router.post("/reset-password/:token",
    check('password')
        .isLength({min: 6})
        .withMessage('Must be at least 6 chars long')
        .matches(/\d/)
        .withMessage('Must contain a number')
        .matches(/[A-Za-z]/)
        .withMessage('Must contain a character'), userController.resetPassword);

// change my password
router.post("/change-password/", isLoggedInMiddleware,
    check('new_password')
        .isLength({min: 6})
        .withMessage('Must be at least 6 chars long')
        .matches(/\d/)
        .withMessage('Must contain a number')
        .matches(/[A-Za-z]/)
        .withMessage('Must contain a character'), userController.changePassword);

// change email
router.post("/change-email", isLoggedInMiddleware, check('email')
    .isEmail()
    .withMessage('Email is invalid'), userController.changeEmail);

router.post("/login", userController.login);

router.post("/forgot-password", check('email')
    .isEmail()
    .withMessage('Email is invalid'), userController.forgotPassword);

router.put("/change-role/:id", isAdminMiddleware, check('role')
    .isIn(['user', 'admin'])
    .withMessage('Role is not available'), userController.changeRole);

// get all users
router.get('/', isAdminMiddleware, userController.getAllUsers);

// remove user
router.delete('/:id', isAdminMiddleware, userController.deleteUser);

module.exports = router;