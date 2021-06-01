const{ObjectId} = require("mongodb"); //använder mongodb
const jwt = require("jsonwebtoken"); //använder jsonwebtoken se modules.js kommentar
const cookieParser = require("cookie-parser"); //se modules.js kommentar
const mod = require("./modules"); //använder modules.js filen
const bcrypt = require("bcryptjs"); //använder bcrypt
const secret = process.env.secret; //se modules.js kommentar

module.exports = function(app,songs,users){
    app.get("/",function(req,res){ 
        res.sendfile(__dirname+"/static/index.html");
    });

    //Hämtar sångnamn och liknande från databasen
    app.get("/getsongs", async function(req, res){
        res.send(await songs.find().toArray());
    });


    //slänger iväg dig till musikhemsidan
    app.get("/music", mod.checkToken,function(req, res){
        res.sendFile(__dirname+"/static/music.html");
    });


    //registrerar en ny användare när du kallar på "/register"
    app.get("/register", function(req, res)
    {
    res.sendFile(__dirname + "/static/register.html");
    });

    app.post("/register", mod.userExist, function(req, res)
    {
    let user = req.body;

    user.username = mod.fixString(user.username);

    bcrypt.hash(user.password, 12, async function(err, hash){

    
      if(err) return res.send("Registrerings fel pajas");

      user.password = hash;
      user.cart = [];
      
      req.users.insertOne(user);
      
      //sparar användare med hashade lösenord

      let token = mod.generateToken(user);
      console.log(token);
      res.cookie("token", token, {httpOnly:true, maxAge:600*1000, sameSite:"lax"}); //sätter kakorna som håller dig inloggad
      res.redirect("/music"); //skickar iväg dig inloggad till musikhemsidan
    });
    });



    app.get("/login", function(req, res)
    {
    res.sendFile(__dirname + "/static/login.html");
    });

    app.post("/login", async function(req, res)
    {
    

    //kollar om användaren existerar
    let user = req.body;
    let userCheck = await req.users.findOne({username:req.body.username});
    if(userCheck)
    {
      //kolla om lösenordet stämmer
      let checkPassword = await bcrypt.compare(user.password, userCheck.password);
      if(!checkPassword) return res.send("Fel lösenord");
      
      let token = mod.generateToken(userCheck); //skapapar en jwt token 

      res.cookie("token", token, {httpOnly:true, maxAge:900*1000, sameSite:"lax"});
      res.redirect("/music");
    }
    else
    {
      res.send("Ingen användare hittades!");
    }
    });


    //logga ut
    app.get("/logout", async function(req, res){
    try {
      res.clearCookie("token");
    } catch {}
    res.redirect("/");
    });
}