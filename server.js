const express = require('express');
const bodyParser = require('body-parser');
const about = require('./utils/about.json');
var cors = require('cors');
var fs = require('fs');
require('dotenv').config();
const logger = require('./utils/logger');
const swaggerUI = require('swagger-ui-express');
const swaggerDef = require('./utils/swagger.json');
const db = require('./utils/db');
const port = process.env.PORT || 9000;
const baseURL = process.env.BASE_URL;

// db init
// db init

db.connect();
const app = express();

// Récupération des toutes les routes dans le dossier routes
fs.readdir('./routes', (err, files) => {
  try {
    files.forEach((file) => {
      if (file !== '.wh..wh..opq') app.use('/', require('./routes/' + file));
    });
    logger.info('Router initialized');
  } catch (err) {
    logger.warn(`ERROR on routes:  ${err}`);
  }
});
// Logger and about response
app.use((req, res, next) => {
  logger.info(`${req.method} url: ${req.url}`);
  next();
});

app.get('/test', async (req, res) => {
  res.json({ message: 'pass!' });
});

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDef));
/**
 * @swagger
 * /:
 *   get:
 *     description: Welcome to Smart Trash Can API !
 *     responses:
 *       200:
 *         description: Returns a description of service.
 */
app.get('/', (req, res) => {
  res.send(about);
});

app.use(
  cors({
    origin: '*',
    credentials: true,
    exposedHeaders: ['set-cookie']
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => logger.info(`Server listening on port ${baseURL}`));
}

module.exports = app;
