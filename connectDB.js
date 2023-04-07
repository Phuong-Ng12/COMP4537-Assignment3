const { mongoose } = require('mongoose')
const dotenv = require("dotenv")
dotenv.config();

const connectDB = async (input) => {
  try {
    const x = await mongoose.connect(process.env.DB_STRING)
    console.log("Connected to db");
    if (input.drop === true){
        console.log("Dropped db");
        mongoose.connection.db.dropDatabase();
    }
      
    // get the data from Github 
  } catch (error) {
    console.log('db error');
  }
}

module.exports = { connectDB }