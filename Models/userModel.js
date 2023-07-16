const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name : {type : String, required : true},
    email : {type : String, required : true},
    pass : {type : String, required : true},
    todo:[{type:mongoose.Schema.Types.ObjectId, ref:"todo"}]
})


const Users = mongoose.model('user',userSchema);

module.exports = Users;