const jwt = require('jsonwebtoken')
require('dotenv').config() 

module.exports = (req, res, next) => {
    try {

        // plocka ut jwt från headern
        const token = req.headers['authorization'].split(' ')[1]
        
        // verifiera token och spara användarinfo
        const authUser = jwt.verify(token, process.env.JWT_SECRET)

        // spara användarinfo i req
        req.authUser = authUser

        console.log("info " + req.authUser)

        next()

    } catch (error) {
        console.log("JWT error: ", error.message)
        res.status(401).send({
            msg: "Authorization failed",
            error: error.message
        })

    }

}

