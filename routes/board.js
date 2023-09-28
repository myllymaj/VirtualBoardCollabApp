const express = require('express')
const router = express.Router()

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
require('dotenv').config()


router.get('/', async (req, res) => {
    const boards = await prisma.Board.findMany()
    console.log("boards GET")
    res.send(boards)

})



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
