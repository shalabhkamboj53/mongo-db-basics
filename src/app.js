const express = require('express');
const swaggerUi = require('swagger-ui-express');
const taskRoutes = require('./routes/taskRoutes');
const swaggerSpec = require('./config/swagger');
const CRUDRoutes = require('./routes/items');

// Custom middleware to add timestamp to each request
const addTimeStamp = require('./middleware/addTimeStamp');

const app = express();

app.use(express.json());
app.use(addTimeStamp);

app.use('/api', taskRoutes);
app.use('/user', CRUDRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.use((err, req, res, next) => {
  res.status(500).json({
    message: err.message || 'Internal server error',
  });
});

module.exports = app;
