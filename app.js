const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const nsq = require('nsqjs');

const pkg = require('./package.json');
//Router
const router = require('./routes');

// Handle global exception
process.on('uncaughtException', (err) => {
  console.log(err);
});

// Create express application
const app = express();

/**
 * Config and middleware
 */
app.set('port', process.env.PORT || 3000); // Set default port to 3000
app.use(bodyParser.json());
app.use(compression());

// CORS header
app.all('/*', function(req, res, next) {
  // CORS headers
  res.header('Access-Control-Allow-Origin', '*'); // restrict it to the required domain
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  // Set custom headers for CORS
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
  if (req.method == 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});

// Router
app.use('/api/v1', router);
app.use('/api/v1', require('./lib/schema_error_handler'));

// Swagger
const swaggerSpec = swaggerJSDoc({
  swaggerDefinition: {
    info: {
      title: "API",
      version: pkg.version,
    },
  },
  apis: ['./routes/index.js'],
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * Start application
 */
if (require.main === module) {
  app.listen(app.get('port'), () => {
    console.log(`express application is listening at port ${app.get('port')}`);
  });
}
if (process.env.NODE_ENV !== 'production') {
  require('./socket');
}

/**
 * Export app for test
 */
module.exports = app;
