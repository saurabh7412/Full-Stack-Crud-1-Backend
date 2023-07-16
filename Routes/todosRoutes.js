const express = require('express');

const router = express.Router();

const Todos = require('../Models/todosModel');

const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');
const Auth = require('../MiddleWares/Auth');
const Users = require('../Models/userModel');


router.get('/get',Auth, async(req,res)=>{
    try {

        const {uniqueID} = req.body

        const user = await Users.findById(uniqueID).populate("todo")

        res.send({user:user})

    } catch (error) {
        res.send("error")
    }
})



router.post('/add',Auth, async(req,res)=>{
    try {
        const {uniqueID , title, content} = req.body;

        const newTodo = await Todos.create({title,content});

    
        const user = await Users.findById(uniqueID);
        console.log(user);

        if(!user ){
            res.status(400).send('Login First')
        }else{
            user.todo.push(newTodo._id)

             await user.save()
        }

        res.send({msg: "Todo Added" , user : user})
        
    } catch (error) {
        res.status(400).send(error)
    }
})


router.patch('/edit/:id',Auth, async (req,res)=>{
    try {
        const {uniqueID,title, status } = req.body ;
        const {id} = req.params;

        const newData = await Todos.findByIdAndUpdate(id, req.body);
        const data = await Todos.findById(id)

        console.log(data);

        res.status(200).send({msg : "Todo Updated", updated_Todo : data})

    } catch (error) {
        res.status(400).send(error)
    }
})

router.delete('/delete/:id',Auth, async (req,res)=>{
    try {
        const {uniqueID,title, status } = req.body ;
        const {id} = req.params;

        const deletedData = await Todos.findByIdAndDelete(id, req.body);

        res.status(200).send({msg : "Todo Deleted", updated_Todo : deletedData})

    } catch (error) {
        res.status(400).send(error)
    }
})


module.exports = router;