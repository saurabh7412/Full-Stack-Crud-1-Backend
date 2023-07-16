const jwt = require("jsonwebtoken");
const BL = require("../Models/blacklistModel");
const Users = require("../Models/userModel");

const Auth = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    res.status(400).send("Login First !");
  }

  const checkBL = await BL.findOne({ token });

  if (checkBL) {
    res.status(400).send("Token Expired !");
  }


  const decoded = jwt.verify(token, "abc123");

//   console.log(decoded);

  if (!decoded) {
    res.send("User not Authorized");
  } else {
    let result = await Users.findById(decoded.userID);

    if(result){
        req.body.uniqueID = decoded.userID;
        req.body.uniqueEmail = decoded.email;
        next()
    }
    else{
        res.status(400).json({error:"User does not exist in auth"})
    }
  }
};

module.exports = Auth;
