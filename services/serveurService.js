const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017/test';
const client = new MongoClient(uri);

let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db('test');
    console.log('Connecté à MongoDB');
  } catch (error) {
    console.error('Erreur de connexion à MongoDB:', error);
  }
}

connectDB();

module.exports = db;