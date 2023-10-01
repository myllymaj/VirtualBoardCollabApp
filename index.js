const express = require('express');
const authorizeToken = require('./middleware/auth')
const PORT = process.env.PORT || 3030
const app = express();
const cors = require('cors')
app.use(cors())
app.use(express.json())




app.use('/', express.static(__dirname + '/public/login'))


const usersEndpoint = require('./routes/users.js')
app.use('/users', usersEndpoint)


const boardsEndpoint = require('./routes/board.js')
app.use('/board',authorizeToken, boardsEndpoint)




app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`)
})