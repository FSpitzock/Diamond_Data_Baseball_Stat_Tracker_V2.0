const mongoose = require("mongoose");

const db = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/diamond-data";

mongoose.connect(db);

module.exports = mongoose.connection;