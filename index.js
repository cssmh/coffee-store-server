const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
require("dotenv").config();
const port = 5000;

app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const coffeeCollection = client.db("coffeeMaster").collection("coffees");
    const userCollection = client.db("coffeeMaster").collection("users");

    app.post("/coffees", async (req, res) => {
      try {
        const result = await coffeeCollection.insertOne(req.body);
        res.send(result);
      } catch (error) {
        console.log(error);
      }
    });

    app.get("/coffees", async (req, res) => {
      try {
        const result = await coffeeCollection.find().toArray();
        res.send(result);
      } catch (error) {
        console.log(error);
      }
    });

    app.delete("/delete/:idx", async (req, res) => {
      try {
        const query = { _id: new ObjectId(req.params.idx) };
        const result = await coffeeCollection.deleteOne(query);
        res.send(result);
      } catch (error) {
        console.log(error);
      }
    });

    app.get("/coffee-update/:id", async (req, res) => {
      try {
        const query = { _id: new ObjectId(req.params.id) };
        const result = await coffeeCollection.findOne(query);
        res.send(result);
      } catch (error) {
        console.log(error);
      }
    });

    app.put("/update/:id", async (req, res) => {
      try {
        const filter = { _id: new ObjectId(req.params.id) };
        const updatedDoc = {
          $set: {
            name: req.body.name,
            chef: req.body.chef,
            price: req.body.price,
            taste: req.body.taste,
            category: req.body.category,
            details: req.body.details,
            photo: req.body.photo,
          },
        };

        const result = await coffeeCollection.updateOne(filter, updatedDoc, {
          upsert: true,
        });
        res.send(result);
      } catch (error) {
        console.log(error);
      }
    });

    app.post("/users", async (req, res) => {
      try {
        const result = await userCollection.insertOne(req.body);
        res.send(result);
      } catch (error) {
        console.log(error);
      }
    });

    app.get("/allUsers", async (req, res) => {
      try {
        const result = await userCollection.find().toArray();
        res.send(result);
      } catch (error) {
        console.log(error);
      }
    });

    // get all users end
    // delete user
    app.delete("/user/delete/:id", async (req, res) => {
      try {
        const query = { _id: new ObjectId(req.params.id) };
        const result = await userCollection.deleteOne(query);
        res.send(result);
      } catch (error) {
        console.log(error);
      }
    });

    // delete user end
    // update/patch lastLoggedAt
    app.patch("/user-update", async (req, res) => {
      try {
        const filter = { email: req.body.email };
        const updateDoc = {
          $set: {
            lastLoggedAt: getUpdatedInfo.lastLoggedAt,
          },
        };
        const result = await userCollection.updateOne(filter, updateDoc);
        res.send(result);
      } catch (error) {
        console.log(error);
      }
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. Successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);
// mongo code end

app.get("/", (req, res) => {
  res.send("Welcome to Coffee Master Server");
});

app.listen(port, () => {
  console.log("CRUD RUNNING SUCCESSFULLY");
});
