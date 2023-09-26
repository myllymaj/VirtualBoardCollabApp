const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

require('dotenv').config()


router.post('/boards', async (req, res) => {
  const { title, ownerId } = req.body; // Destructure the title and ownerId from the request body

  try {
    // Check if the user exists (you didn't provide the code for this, so I'm assuming you have a way to check)
    if (!userExists(ownerId)) {
      return res.status(404).json({ message: 'Användaren hittades inte' });
    }

    const newBoard = await prisma.board.create({
      data: {
        title,
        ownerId,
      },
    });

    res.status(201).json(newBoard); // Respond with the newly created board
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: 'ERROR', error: 'Internal server error' });
  }
});

router.get('/boards', async (req, res) => {
    const userId = req.user.userId;
  
    try {
     
      const availableBoards = await prisma.board.findMany({
        where: { ownerId: userId },
      });
      

        res.json(availableBoards);
      } catch (error) {
        console.error(error);
        res.status(500).send({ msg: 'ERROR', error: 'Internal server error' });

      }
    });
    module.exports = router;
