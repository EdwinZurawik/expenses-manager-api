const dotenv = require('dotenv');
// Read env variables before importin app
dotenv.config({ path: './.env' });

const app = require('./app');

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}...`);
});
