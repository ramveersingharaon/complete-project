const jwt = require("jsonwebtoken");
const Register = require("../models/register");

const auth = async (req,res,next)=>{
    try {
        
const token = req.cookies.jwt; //This is broweser cookies
const verifyUser = jwt.verify(token, process.env.SECRET_KEY); //Here usertoken verify
console.log(verifyUser);

const user =await Register.findOne({_id:verifyUser._id});
console.log(user);

req.token = token;
req.user= user;

next();

    } catch (error) {
        res.status(401).send(error)
    }
}

module.exports = auth;