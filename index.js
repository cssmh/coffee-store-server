const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// mongo code
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ae0fypv.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const coffeeCollection = client.db("coffeeDB").collection("coffees");
    const userCollection = client.db("coffeeDB").collection("users");

    // create a coffee to database
    app.post("/coffees", async (req, res) => {
      const getDataFromClient = req.body;
      console.log(getDataFromClient);
      const result = await coffeeCollection.insertOne(getDataFromClient);
      res.send(result);
    });

    // get coffee from database and show to client
    app.get("/coffees", async (req, res) => {
      const cursor = coffeeCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    // delete a coffee from database
    app.delete("/delete/:idx", async (req, res) => {
      const paramsId = req.params.idx;
      const query = { _id: new ObjectId(paramsId) };
      const result = await coffeeCollection.deleteOne(query);
      res.send(result);
    });
    // Update coffee part
    // first get that unique id
    app.get("/coffee-update/:id", async (req, res) => {
      const paramsId = req.params.id;
      const query = { _id: new ObjectId(paramsId) };
      const result = await coffeeCollection.findOne(query);
      res.send(result);
    });
    // Update coffee part end
    // time to update to database
    app.put("/update/:id", async (req, res) => {
      const paramsId = req.params.id;
      const filter = { _id: new ObjectId(paramsId) };
      const updatedInfoFromClient = req.body;
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          name: updatedInfoFromClient.name,
          chef: updatedInfoFromClient.chef,
          price: updatedInfoFromClient.price,
          taste: updatedInfoFromClient.taste,
          category: updatedInfoFromClient.category,
          details: updatedInfoFromClient.details,
          photo: updatedInfoFromClient.photo,
        },
      };

      const result = await coffeeCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });
    // update to database completed
    // users related apis
    app.post("/users", async (req, res) => {
      const getUserFromClient = req.body;
      // console.log(getUserFromClient);
      const result = await userCollection.insertOne(getUserFromClient);
      res.send(result);
    });
    // get all users
    app.get("/allUsers", async (req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    // get all users end
    // delete user
    app.delete("/user/delete/:id", async (req, res) => {
      const getParamsId = req.params.id;
      const query = { _id: new ObjectId(getParamsId) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });
    // delete user end
    // update/patch lastLoggedAt
    app.patch("/user-update", async (req, res) => {
      const getUpdatedInfo = req.body;
      const filter = { email: getUpdatedInfo.email };
      const updateDoc = {
        $set: {
          lastLoggedAt: getUpdatedInfo.lastLoggedAt,
        },
      };
      const result = await userCollection.updateOne(filter, updateDoc);
      res.send(result);
    });
    // update/patch lastLoggedAt end
    // users related apis end

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
// mongo code end

app.get("/", (req, res) => {
  res.send("Hello 5000 PORT");
});

app.listen(port, () => {
  console.log("CRUD RUNNING SUCCESSFULLY");
});
