const mongoose = require('mongoose');
const User = require('../models/User');
const Order = require('../models/Order');
const { users: seedUsers, buildOrders } = require('../data/seedData');

async function setupDatabase() {
  const db = mongoose.connection.db;
  const existingCollections = await db.listCollections().toArray();
  const names = new Set(existingCollections.map((c) => c.name));

  if (!names.has('users')) {
    await db.createCollection('users');
  }

  if (!names.has('orders')) {
    await db.createCollection('orders');
  }

  return {
    database: db.databaseName,
    collections: ['users', 'orders'],
  };
}

async function seedData() {
  await setupDatabase();
  await User.deleteMany({});
  await Order.deleteMany({});

//   const firstUser = await User.create({
//     name: 'First User',
//     age: 23,
//     city: 'Jaipur',
//   });

  const insertedUsers = await User.insertMany(seedUsers);
  const orders = buildOrders(insertedUsers);
  const insertedOrders = await Order.insertMany(orders);

  return {
    insertedOneUser: firstUser,
    insertedManyUsersCount: insertedUsers.length,
    insertedOrdersCount: insertedOrders.length,
  };
}

async function readOperations(city = 'Delhi') {
  const allUsers = await User.find();
  const usersByCity = await User.find({ city });
  const usersAgeGreaterThan25 = await User.find({ age: { $gt: 25 } });

  return { allUsers, usersByCity, usersAgeGreaterThan25 };
}

async function queryOperators() {
  const gt = await User.find({ age: { $gt: 25 } });
  const lt = await User.find({ age: { $lt: 30 } });
  const gte = await User.find({ age: { $gte: 30 } });
  const lte = await User.find({ age: { $lte: 25 } });
  const inQuery = await User.find({ city: { $in: ['Delhi', 'Mumbai'] } });
  const ne = await User.find({ city: { $ne: 'Delhi' } });
  const andQuery = await User.find({ $and: [{ age: { $gte: 25 } }, { city: 'Mumbai' }] });
  const orQuery = await User.find({ $or: [{ city: 'Delhi' }, { age: { $lt: 23 } }] });

  return { gt, lt, gte, lte, in: inQuery, ne, and: andQuery, or: orQuery };
}

async function projectionOperations() {
  const nameCityOnly = await User.find({}, { name: 1, city: 1 });
  const nameCityWithoutId = await User.find({}, { name: 1, city: 1, _id: 0 });

  return { nameCityOnly, nameCityWithoutId };
}

async function updateOperations() {
  const updatedSingle = await User.findOneAndUpdate(
    { name: 'First User' },
    { $set: { city: 'Udaipur' } },
    { new: true }
  );

  const updatedMany = await User.updateMany({ age: { $lt: 30 } }, { $inc: { age: 1 } });
  const withEmail = await User.updateMany({ email: { $exists: false } }, { $set: { email: 'unknown@example.com' } });

  return { updatedSingle, updatedMany, withEmail };
}

async function deleteOperations() {
  const deletedOne = await User.findOneAndDelete({ name: 'First User' });
  const deletedByCondition = await User.deleteMany({ age: { $lt: 24 } });

  return { deletedOne, deletedByCondition };
}

async function sortingAndLimiting() {
  const ageAscending = await User.find().sort({ age: 1 });
  const ageDescending = await User.find().sort({ age: -1 });
  const top5Users = await User.find().sort({ age: -1 }).limit(5);

  return { ageAscending, ageDescending, top5Users };
}

async function countAndDistinct() {
  const totalUsers = await User.countDocuments();
  const distinctCities = await User.distinct('city');

  return { totalUsers, distinctCities };
}

async function indexingAndPerformance() {
  const explainBefore = await User.find({ email: 'priya@example.com' }).explain('executionStats');
  await User.collection.createIndex({ email: 1 }, { unique: true, sparse: true });
  const explainAfter = await User.find({ email: 'priya@example.com' }).explain('executionStats');

  return {
    createdIndex: 'email_1',
    before: {
      docsExamined: explainBefore.executionStats.totalDocsExamined,
      keysExamined: explainBefore.executionStats.totalKeysExamined,
      winningStage: explainBefore.queryPlanner.winningPlan.stage,
    },
    after: {
      docsExamined: explainAfter.executionStats.totalDocsExamined,
      keysExamined: explainAfter.executionStats.totalKeysExamined,
      winningStage: explainAfter.queryPlanner.winningPlan.stage,
    },
  };
}

module.exports = {
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
};
