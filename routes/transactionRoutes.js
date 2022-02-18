const express = require('express');
const transactionController = require('../controllers/transactionController');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/monthly-report').get(transactionController.getMonthlyReport);

router.route('/stats').get(transactionController.getTransactionStats);

router
  .route('/top-5-expenses')
  .get(
    transactionController.aliasTopExpenses,
    transactionController.getAllTransactions
  );

router
  .route('/')
  .get(authController.protect, transactionController.getAllTransactions)
  .post(transactionController.createTransaction);
router
  .route('/:id')
  .get(transactionController.getTransaction)
  .patch(transactionController.updateTransaction)
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    transactionController.deleteTransaction
  );

module.exports = router;
