const Bill = require('../models/billModel');
const factory = require('./handlerFactory');

exports.getAllBills = factory.getAll(Bill);
exports.getBill = factory.getOne(Bill);
exports.createBill = factory.createOne(Bill);
exports.updateBill = factory.updateOne(Bill);
exports.deleteBill = factory.deleteOne(Bill);
