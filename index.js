const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const mongo = process.env.MONGO || 'mongodb://localhost/minhas-series-rest'
const User = require('./models/user')
const jwt = require('jsonwebtoken')
const jwtSecret = 'abc123abc123abc123'

const bodyParser = require('body-parser')
app.use((bodyParser.json))

const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const series = require('./routes/series')
app.use('/series', series)

app.post('/auth', async(req, res) => {
    console.log(req.body)
    const user = req.body
    const userDb = await User.findOne({username: user.username})
    console.log(userDb)
    if(userDb){
        if(userDb.password === user.password){
            const payload = {
                id: userDb._id,
                username: userDb.username,
                roles: userDb.roles
            }
            console.log(payload)
            jwt.sign(payload, jwtSecret, (req, res) => {
                res.send({
                    success: true,
                    token: token
                })
            })                     
        }else{ 
                res.send({ success: false, message: 'wrong credentials'})
        }
    }else{
        res.send({ success: false, message: 'wrong credentials'})
    }   
})


const createInicialUsers = async() => {
    const total = await User.count({})
    if(total===0){
        const user = new User({
            username: 'carlos',
            password: '123456',
            roles: ['restrito', 'admin']
        })
        await user.save()

        const user2 = new User({
            username: 'restrito',
            password: '123456',
            roles: ['restrito']
        })
        await user2.save()
    }
}

mongoose
.connect(mongo, { useNewUrlParser: true })
.then(() =>{
    createInicialUsers()
    app.listen(port, () => console.log('Listening...'))
})
.catch( e => console.log(e))



