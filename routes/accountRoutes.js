const express = require('express');
const authController = require('../controllers/authController');
const accountController = require('../controllers/accountController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword
);

router.patch('/myAccount', authController.protect, accountController.updateMe);
router.delete('/myAccount', authController.protect, accountController.deleteMe);

router.get('/accounts', accountController.getAllAccounts);
router.get('/accounts/:id', accountController.getAccount);

module.exports = router;
