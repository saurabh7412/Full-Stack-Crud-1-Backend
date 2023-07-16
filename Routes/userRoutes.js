const express = require('express');

const router = express.Router();

const Users = require('../Models/userModel');

const BL = require('../Models/blacklistModel');

const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');



router.get('/', async (req,res)=>{
    try {
        const users = await Users.find();
        res.send({AllUsers : users})
    } catch (error) {
        res.status(400).send(error)
    }
})



router.post('/register', async(req,res)=>{
    try {
        const {email, pass} = req.body;

        const userCheck = await Users.findOne({email});

        if(userCheck){
            res.status(400).send('User Already Exist !')
        }

        if( !/[A-Z]/.test(pass)  || !/[0-9]/.test(pass) || !/[!@#$%^&*()<>?]/.test(pass) || pass.length < 8){
            res.status(400).send('Make Correct Password !')
        }

        const newpass = await bcrypt.hash(pass,10);
        
        const newUser = await Users.create({...req.body, pass : newpass});

        res.status(200).send({msg : "New User Registered ! ", newUser : newUser})


    } catch (error) {
        res.status(400).send(error)
    }
})




// router.post('/register', async(req,res)=>{
//     try {

//         const {name,email,pass} = req.body;

//         const user = await Users.findOne({email: email})

//         if(user){
//             return res.status(400).json({error : "User Already Exist !"})
//         }

//         if( !/[A-Z]/.test(pass) || !/[0-9]/.test(pass) || !/[!@#$%^&*():"<>?]/.test(pass) || pass.length <8){
//             return res.status(400).json({error: "Password is not valid !"})
//         }


//         const newpass = await bcrypt.hash(pass,10);


//         const newUser = await Users.create({...req.body, pass : newpass});

//         res.json({msg : "'New User Added !'", User : newUser})
//     } catch (error) {
//         res.send(error)
//     }
// })


router.post('/login', async(req,res)=>{
    try {
        const {email,pass} = req.body;
        
        const userCheck = await Users.findOne({email});

        if(!userCheck){
            res.status(400).send('User Not Found ! Register First...')
        }

        const verify = await bcrypt.compare(pass,userCheck.pass)
        if(!verify) {  
             res.status(400).send('Wrong Password')
        }

        const token = jwt.sign({userID : userCheck._id, email : userCheck.email}, 'abc123', {expiresIn : '5d'});

        res.status(200).send({msg : 'Login Successful', token});
        
    } catch (error) {
        res.status(400).send(error)
    }
})


router.get('/logout', async(req,res)=>{
    const token = req.headers.authorization;
    console.log(token);
    if(!token){
        res.status(400).send('Login First !')
    }

    const BlackListed = await BL.findOne({token});
    if(BlackListed) {
        res.status(400).send('Token already expried')
    }
    else{
        const blacklist = await BL.create({token});

        res.status(200).send({msg: "User Logged Out !"})
    }


})


// router.patch('/edit/:id', async(req,res)=>{

// })










// router.post('/login', async(req,res)=>{
//     try {

//         const {name,email, pass} = req.body;

//         const data = await Users.findOne({email});

//         // console.log(data);

//         if(!data){
//             res.send('Login First');
//         }


//         bcrypt.compare(pass,data.pass, function(err,result){
//             if(err){
//                 res.send('Wrong Credentials')
//             }else{
//                 const token =  jwt.sign({userID : data._id, username : name} , "secret123",{expiresIn: '4d'})
//             }
//         })
        // const verify = await bcrypt.compare(pass, data.pass);

        // if(!verify){
        //     res.send("Wrong Password")
        // }else{
        //     const token =  jwt.sign({userID : data._id} , "secret123",{expiresIn: '4d'})

        //     const refreshToken = jwt.sign({userID : data._id},'secret1234',{expiresIn : '7d'})

        //     res.send({"msg": 'Login Successful', "token" : token, "refresh Token": refreshToken})
        // }

//     } catch (error) {
//         res.send(error)
//     }
// })


// router.get('/logout', async (req,res)=>{
//     try {
//         const token = req.headers.authorization?.split(" ")[1];
        
//         if(!token) res.send('Login first');

//         else{
//             await BL.create({token})

//             res.send('Logged Out !')
//         }
//     } catch (error) {
//         res.send(error)
//     }
// })


// router.get('/refreshToken', (req,res)=>{
//     const rToken = req.headers.authorization.split(" ")[1];

//     if(!rToken) res.send("Login Again");
    
//     const decoded = jwt.verify(rToken, 'secret1234');

//     if(decoded){
//         const token = jwt.sign({userID : req.body._id}, 'secret123',{expiresIn : '4d'});

//         res.send({token});
//     }else{
//         res.send("Invalid Token Req.")
//     }
// })


module.exports = router;