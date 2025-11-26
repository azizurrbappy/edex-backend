const express = require('express');
const app = express();
const port = process.env.PORT || 4000;
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB DataBase
const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const db = client.db('edex');
    const coursesCollection = db.collection('courses');
    const instructorsCollection = db.collection('instructors');

    // all apis endpoint
    app.get('/courses', async (req, res) => {
      const cursor = coursesCollection.find();
      const result = await cursor.toArray();

      res.send(result);
    });

    app.get('/managecourse', async (req, res) => {
      const { email } = req.query;
      const query = { email: email };

      const cursor = coursesCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post('/courses', async (req, res) => {
      const newProperty = req.body;
      const result = await coursesCollection.insertOne(newProperty);
      res.send(result);
    });

    app.delete('/courses/:id', async (req, res) => {
      const { id } = req.params;
      const query = { _id: new ObjectId(id) };

      const result = await coursesCollection.deleteOne(query);
      res.send(result);
    });

    app.get('/instructors', async (req, res) => {
      const cursor = instructorsCollection.find();
      const result = await cursor.toArray();

      res.send(result);
    });

    await client.db('admin').command({ ping: 1 });
    console.log('You successfully connected to MongoDB!');
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

// Server Status
app.get('/', (req, res) => {
  res.send('Server is running...');
});

app.listen(port, () => {
  console.log(`eDex listening on port ${port}`);
});
