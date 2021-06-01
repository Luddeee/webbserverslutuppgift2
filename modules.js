const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const secret = process.env.secret;

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

function generateToken(user)
{
    let {_id} = user;
    let token = jwt.sign({_id}, secret, {expiresIn:600});
    return token;
}
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

module.exports = {userExist, generateToken, checkToken, fixString};