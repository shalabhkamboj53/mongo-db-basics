const express = require('express');
const {
  setupDatabase,
  seedData,
  readOperations,
  queryOperators,
  projectionOperations,
  updateOperations,
  deleteOperations,
  sortingAndLimiting,
  countAndDistinct,
  indexingAndPerformance,
  userAggregation,
  ordersCollectionTasks,
  finalAssignmentQueries,
} = require('../services/taskService');

const router = express.Router();

router.post('/setup', async (req, res, next) => {
  try {
    const result = await setupDatabase();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.post('/seed', async (req, res, next) => {
  try {
    const result = await seedData();
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/users/read', async (req, res, next) => {
  try {
    const result = await readOperations(req.query.city || 'Delhi');
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/users/operators', async (req, res, next) => {
  try {
    const result = await queryOperators();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/users/projection', async (req, res, next) => {
  try {
    const result = await projectionOperations();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.patch('/users/update', async (req, res, next) => {
  try {
    const result = await updateOperations();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.delete('/users/delete', async (req, res, next) => {
  try {
    const result = await deleteOperations();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/users/sort-limit', async (req, res, next) => {
  try {
    const result = await sortingAndLimiting();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/users/count-distinct', async (req, res, next) => {
  try {
    const result = await countAndDistinct();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.post('/users/indexing', async (req, res, next) => {
  try {
    const result = await indexingAndPerformance();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/users/aggregation', async (req, res, next) => {
  try {
    const result = await userAggregation();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/orders/tasks', async (req, res, next) => {
  try {
    const result = await ordersCollectionTasks();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/assignment/final', async (req, res, next) => {
  try {
    const result = await finalAssignmentQueries();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
