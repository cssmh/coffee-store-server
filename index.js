const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
require("dotenv").config();
const port = 5000;

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://coffee-store-63246.web.app",
      "https://coffee-master.netlify.app",
    ],
    credentials: true,
  })
);
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
    const cartCollection = client.db("coffeeMaster").collection("cart");

    app.post("/coffees", async (req, res) => {
      try {
        const result = await coffeeCollection.insertOne(req.body);
        res.send(result);
      } catch (error) {
        console.log(error);
        res.status(500).send("Error inserting coffee");
      }
    });

    app.get("/coffees", async (req, res) => {
      try {
        const result = await coffeeCollection.find().toArray();
        res.send(result);
      } catch (error) {
        console.log(error);
        res.status(500).send("Error fetching coffees");
      }
    });

    app.delete("/delete/:idx", async (req, res) => {
      try {
        const query = { _id: new ObjectId(req.params.idx) };
        const result = await coffeeCollection.deleteOne(query);
        res.send(result);
      } catch (error) {
        console.log(error);
        res.status(500).send("Error deleting coffee");
      }
    });

    app.get("/coffee-update/:id", async (req, res) => {
      try {
        const query = { _id: new ObjectId(req.params.id) };
        const result = await coffeeCollection.findOne(query);
        res.send(result);
      } catch (error) {
        console.log(error);
        res.status(500).send("Error fetching coffee for update");
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
        res.status(500).send("Error updating coffee");
      }
    });

    app.post("/cart", async (req, res) => {
      try {
        const result = await cartCollection.insertOne(req.body);
        res.send(result);
      } catch (error) {
        console.log(error);
        res.status(500).send("Error adding to cart");
      }
    });

    app.get("/cart", async (req, res) => {
      try {
        const result = await cartCollection.find().toArray();
        res.send(result);
      } catch (error) {
        console.log(error);
        res.status(500).send("Error fetching cart items");
      }
    });

    app.delete("/cart/:id", async (req, res) => {
      try {
        const query = { _id: new ObjectId(req.params?.id) };
        const result = await cartCollection.deleteOne(query);
        res.send(result);
      } catch (error) {
        console.log(error);
        res.status(500).send("Error fetching cart items");
      }
    });

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. Successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Welcome to Coffee Master Server");
});

app.listen(port, () => {
  console.log("CRUD RUNNING SUCCESSFULLY");
});
