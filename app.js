

console.log("enter")
const express = require('express')
const app = express()
const dotenv = require('dotenv').config();
const port = process.env.PORT   
const postRouter = require('./routes/post_routes.js') 
const mongoose =require("mongoose");



mongoose.connect(process.env.DB_CONNECT)
const db =mongoose.connection;
db.on("error",console.error.bind(console, "connection error"));
db.once("open",function(){
    console.log("connected to the db")
})
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))



app.use('/posts',postRouter)

app.listen(port, () => {
     console.log(`Example app listening on port ${port}`)})