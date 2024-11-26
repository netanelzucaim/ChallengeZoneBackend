const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const port = process.env.PORT   
const commentRouter = require('./routes/comment_routes.js') 
const postRouter = require('./routes/post_routes.js') 

const mongoose =require("mongoose");



mongoose.connect(process.env.DB_CONNECT)
const db =mongoose.connection;
db.on("error",console.error.bind(console, "connection error:"));
db.once("open",function(){
    console.log("connected to the database");
})
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));



app.use('/posts',postRouter)
app.use('/comments',commentRouter)
app.listen(port, () => {
     console.log(`Example app listening on port ${port}`);
})