const cookieParser = require("cookie-parser"); //kakorna
const jwt = require("jsonwebtoken"); //jsonwebtoken som läggs i kakorna och ser till så att du förblir inloggad i 15 minuter. (se kommentar nedan) även den du måste ha för att komma in
const secret = process.env.secret; //säkerhetsnyckel (som streamernyckel i obs)


//kollar om användaren existerar
async function userExist(req, res, next)
{
    try {
        let usern = await req.users.findOne({username:req.body.username});

        if(usern)
        {
            return res.send("User exist");
        }

        next();
    } 
    catch (error) 
    {
        res.send(error.message);
    }
}

//genererar din jsonwebtoken
function generateToken(user)
{
    let {_id} = user;
    let token = jwt.sign({_id}, secret, {expiresIn:600}); //sätter attribut för token
    return token;
}

//kollar om det finns en token
function checkToken(req, res, next)
{
    try 
    {
        console.log(req.cookie)
        let token = req.cookies.token;
        token = jwt.verify(token,secret);
        req.userid = token._id;
        console.log(token);
        next();
    }
    catch/*  (error)  */
    {
        res.redirect("/login");
        /* console.log("bög"); */
    }
}


//ser till så att du inte kan skriva in kod i forms (säkerhet)
function fixString(text) {
    var map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
      "`": '&#039;'
    };
    
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

module.exports = {userExist, generateToken, checkToken, fixString}; //skickar tillbaks