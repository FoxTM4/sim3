require('dotenv').config();
const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const axios = require('axios')
const massive = require('massive')
const port = 8888

const app= express()

const {
    SERVER_PORT,
REACT_APP_DOMAIN,
REACT_APP_CLIENT_ID,
CLIENT_SECRET,
CONNECTION_STRING,
SECRET
}= process.env;

massive(CONNECTION_STRING).then(db=>app.set('db',db))

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}))

app.get('/auth/callback', async (req,res)=>{
   
    let payload = {
        client_id: REACT_APP_CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: req.query.code,
        grant_type: 'authorization_code',
        redirect_uri: `http://${req.headers.host}/auth/callback`
    }
    let resWithToken= await axios.post(`https://${REACT_APP_DOMAIN}/oauth/token`,payload) 
    let resWithData = await axios.get(`https://${REACT_APP_DOMAIN}/userinfo?access_token=${resWithToken.data.access_token}`)
    console.log(resWithData.data)
    req.session.user = resWithData.data
    res.redirect('http://localhost:3002')
})

app.get('/auth/logout', (req,rew)=>{
    req.session.destroy();
    res.redirect('http://localhost:3002/#/')
})

app.listen(SERVER_PORT, ()=>(console.log(`server listening on port ${SERVER_PORT}`)))