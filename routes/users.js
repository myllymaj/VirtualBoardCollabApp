const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
require('dotenv').config()


router.get('/', async (req, res) => {
    const users = await prisma.User.findMany()
    console.log("users GET")
    res.send(users)

})







router.get('/:id', async (req, res) => {

    const user = await prisma.User.findUnique({
        where: { id: req.params.id }
    })


    res.send({ msg: 'users', user: user })
})


router.post('/login', async (req, res) => {
    try {
        const user = await prisma.User.findUnique({
            where: { email: req.body.email }
        })

        if (user == null) {
            return res.status(404).send({ msg: 'ERROR', error: 'User not found' })
        }

        const match = await bcrypt.compare(req.body.password, user.password)

        if (!match) {
            return res.status(401).send({ msg: 'ERROR', error: 'Wrong password' })
        }

        const token = await jwt.sign({
            sub: user.id,
            email: user.email,
            username: user.username,
            roles: user.roles,
            boards: user.boards,
            expiresIn: '1d'
        }, process.env.JWT_SECRET)




        res.send({ token: token, msg: "Login successful", userId: user.id, username: user.username, roles: user.roles, boards: user.boards })

    } catch (error) {
        res.status(500).send({ msg: 'ERROR', error: 'Internal server error' })
    }

})

router.post('/', async (req, res) => {
    try {
        const hash = await bcrypt.hash(req.body.password, 12);

        const user = await prisma.User.create({
            data: {
                username: req.body.username,
                email: req.body.email,
                password: hash,
                roles: req.body.roles,
                boards: req.body.boards
            },
        });

        console.log("User created:", user);
        res.status(201).send({ msg: 'User created', user });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send({ msg: 'ERROR', error: 'Internal server error' });
    } finally {
        await prisma.$disconnect();
    }
});
/*
router.patch('/:id', async (req, res) => {

    if (req.params.id != req.authUser.sub) {
        res.status(403).send({
            msg: 'ERROR',
            error: 'Cannot patch other users'
        })
    }

    const hash = null
    if (req.body.password) {
        hash = await bcrypt.hash(req.body.password, 12)
    }

    const user = await prisma.User.update({
        where: {
            id: req.params.id,
        },
        data: {
            password: hash,
            name: req.params.name,
            updatedAt: new Date()
        },
    })
    res.send({
        msg: 'patch',
        id: req.params.id,
        user: user
    })
})

router.delete('/:id', async (req, res) => {

    try {

        const user = await prisma.User.delete({
            where: {
                id: req.params.id,
            }
        })
        res.send({
            msg: 'deleted',
            id: req.params.id,
            user: user
        })
    } catch (err) {

        console.log(err)
        res.send({
            msg: 'ERROR',
            error: err
        })
    }
})
*/

module.exports = router