const mongoose = require('mongoose');
const dotenv = require('dotenv');
// Read env variables before importin app
dotenv.config({ path: './.env' });

const app = require('./app');

const DB = process.env.MONGO.replace('<PASSWORD>', process.env.MONGO_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log('MONGO connection successfull!'));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}...`);
});
