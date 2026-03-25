const express = require('express');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

app.use(express.json());

app.use('/api', taskRoutes);

app.use((err, req, res, next) => {
  res.status(500).json({
    message: err.message || 'Internal server error',
  });
});

module.exports = app;
