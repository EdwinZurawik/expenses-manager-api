const express = require('express');
const debtController = require('../controllers/debtController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(debtController.getAllDebts)
  .post(debtController.createDebt);
router
  .route('/:id')
  .get(debtController.getDebt)
  .patch(debtController.updateDebt)
  .delete(debtController.deleteDebt);

module.exports = router;
