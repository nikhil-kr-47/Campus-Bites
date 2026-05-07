const mongoose=require('mongoose');
const passportLocalMongoose=require("passport-local-mongoose").default;
const userSchema=mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phoneNo:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:["admin","user"],
        default:"user"
    }
});
userSchema.plugin(passportLocalMongoose);
const User=mongoose.model("User",userSchema);
module.exports=User;