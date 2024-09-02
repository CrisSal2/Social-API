const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 27017;

const connectionStringURI = `mongodb://127.0.0.1:27017`;

const client = new MongoClient(connectionStringURI);

let db;

const dbName = 'socialAPI';

client.connect()
  .then(() => {
    console.log('connected successfully to MongoDB');

    db = client.db(dbName);

    app.listen(PORT, () => {
        console.log(`App listening at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Mongo connection error: ', err.message);
});

app.use(express.json());

