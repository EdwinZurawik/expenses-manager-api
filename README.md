# expenses-manager-api

Backend application for Expenses Manager

## Running application

To run application use:

1. `npm start` - for running in **development** mode
1. `npm run start:prod` - for running in **production** mode

## Logging

Morgan middleware used for logging is active only in **development** mode

## Importing dev-data

1. `node dev-data/data/import-dev-data.js --import` - to import data into db
1. `node dev-data/data/import-dev-data.js --delete` - to delete data from db
