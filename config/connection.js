const mongoose = require('mongoose');

// the URL for connecting to the MongoDB database
const connectionString = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/SocialSparkDB';

// connect to the database using the URL
mongoose.connect(connectionString);

// log a message when successfully connected to the database
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to the database.');
});

// log any errors that occur during the connection
mongoose.connection.on('error', (err) => {
  console.error(`Mongoose connection error: ${err}`);
});

// log a message if the connection to the database is lost
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected from the database.');
});

// Export the connection object
module.exports = mongoose;