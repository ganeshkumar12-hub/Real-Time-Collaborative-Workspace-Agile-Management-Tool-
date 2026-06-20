require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = require("./config/db");

const User = require("./models/User");
const Workspace = require("./models/Workspace");
const Board = require("./models/Board");
const List = require("./models/List");
const Card = require("./models/Card");

const seed = async () => {
  await connectDB();

  await User.create({
    name: "Test User",
    email: "test@example.com",
    password: "123456",
  });

  console.log("Collections Created");
  process.exit();
};

seed();
