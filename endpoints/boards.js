const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
require('dotenv').config()







router.post('/', async (req, res) => {
    try {


        const newBoard = await prisma.Board.create({
            data: {
                board: req.body.board,
                createdBy: req.body.createdBy
            }
        });
    

        console.log("User created:", newBoard);
        res.status(201).send({ msg: 'Board created', newBoard });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send({ msg: 'ERROR', error: 'Internal server error' });
    } finally {
        await prisma.$disconnect();
    }
});



    module.exports = router;
