const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors package
const { register, httpRequestDurationMicroseconds, requestCount } = require('./metrics');
const router = require('./routes');
const { sequelize } = require('./models');

const app = express();
const port = 3001;

app.use(bodyParser.json());

// Middleware to record metrics
app.use((req, res, next) => {
  const end = httpRequestDurationMicroseconds.startTimer();
  res.on('finish', () => {
    end({ method: req.method, route: req.route ? req.route.path : req.path, code: res.statusCode });
    requestCount.inc({ method: req.method, route: req.route ? req.route.path : req.path, code: res.statusCode });
  });
  next();
});

// CORS configuration to allow all origins
app.use(cors({ credentials: true }));

// Prometheus metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.get('/api/v2/', (req, res) => {
  res.json({ message: "Welcome to the Express Todo API" });
});

app.use('/', router);

app.listen(port, '0.0.0.0', async () => {
  await sequelize.sync();
  console.log(`Server is running on port ${port}`);
});
