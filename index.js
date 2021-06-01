const{MongoClient} = require("mongodb");
require("dotenv").config();
const uri = process.env.MONGO;
const client = new MongoClient(uri,{useUnifiedTopology: true});
const cookieParser = require("cookie-parser");


async function run(){
    try{

    
    await client.connect();
    const database = client.db("slutprojektv2");
    const songs = database.collection("songs");
    const users = database.collection('users');

    const express = require("express");
    const app = express();

    app.use(function(req,res,next){
        req.songs = songs;
        req.users = users;
        next();
    });

    app.use(cookieParser());

    app.use(express.static("static"));
    app.use(express.urlencoded({extended:false}));
    app.listen(3400);


    require("./routes.js")(app,songs,users);
    
    }
    finally{}
}
run();