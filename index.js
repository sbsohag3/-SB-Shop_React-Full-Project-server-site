const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@sbshop.szt3m.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const productsCollection = client.db("sb_shop").collection("products");
    const bookingCollection = client.db("sb_shop").collection("booking");
    const reviewsCollection = client.db("sb_shop").collection("reviews");
    const userCollection = client.db("sb_shop").collection("user");

    app.get("/products", async (req, res) => {
      const query = {};
      const cursor = productsCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);
    });


    app.get("/reviews", async (req, res) => {
      const query = {};
      const cursor = reviewsCollection.find(query);
      const reviews = await cursor.toArray();
      res.send(reviews);
    });

 app.get("/booking", async (req, res) => {
   const patient = req.query.patient;

   const decodedEmail = req.decoded.email;
   if (patient === decodedEmail) {
     const query = { patient: patient };
     const bookings = await bookingCollection.find(query).toArray();
     return res.send(bookings);
   } else {
     return res.status(403).send({ message: "Forbidden access" });
   }
 });

 app.get("/booking/:id", async (req, res) => {
   const id = req.params.id;
   const query = { _id: ObjectId(id) };
   const booking = await bookingCollection.findOne(query);
   res.send(booking);
 });

 app.post("/booking", async (req, res) => {
   const booking = req.body;
   const result = await bookingCollection.insertOne(booking);
   return res.send( result);
 });

     app.get("/user",  async (req, res) => {
       const users = await userCollection.find().toArray();
       res.send(users);
     });

  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
