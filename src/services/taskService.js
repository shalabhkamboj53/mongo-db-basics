const mongoose = require("mongoose");
const User = require("../models/User");
const Order = require("../models/Order");
const { users: seedUsers, buildOrders } = require("../data/seedData");

async function setupDatabase() {
  const db = mongoose.connection.db;
  const existingCollections = await db.listCollections().toArray();
  const names = new Set(existingCollections.map((c) => c.name));

  if (!names.has("users")) {
    await db.createCollection("users");
  }

  if (!names.has("orders")) {
    await db.createCollection("orders");
  }

  return {
    database: db.databaseName,
    collections: ["users", "orders"],
  };
}

async function seedData() {
  await setupDatabase();
  await User.deleteMany({});
  await Order.deleteMany({});

  const firstUser = await User.create(seedUsers[0]);

  const insertedUsers = await User.insertMany(seedUsers.slice(1));
  const orders = buildOrders(insertedUsers);
  const insertedOrders = await Order.insertMany(orders);

  return {
    insertedOneUser: firstUser,
    insertedManyUsersCount: insertedUsers.length,
    insertedOrdersCount: insertedOrders.length,
  };
}

async function readOperations(city = "Yamunanagar") {
  const allUsers = await User.find();
  return { allUsers };
}

async function queryOperators() {
  const gt = await User.find({ age: { $gt: 29 } });
  const lt = await User.find({ age: { $lt: 29 } });
  const gte = await User.find({ age: { $gte: 29 } });
  const lte = await User.find({ age: { $lte: 29 } });
  const inQuery = await User.find({ city: { $in: ["Yamunanagar", "Mohali"] } });
  const ne = await User.find({ city: { $ne: "Yamunanagar" } });
  const andQuery = await User.find({
    $and: [{ age: { $gte: 29 } }, { city: "Rajasthan" }],
  });
  const orQuery = await User.find({
    $or: [{ city: "Rajasthan" }, { age: { $lt: 29 } }],
  });

  return { gt29: gt, lt29: lt, gte29: gte, lte29: lte, inYM: inQuery, neY: ne, andGte29R: andQuery, orRLt29: orQuery };
}

async function projectionOperations() {
  const nameCityOnly = await User.find({}, { name: 1, city: 1 });
  const nameCityWithoutId = await User.find({}, { name: 1, city: 1, _id: 0 });

  return { nameCityOnly, nameCityWithoutId };
}

async function updateOperations() {
  const updatedSingle = await User.findOneAndUpdate(
    { name: "Vishal" },
    { $set: { city: "Udaipur" } },
  );

  const updatedMany = await User.updateMany(
    { age: { $lt: 30 } },
    { $inc: { age: 1 } },
  );

  return { updatedSingle, updatedMany };
}

async function deleteOperations() {
  const deletedOne = await User.findOneAndDelete({ name: "Shalabh" });
  const deletedByCondition = await User.deleteMany({ age: { $lt: 29 } });

  return { deletedOne, deletedByConditionLt29: deletedByCondition };
}

async function sortingAndLimiting() {
  const ageAscending = await User.find().sort({ age: 1 });
  const ageDescending = await User.find().sort({ age: -1 });
  const top2Users = await User.find().sort({ age: -1 }).limit(2);

  return { ageAscending, ageDescending, top2Users };
}

async function countAndDistinct() {
  const totalUsers = await User.countDocuments();
  const distinctCities = await User.distinct("city");

  return { totalUsers, distinctCities };
}

async function indexingAndPerformance() {
  const explainBefore = await User.find({
    email: "shalabh@example.com",
  }).explain("executionStats");

  await User.collection.createIndex(
    { email: 1 },
    { unique: true, sparse: true },
  );
  
  const explainAfter = await User.find({
    email: "shalabh@example.com",
  }).explain("executionStats");

  return {
    createdIndex: "email_1",
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

async function userAggregation() {
  const matchedUsers = await User.aggregate([
    { $match: { age: { $gte: 25 } } },
  ]);

  const groupedUsersByCity = await User.aggregate([
    {
      $group: {
        _id: "$city",
        usersCount: { $sum: 1 },
        averageAge: { $avg: "$age" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return { matchedUsers, groupedUsersByCity };
}

async function ordersCollectionTasks() {
  const completedOrders = await Order.find({ status: "completed" }).populate(
    "userId",
    "name city",
  );

  const totalRevenue = await Order.aggregate([
    { $match: { status: "completed" } },
    { $group: { _id: null, totalRevenue: { $sum: "$amount" } } },
  ]);

  const ordersPerUser = await Order.aggregate([
    { $group: { _id: "$userId", ordersCount: { $sum: 1 } } },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $project: {
        _id: 0,
        userId: "$user._id",
        name: "$user.name",
        ordersCount: 1,
      },
    },
  ]);

  const sortedOrdersByDate = await Order.find().sort({ orderDate: -1 });

  return {
    completedOrders,
    totalRevenue: totalRevenue[0]?.totalRevenue || 0,
    ordersPerUser,
    sortedOrdersByDate,
  };
}

async function finalAssignmentQueries() {
  const topUsersMaxOrders = await Order.aggregate([
    { $group: { _id: "$userId", ordersCount: { $sum: 1 } } },
    { $sort: { ordersCount: -1 } },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $project: {
        _id: 0,
        userId: "$user._id",
        name: "$user.name",
        ordersCount: 1,
      },
    },
  ]);

  const totalRevenue = await Order.aggregate([
    { $match: { status: "completed" } },
    { $group: { _id: null, totalRevenue: { $sum: "$amount" } } },
  ]);

  const ordersGroupedByStatus = await Order.aggregate([
    {
      $group: {
        _id: "$status",
        ordersCount: { $sum: 1 },
        totalAmount: { $sum: "$amount" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const averageOrderValue = await Order.aggregate([
    { $group: { _id: null, averageOrderValue: { $avg: "$amount" } } },
  ]);

  return {
    topUsersMaxOrders,
    totalRevenue: totalRevenue[0]?.totalRevenue || 0,
    ordersGroupedByStatus,
    averageOrderValue: averageOrderValue[0]?.averageOrderValue || 0,
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
  userAggregation,
  ordersCollectionTasks,
  finalAssignmentQueries,
};
