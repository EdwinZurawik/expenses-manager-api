const fs = require('fs');

const sourceEnvFilePath = `${__dirname}/../.env.dist`;
const destEnvFilePath = `${__dirname}/../.env`;

// New .env file will overwrite the old one if present
fs.copyFile(sourceEnvFilePath, destEnvFilePath, (err) => {
  if (err) throw err;
  console.log('.env.dist was copied to .env');
});