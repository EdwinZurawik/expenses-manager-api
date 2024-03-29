# expenses-manager-api

Backend application for Expenses Manager

## Development

Before running application make sure to:

1. Clone project with: `git@github.com:EdwinZurawik/expenses-manager-api.git`
1. `npm install` in the project directory to install all dependencies
1. `node dev-data/copy-env.js` to copy **.env.dist** file to **.env**
1. Fill all missing environment variables in the **.env** file
1. Run `docker-compose up -d --build` to start containers.

## Running application

To run application use:

1. `npm start` - for running in **development** mode
1. `npm run start:prod` - for running in **production** mode

## Logging

Morgan middleware used for logging is active only in **development** mode

## Importing dev-data

1. `node dev-data/data/import-dev-data.js --import` - to import data into db
1. `node dev-data/data/import-dev-data.js --delete` - to delete data from db
