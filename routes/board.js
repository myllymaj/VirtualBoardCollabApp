const express = require('express')
const router = express.Router()

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
require('dotenv').config()


router.get('/:id', async (req, res) => {
    try {


        const board = await prisma.Board.findUnique({
            where: { id: req.params.id },
            select: { board: true } 
        });

        if (!board) {
            return res.status(404).send({ msg: 'Board not found' });
        }

   
        res.status(200).send({ boardName: board.board });
    } catch (error) {
        console.error(error);
        res.status(500).send({ msg: 'Internal server error' });
    }
});


router.post('/', async (req, res) => {
    try {

        const newBoard = await prisma.Board.create({
            data: {
                board: req.body.board,
                userId: req.authUser.sub
            }
        });
        /*
        //ändra på responsen vid behov?
        const dataMessage = {

            id: newBoard.id,
            board: newBoard.board,
            userId: newBoard.userId
        };
        */
        res.status(201).send(newBoard)




    } catch (error) {

        res.status(500).send({ msg: 'ERROR', error: 'Internal server error' });
    }
});



module.exports = router
