const express = require('express')
const routeManager = express.Router()
const { PrismaClient } = require('@prisma/client')
require('dotenv').config()





routeManager.get('/boards', async (req, res) => {
    const userId = req.user.userId;
  
    try {
     
        const availableBoards = await Board.find({ ownerId: userId });
        res.json(availableBoards);
      } catch (error) {
        console.error(error);
        res.status(500).send({ msg: 'ERROR', error: 'Internal server error' });

      }
    });
module.exports = routeManager