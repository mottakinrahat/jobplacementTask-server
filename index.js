const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());



// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yimfqcp.mongodb.net/?retryWrites=true&w=majority`;
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@cluster0.dujofhq.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});






async function run() {
  try {
    await client.connect();


    const postCollection = client.db('jobPlacementTask').collection('postData');
    const userCollection = client.db('jobPlacementTask').collection('userData');

    app.post('/dataOfPost', async (req, res) => {
      try {
        const body = req.body;
        const result = await postCollection.insertOne(body);
        res.send(result);
      } catch (error) {
        console.error('Error in personalInfo route:', error);
        res.status(500).json({ error: 'An error occurred' });
      }
    });

    app.get('/dataOfPost', async (req, res) => {
      const result = await postCollection.find().toArray();
      res.send(result);
    })
    app.post('/userData', async (req, res) => {
      try {
        const body = req.body;
        const result = await userCollection.insertOne(body);
        res.send(result);
      } catch (error) {
        console.error('Error in personalInfo route:', error);
        res.status(500).json({ error: 'An error occurred' });
      }
    });
    app.get('userData', async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    })
    app.get('/dataOfPost/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await postCollection.findOne(query);
      res.send(result);
    });

    app.get('/userData', async (req, res) => {
      try {
        let query = {};
        if (req.query.email) {
          query = { email: req.query.email };
        }
        const result = await userCollection.find(query).toArray();
        res.send(result);
      } catch (error) {
        console.error('Error in /personalInfo route:', error);
        res.status(500).json({ error: 'An error occurred' });
      }
    });



    app.get('/userData/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.findOne(query);
      res.send(result);
    });
    app.put('/userData/:id', async (req, res) => {
      const id = req.params.id;
      const updateUser = req.body;

      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateUserData = {
        $set: {

          image: updateUser.image,
          address: updateUser.address,
          name: updateUser.name,
          universityName: updateUser.universityName

        },
      };
      const result = await userCollection.updateOne(filter, updateUserData, options);
      res.send(result);
    });




    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
app.get('/', (req, res) => {
  res.send('social is running ');
});

app.listen(port, () => {
  console.log(`port is running on ${port}`);
});