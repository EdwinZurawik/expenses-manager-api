const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Transaction = require('../../models/transactionModel');
// Read env variables before importin app
dotenv.config({ path: './.env' });

const DB = process.env.MONGO.replace('<PASSWORD>', process.env.MONGO_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log('MONGO connection successfull!'));

// READ JSON FILE

const transactions = JSON.parse(
  fs.readFileSync(`${__dirname}/transactions.json`, 'utf-8')
);

// IMPORT DATA INTO DBg

const importData = async () => {
  try {
    await Transaction.create(transactions);
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB

const deleteData = async () => {
  try {
    await Transaction.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv.includes('--import')) {
  importData();
} else if (process.argv.includes('--delete')) {
  deleteData();
}

console.log(process.argv);
