

const mongoose = require('mongoose');

const todosSchema = mongoose.Schema({
    title : {type : String, required : true},
    content : {type : String, required : true},
    status : {type : String, default : false},
    time : {type : String, default : Date.now().toString()}
})


const Todos = mongoose.model('todo',todosSchema);

module.exports = Todos;