const express = require('express')
const router = express.Router()

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
require('dotenv').config()

router.post('/', async (req, res) => {
  try {
    const { content, color, x, y, boardId } = req.body;

    // Check if the board with the specified boardId exists
    const board = await prisma.board.findUnique({
      where: {
        id: boardId,
      },
    });

    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }

    const savedNote = await prisma.note.create({
      data: {
        content,
        color,
        x,
        y,
        board: {
          connect: { id: boardId },
        },
      },
    });

    res.status(201).json(savedNote);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Failed to create a note' });
  }
});

//get all notes that have same boardId
router.get('/', async (req, res) => {
  try {
    const boardId = req.query.boardId; 
    console.log(boardId)
    if (!boardId) {
      return res.status(400).json({ error: 'Missing boardId query parameter' });
    }

    const notes = await prisma.note.findMany({
      where: {
      },
    });

    res.send(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve notes' });
  }
});
router.patch('/:id', async (req, res) => {
  try {
    const { content, color, x, y } = req.body;
    const updatedNote = await prisma.note.update({
      where: { id: req.params.id.toString() }, // Convert id to string
      data: {
        content,
        color,
        x,
        y,
        updatedAt: new Date(),
      },
    });

    res.json(updatedNote);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Failed to update the note' });
  }
});
  
 // Delete a note by ID
 router.delete('/:id', async (req, res) => {
  try {
    await prisma.note.delete({
      where: { id: req.params.id.toString() }, // Convert id to integer
    });

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Failed to delete the note' });
  }
});

module.exports = router
