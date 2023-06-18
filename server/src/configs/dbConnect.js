const mongoose = require("mongoose");
const dbConnect = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL);
    if (conn.connection.readyState === 1) {
      console.log("Db connection is successfully");
    } else {
      console.log("Db connecting");
    }
  } catch (error) {
    console.log(error);
    console.log("Db connection is failed");
    throw new Error(error);
  }
};

module.exports = dbConnect;
