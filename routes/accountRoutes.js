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

router.use(authController.protect);

router
  .route('/myAccount')
  .get(
    authController.protect,
    accountController.getMe,
    accountController.getAccount
  )
  .patch(authController.protect, accountController.updateMe)
  .delete(authController.protect, accountController.deleteMe);

router.use(authController.restrictTo('admin'));
router
  .route('/')
  .get(accountController.getAllAccounts)
  .post(accountController.createAccount);
router
  .route('/:id')
  .delete(accountController.deleteAccount)
  .patch(accountController.updateAccount)
  .get(accountController.getAccount);

module.exports = router;
