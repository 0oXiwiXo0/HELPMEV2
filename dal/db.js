const { MongoClient } = require("mongodb");
require("dotenv").config();

const client = new MongoClient(process.env.DB_URL);
const db = client.db(process.env.DB_NAME);

client
  .connect()
  .then(() => console.log("Connexion à MongoDB réussie"))
  .catch((err) => {
    console.log("Erreur de connexion à MongoDB. ", err);
    process.exit(1);
  });

const ticketsCollection = db.collection("tickets");
const usersCollection = db.collection("users");

module.exports = { ticketsCollection, usersCollection };
