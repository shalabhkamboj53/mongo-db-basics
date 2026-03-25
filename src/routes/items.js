const express = require("express");
const mongoose = require("mongoose");

const validateCrudUser = require("../middleware/validateCrudUser");
const CrudUser = require("../models/CrudUser");

const router = express.Router();

function parseId(idParam) {
  return mongoose.isValidObjectId(idParam) ? idParam : null;
}

router.get("/", async (req, res, next) => {
  try {
    const users = await CrudUser.find({}, { name: 1, _id: 1 });
    res.status(200).json({ data: users });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  const id = parseId(req.params.id);
  if (!id) {
    return res.status(400).json({ message: "Invalid user id" });
  }

  try {
    const user = await CrudUser.findById(id, { name: 1, _id: 1 });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ data: user });
  } catch (error) {
    next(error);
  }
});

router.post("/", validateCrudUser, async (req, res, next) => {
  try {
    const user = await CrudUser.create({ name: req.body.name });
    res.status(201).json({ data: user });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", validateCrudUser, async (req, res, next) => {
  const id = parseId(req.params.id);
  if (!id) {
    return res.status(400).json({ message: "Invalid user id" });
  }

  try {
    const user = await CrudUser.findByIdAndUpdate(
      id,
      { name: req.body.name },
      { new: true, runValidators: true },
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ data: user });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  const id = parseId(req.params.id);
  if (!id) {
    return res.status(400).json({ message: "Invalid user id" });
  }

  try {
    const deletedUser = await CrudUser.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
