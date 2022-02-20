const Debt = require('../models/debtModel');
const factory = require('./handlerFactory');

exports.getAllDebts = factory.getAll(Debt);
exports.getDebt = factory.getOne(Debt);
exports.createDebt = factory.createOne(Debt);
exports.updateDebt = factory.updateOne(Debt);
exports.deleteDebt = factory.deleteOne(Debt);
