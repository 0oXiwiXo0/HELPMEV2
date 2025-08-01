const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');


const db = require('../config/test'); // Fichier où la connexion MongoDB est configurée

router.post('/tickets', async (req, res) => {
  try {
    const result = await db.collection('tickets').insertOne({
      name: req.body.city,
      uuid: uuidv4()
    });
    res.status(201).json({ message: 'ticket ajouté', id: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'ajout du ticket' });
  }
});

module.exports = router;